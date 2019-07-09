const express = require("express");
const router  = express.Router();
const gravatar =  require("gravatar");
const bcrypt = require("bcryptjs");

const userModel = require('../../models/user');

// @route GET api/users/test
// @desc Tests users route
// @access Public

router.get('/test',(req,res) => res.json({
    msg:"Users Works"
}));

// @route POST api/users/register
// @desc Register user 
// @access Public
router.post('/register', (req, res) =>{

    // 기존 모델내의 이메일 유무 체크 
    userModel
        .findOne({email:req.body.email})
        .then(user => {
            if(user)// 이메일이 있을 경우
            {
                return res.status(400).json({
                    email: "email already exists"
                });
            }
            else // 이메일이 없을 경우 
            {
                // 아바타 생성
                 const avatar = gravatar.url(req.body.email, {
                    s:'200' ,//size
                    r:'pg' ,//Rating
                    d:'mm' //Default
                });
                //유저 모델 내용 사용자 입력
                const newUser = new userModel({
                    name : req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password
                });
                // 패스워드 암호화
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        //데이터 베이스 저장
                        newUser
                            .save()
                            .then(user =>{
                                res.status(200).json(user);
                            })
                            .catch(err => {
                                res.status(400).json({
                                    error:err
                                });
                            });

                    })
                })
            }
        })
        .catch(err => {
            res.status(401).json({
                error:err
            });
        });

               
                

});




module.exports = router;