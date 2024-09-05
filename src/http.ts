import { Express } from "express";
import express from "express";
import {z, ZodError} from "zod";
import prisma from "./util/DB";
import bip39 from 'bip39';
import { generate} from "random-words";

const signupZodObject = z.object({
    password:z.string().min(8,"Password is too small").max(20,"Password is too large")
})

export function initHttp(app: Express) {
    app.use(express.json());


    app.post("/signup",async(req,res)=>{
        try {
        const mnemonic = generate(16);
        const signupParse = signupZodObject.safeParse(req.body);
        if(signupParse.error){
            return res.status(400).json({ message: signupParse.error.errors[0].message});
        }

        const finduser = await prisma.user.findUnique({
            where:{
                password:req.body.password
            }
        })
        if(finduser){
            return res.json({message:"User already exists",status:400})
        }
        else if(!finduser){
            await prisma.user.create({
                data:{
                    password:req.body.password,
                    seedPhrase:mnemonic as string[]
                }
            })
            
            return res.json({message:"User created successfully",status:200})
        }

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({message: error.errors[0].message});
            }    
        }
    })

    app.get("/",(req,res)=>{
        return res.json({message:"Over here"})
    })


}