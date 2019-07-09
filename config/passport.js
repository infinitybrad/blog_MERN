

const JwtStrategy = require('passport-jwt').Strategy; // 토큰을 검증하는 함수.
const ExtractJwt = require('passport-jwt').ExtractJwt; // 토큰을 푸는 함수
const mongoose = require('mongoose');
const User = require("../models/user");
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //사용자 입력의 토큰값이 담긴다.
opts.secretOrKey = keys.secretOrKey; // 키값..암구호...

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => { //검증을 한 후에 결과값은 jwt_payload 담는다.
            User.findById(jwt_payload.id) // 디비 유저 모델에서... 토큰 검증된 유저 아이디를 찾는다.
                .then(userInfo => {
                    if (userInfo) {// 찾으면 유저 정보를  user 에 담아서 리턴한다.
                        return done(null, userInfo);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};