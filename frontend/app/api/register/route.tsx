
import { NextResponse } from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req){
    try{
        const {email,password,role}=await req.json();
        const hashedPassword=await bcrypt.hash(password,10);

        await connectMongoDB();
        console.log("connencted to db");
        await User.create({role,email,password:hashedPassword,});
        // await User.create({email,password,role});

        

        return NextResponse.json({message:"User registered successfully"},{status:201});
    }catch(e){
        console.log(e);
        return NextResponse.json({message:"User registration failed"},{status:500});    
    }
}