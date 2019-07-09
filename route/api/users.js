const express = require("express");
const router  = express.Router();
const gravatar =  require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys =  require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");

const checkAuth = passport.authenticate('jwt', {session: false});

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

    const {errors, isValid} = validateRegisterInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    // 기존 모델내의 이메일 유무 체크 
    userModel
        .findOne({email:req.body.email})
        .then(user => {
            if(user)// 이메일이 있을 경우
            {
                // return res.status(400).json({
                //     email: "email already exists"
                // });
                errors.email = "email already exists";
                return res.status(400).json(errors);
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


// @route POST api/users/login
// @desc  user  login & return jwt
// @access Public

router.post('/login', (req, res) => {

    userModel
        .findOne({email:req.body.email}) // 이메일 유무 체크 
        .then(user => {
            if(!user) // 메일이 없으면 에러 메세지 리턴
            {
                return res.status(400).json({
                    msg:"not found email"
                });

            }
            else // 메일이 있으면 
            {
                bcrypt // 사용자 입력 패스워드와 데이터 베이스 패스워드 비교
                    .compare(req.body.password, user.password)
                    .then(result => {
                        if(!result) // 패스워드가 불일치시...
                        {
                            return res.status(400).json({
                                msg: "password do not match"
                            });

                        }
                        //패스워드 일치시...
                        const payload = {id: user.id, name: user.name, avatar:user.avatar};

                        //토큰 생성
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn :3600},
                            (err,token) => {
                                res.json({
                                    result: "successful",
                                    token: "Bearer "+token
                                });
                            }
                        );

                        // res.status(200).json({
                        //     msg:"successful"
                        // });

                    })
                    .catch(err => {
                        res.status(400).json({
                            error:err
                        });
                    });

            }
        })
        .catch(err => {
            res.status(400).json({
                error:err
            });
        });

});


//@route GET api/users/current
//@desc  Return current user
//@access Private

router.get('/current', checkAuth , (req,res) => {

    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });

});

module.exports = router;