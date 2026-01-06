const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const resturantsSchema=new Schema({
    name:{
        type:String,
        required:true,
        
    },
    city:{
        type:String,
        required:true,
       
    },
    cuisine:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
         required:true,
         default:1,
    },
    priceRange:{
        type:Number,
        required:true,
        default:0
    },
    // Whether the restaurant is currently open
    isOpen: {
        type: Boolean,
        default: true
    },
    address:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    img:{
        type: String,
        default: "/images/nature.jpg",
        set: (v) => (v && typeof v === 'string' && v.trim() ? v : "/images/nature.jpg"),
        // required:true,
    },
});

const Resturants=new mongoose.model("Resturants",resturantsSchema);

module.exports=Resturants;