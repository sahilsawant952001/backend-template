const User = require("../Models/User");
const bcrypt = require('bcrypt');

exports.user_change_password = (req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    User.findOne({email:email},(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'error occured'
            })
        }else{
            if(data!==null || data!==undefined){
                bcrypt.compare(password, data.password, function(err, result) {  
                    if(result===true){
                        bcrypt.hash(newPassword,3,(err3,hash) => {
                            if(err3){
                                res.send({
                                    success:false,
                                    message:'failed to change password'
                                });
                            }else{
                                User.updateOne({email:email},{password:hash},(err2,data2) => {
                                    if(err2){
                                        res.send({
                                            success:false,
                                            message:'failed to change password'
                                        });
                                    }else{
                                        if(data2.nModified===1){
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