const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validator = require("validator");

const crypto = require("crypto");


/* =========================
   SIGNUP
========================= */

const signup = async (req,res)=>{

    try{

        const {
            name,
            email,
            password
        } = req.body;


        /* VALID EMAIL */

        if(!validator.isEmail(email)){

            return res.status(400).json({

                message:"Invalid Email"
            });
        }


        /* CHECK USER */

        const existingUser =
        await User.findOne({email});

        if(existingUser){

            return res.status(400).json({

                message:"User already exists"
            });
        }


        /* HASH PASSWORD */

        const hashedPassword =
        await bcrypt.hash(password,10);


        /* CREATE USER */

        const user =
        await User.create({

            name,

            email,

            password:hashedPassword
        });


        /* TOKEN */

        const token =
        jwt.sign(

            {
                id:user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }
        );


        res.status(201).json({

            message:"Signup Successful",

            token,

            user
        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"
        });
    }
};



/* =========================
   LOGIN
========================= */

const login = async (req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;


        /* FIND USER */

        const user =
        await User.findOne({email});

        if(!user){

            return res.status(400).json({

                message:"User not found"
            });
        }


        /* CHECK PASSWORD */

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){

            return res.status(400).json({

                message:"Invalid Credentials"
            });
        }


        /* TOKEN */

        const token =
        jwt.sign(

            {
                id:user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }
        );


        res.status(200).json({

            message:"Login Successful",

            token,

            user
        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"
        });
    }
};



/* =========================
   FORGOT PASSWORD
========================= */

const forgotPassword =
async (req,res)=>{

    try{

        const { email } = req.body;


        /* FIND USER */

        const user =
        await User.findOne({ email });

        if(!user){

            return res.status(404).json({

                message:"User not found"
            });
        }


        /* GENERATE TOKEN */

        const resetToken =
        crypto.randomBytes(32)
        .toString("hex");


        /* SAVE TOKEN */

        user.resetToken =
        resetToken;

        user.resetTokenExpire =
        Date.now() + 15 * 60 * 1000;


        await user.save();


        /* RESET URL */

        const resetURL =

`${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;


        /* SEND TO FRONTEND */

        res.status(200).json({

            message:
            "Reset link generated",

            resetURL
        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"
        });
    }
};



/* =========================
   RESET PASSWORD
========================= */

const resetPassword =
async (req,res)=>{

    try{

        const { token } =
        req.params;

        const { password } =
        req.body;


        /* FIND USER */

        const user =
        await User.findOne({

            resetToken:token,

            resetTokenExpire:{
                $gt:Date.now()
            }
        });


        if(!user){

            return res.status(400).json({

                message:
                "Invalid or expired token"
            });
        }


        /* HASH PASSWORD */

        const hashedPassword =
        await bcrypt.hash(password,10);


        /* UPDATE PASSWORD */

        user.password =
        hashedPassword;

        user.resetToken =
        undefined;

        user.resetTokenExpire =
        undefined;


        await user.save();


        res.status(200).json({

            message:
            "Password reset successful"
        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"
        });
    }
};



/* =========================
   EXPORTS
========================= */

module.exports = {

    signup,

    login,

    forgotPassword,

    resetPassword
};