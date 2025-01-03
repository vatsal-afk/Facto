import mongoose from 'mongoose';


export const connectMongoDB=async()=>{
    try{
        await mongoose.connect("mongodb+srv://tanmaysdream9460:1NPHNJn3RyzR63dP@cluster0.ftmk1.mongodb.net/facto");
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("Error connecting to db :",err);
    }
}