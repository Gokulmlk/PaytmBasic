const express = require("express");
const zod = require("zod");
const {User} = require("../db");
const { route } = require(".");
const jet = require("jsonwebtoken");
const JWT_SECRET = require("./config");

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstname:zod.string(),
    password:zod.string()

})

route.post("/signup", async (res,req) => {

    const body = req.body;
    const obj = signupSchema.safeParse(req.body);
    if(!obj.success){
        return res.json({
            msg:"Email already taken or invelide input"
        })
    }

   const user = User.findOne({
    username: body.username;
   })

   if(user._id){
    returnres.json({
        msg: "Email already taken? Incorrect email"
    })
   }

   const dbUser  = await User.create(body);
   const token = jwt.sign({
    userId: dbUser._id
   }, JWT_SECRET)
   res.json({
    msg: "User created successfully",
    token: token
   })
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;