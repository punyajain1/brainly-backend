import jwt , {JwtPayload} from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {key} from "../config"
const ObjectId = new mongoose.Types.ObjectId;

export async function auth(req: Request, res: Response, next: NextFunction) {
    try{
        const header = req.headers["authorization"];
        const decoded = jwt.verify(header as string, key) as JwtPayload;
        if (decoded) {
            if (typeof decoded === "string") {
                res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        // @ts-ignore
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
    }catch (e: any) {
        res.status(401).json({ message: "Invalid or expired token", error: e.message });
      }
}