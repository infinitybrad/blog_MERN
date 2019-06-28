const express = require("express");
const router  = express.Router();
const gravatar =  require("gravatar");

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

    // userModel
    //     .findOne({ email: req.body.email })
    //     .then(user => {
    //         if(user){
    //             return res.status(400).json({
    //                 msg: "Email Already exists"
    //             });
    //         } else{

                const avatar = gravatar.url(req.body.email, {
                    s:'200' ,//size
                    r:'pg' ,//Rating
                    d:'mm' //Default
                });
                const newUser = new userModel({
                    name : req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password
                });
                

                res.status(200).json(newUser);



        //     }

        // })
        // .catch(err => res.json(err));


});




module.exports = router;