const bcrypt = require('bcrypt');
const con = require('../mysql');

exports.user_change_password = (req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    const q = `select * from users where email = '${email}';`

    con.query(q,(err,results) => {
        if(err){
            res.send({
                success:false,
                message:'error occured'
            })
        }else{
            if(results.length!==0){
                bcrypt.compare(password, results[0].password, function(err, result) {  
                    if(result===true){
                        bcrypt.hash(newPassword,3,(err3,hash) => {
                            if(err3){
                                res.send({
                                    success:false,
                                    message:'failed to change password'
                                });
                            }else{
                                const q2 = `update users set password = '${hash}' where email = '${email}'`;
                                con.query(q2,(err,results) => {
                                    if(err){
                                        res.send({
                                            success:false,
                                            message:'failed to change password'
                                        });
                                    }else{
                                        if(results.changedRows>0){
                                            res.send({
                                                success:true,
                                                message:'password changed successfully'
                                            });
                                        }else{
                                            res.send({
                                                success:false,
                                                message:'failed to change password'
                                            });
                                        }
                                    }
                                })
                            }
                        })
                    }else{
                        res.send({
                            success:false,
                            message:'old password is incorrect'
                        });
                    }
                });
            }else{
                res.send({
                    success:false,
                    message:'failed to change password'
                });
            }
        }
    })
}