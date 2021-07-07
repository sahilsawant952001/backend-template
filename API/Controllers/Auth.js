const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const con = require('../mysql');
dotenv.config();

exports.auth_signup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const q = `select * from users where email = '${email}';`;

    con.query(q,(err,results) => {
        if(err){
            res.send({
                success:false,
                message:'error occured'
            });
        }else{
            if(results.length>0){
                res.send({
                    success:false,
                    message:'user already exists'
                })
            }
            else
            {
                bcrypt.hash(password,3,(err,hash) => {
                    const q2 = `insert into users (email,password) values ('${email}','${hash}');`
                    con.query(q2,(err,results1) => {
                        if(err){
                            res.send({
                                success:false,
                                message:'error occured'
                            });
                        }else{
                            if(results1.affectedRows>0){
                                const token = jwt.sign(
                                    {
                                        email:email
                                    },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn:'1h'
                                    }
                                )
                                res.send({
                                    success:true,
                                    message:'user created',
                                    authToken:token
                                });
                            }else{
                                res.send({
                                    success:true,
                                    message:'failed to create user'
                                });
                            }
                        }
                    })
                })       
            }
        }
    })    
};

exports.auth_signin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const q = `select * from users where email = '${email}';`;
    con.query(q,(err,results) => {
        if(err){
            res.send({
                success:false,
                message:'error occured'
            });
        }else{
            if(results.length!==0){
                bcrypt.compare(password, results[0].password, function(err, result) {  
                    if(result===true){
                        const token = jwt.sign(
                            {
                                email:email
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn:'1h'
                            }
                        )
                        res.send({
                            success:true,
                            message:'signin successfull',
                            authToken:token
                        })
                    }else{
                        res.send({
                            success:false,
                            message:'incorrect password'
                        });
                    }
                });
            }
            else
            {
                res.send({
                    success:false,
                    message:'user not found'
                })
            }
        }
    })

};
