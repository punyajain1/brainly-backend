import express from "express";
import mongoose from "mongoose";
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/second-brain");
import jwt from "jsonwebtoken";
import {usermodel , contentmodel , tagmodel , linkmodel } from "./db"
import {key} from "./config";
import { auth } from "./middleware/admin";
import {random} from "./utils"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())




app.post("/api/v1/signup", async (req, res) => {
    const {email , password} = req.body;
    try {
        await usermodel.create({
            email: email,
            password: password
        }) 
        res.json({
            message: "User signed up"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

// app.post("/api/v1/signin", async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const user = await usermodel.find({
//         username,password
//     })
//     if(user){
//         const token = jwt.sign({id: user._id}, key);
//         res.json({token})
//     }else{
//         res.status(403).json({message: "Incorrrect credentials"})
//     }
// })



app.post("/api/v1/signin", async (req, res) => {
    const { email , password } = req.body;
    try {
        const existingUser = await usermodel.findOne({
            email,
            password
        })
        if (existingUser) {
            const token = jwt.sign({
                id: existingUser._id
            }, key)
    
            res.json({
                token
            })
        } else {
            res.status(403).json({
                message: "Incorrrect credentials"
            })
        }
    }catch(err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// @ts-ignore
app.post("/api/v1/content",auth, async (req, res) => {
    try{
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        await contentmodel.create({
            link: link,
            type: type,
            title: title,
            // @ts-ignore
            userId: req.userId,
            tags: []
    })
    res.json({
        message: "Content added"
    })
    }catch(e){
        // @ts-ignore
        res.status(500).json({msg: e.message});
    }
    
})



// @ts-ignore
app.get("/api/v1/content", auth, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await contentmodel.find({
        userId: userId
    }).populate("userId", "email")
    res.json({
        content
    })
})


// @ts-ignore
app.delete("/api/v1/content", auth, async (req, res) => {
    const contentId = req.body.contentId;

    await contentmodel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })
})


// @ts-ignore
app.post("/api/v1/brain/share", auth, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await linkmodel.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if (existingLink) {
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await linkmodel.create({
            //@ts-ignore           
            userId: req.userId,
            hash: hash
        })

        res.json({
            hash
        })
} else {
    await linkmodel.deleteOne({
        //@ts-ignore
        userId: req.userId
    });

    res.json({
        message: "Removed link"
    })
}
})

// @ts-ignore
app.get("/api/v1/brain/:shareLink",auth, async (req, res) => {
    const hash = req.params.shareLink;
    const link = await linkmodel.findOne({
        hash
    })
    if(!link){
        res.status(400).json({
            msg:"sorry link wrong"
        })
        return;
    }
    const content = await contentmodel.find({
        userId:link.userId
    })
    const user = await usermodel.findOne({
        _id:link.userId
    })
    if(!user){
        res.status(400).json({
            msg:"user not found"
        })
        return;
    }

    res.json({
        username: user.email,
        content: content
    })

})
app.listen(3000);