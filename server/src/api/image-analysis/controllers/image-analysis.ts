import { Context } from "koa"
import { analyzeImage } from "../services/gemini";

export default{
    async analyze(ctx: Context){
        const file = ctx.resquest.files?.image as any;
        if(!file) return ctx.badRequest('no image uploaded')

        const filePath = file.filepath;

        try {
            const result = await analyzeImage(filePath)
            return ctx.send({success: true, result})
        } catch (error) {
            ctx.internalServerError("analysis failed",{error: error.message})
        }
    }
}