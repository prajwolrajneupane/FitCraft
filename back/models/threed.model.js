import mongoose from "mongoose";
const itemSchema= new mongoose.Schema({

    models:{
        type:String,
        required:true

    }
},{timestamps:true})


export const Item=mongoose.model("Item",itemSchema);
