import mongoose, { Schema } from 'mongoose';
// import { type } from 'os';

const userSchema = new Schema({
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});

const User = mongoose.models.User || mongoose.model("User",userSchema);

export default User;