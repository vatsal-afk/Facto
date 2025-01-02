import { connectMongoDB } from "@/lib/mongodb";
import Article from "@/models/article";

export async function POST(req){
    await connectMongoDB();
    console.log("connected to db");

    const {articleId,title,summary}=await req.json();

    if(!articleId || !title || !summary){
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    try{

        let article = await Article.findOne({ articleId});

        if(article){
            return new Response(JSON.stringify({ index: article.index }), { status: 200 });
        }
        const maxIndexArticle =await Article.findOne().sort({index:-1});
        const newIndex = maxIndexArticle ? maxIndexArticle.index + 1 : 0;

        article = await Article.create({ articleId, title, summary, index: newIndex });

        return new Response(JSON.stringify({ index: article.index }), { status: 201 });
    }catch(error){
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }



}