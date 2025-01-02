import mongoose from 'mongoose';


const ArticleSchema = new mongoose.Schema({
    articleId:{
        type:String,
        required:true,
        unique:true,
    },
    title:{
        type:String,
        required:true,
    },
    summary:{
        type:String,
        required:true,
    },
    index:{
        type:Number,
        required:true,
    },
},{timestamps:true});


export default mongoose.models.Article||mongoose.model('Article',ArticleSchema);