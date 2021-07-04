const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.auth_signup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email},(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'error occured'
            })
        }else if(data!==null){
            res.send({
                success:false,
                message:'user already exists'
            })
        }else{
            bcrypt.hash(password,3,(err,hash) => {
                const newUser = new User({
                    email:email,
                    password:hash
                })
                newUser.save((err,data) => {
                    if(err){
                        res.send({
                            success:false,
                            message:'error occured'
                        })
                    }else{
                        if(data!==null || data!==undefined){
                            res.send({
                                success:true,
                                message:'signup successfull'
                            })
                        }
                    }
                })   
            })
        }
    })
};

exports.auth_signin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email},function(err,user){
        if(err){
            res.send({
                success:false,
                message:'error occured'
            });
        }else if(err===null && user===null){
            res.send({
                success:false,
                message:'user not found'
            })
        }
        else{
            
            bcrypt.compare(password, user.password, function(err, result) {  
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
    })

};
