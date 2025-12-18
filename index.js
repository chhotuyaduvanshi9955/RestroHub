const express=require("express");
const app=express();
let port=3030;
const path=require("path");// ejs path 
const ejsMate=require("ejs-mate"); 
const mongoose=require("mongoose");
const Resturants=require("./modals/resturants");


const MONGO_URL='mongodb://127.0.0.1:27017/restruants';
main().then(()=>{         
    console.log("connected to DB");
})
.catch((err) =>{ 
    console.log(err)
});

async function main() {    
  await mongoose.connect(MONGO_URL);
}


app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static("public"));

/// for ejs template
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));/// for set path of ejs template file;
app.engine("ejs",ejsMate);



//Routes
app.get("/home",(req,res)=>{
    res.render("./allEjs/home.ejs");
})

app.get("/about",(req,res)=>{
    res.render("./allEjs/about.ejs");
})

app.get("/restaurants",async(req,res)=>{
    const allrestaurants=await Resturants.find({});
    res.render("./allEjs/resShow.ejs",{allrestaurants});
})

app.get("/service",(req,res)=>{
    res.render("./allEjs/service.ejs");
})

app.get("/gallery",(req,res)=>{
    res.render("./allEjs/gallery.ejs");
})

app.get("/contact",(req,res)=>{
    res.render("./allEjs/contact.ejs");
})

app.get("/login",(req,res)=>{
    res.render("./allEjs/login.ejs");
})

app.get("/signup",(req,res)=>{
    res.render("./allEjs/signup.ejs");
})

app.get("/feedback",(req,res)=>{
    res.render("./allEjs/feedback.ejs");
})

// Legacy routes (keeping for backward compatibility)
app.get("/home/lists",(req,res)=>{
    res.redirect("/restaurants");
})

app.get("/home/about/service",(req,res)=>{
    res.redirect("/service");
})

app.get("/home/menu",async(req,res)=>{
    const allresturants=await Resturants.find({});
    console.log(allresturants[1]);
    res.render("./allEjs/families.ejs",{allresturants});
})

app.get("/home/menu:id",async (req,res)=>{
    const {id}=req.params;
    const resturantid=await Resturants.findById(id);
    // console.log(familyid);
    res.render("./allEjs/family.ejs",{resturantid});
})

app.get("/home/about/gallery/families/:id/login",(req,res)=>{
    res.render("./allEjs/login.ejs");
})
    

// app.get((err,req,res,next)=>{
//     try{
//     console.log(res.body);
//     res.render("./allEjs/index.ejs");
//     }catch(err){
//     console.log(err);
// }})



app.listen(port,(req,res)=>{
    console.log(`server is listening on port ${port}`);
})