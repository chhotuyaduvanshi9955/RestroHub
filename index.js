const express=require("express");
const app=express();
const dotenv=require("dotenv");
dotenv.config();
const port=process.env.port||3030;
const path=require("path");// ejs path 
const ejsMate=require("ejs-mate"); 
const mongoose=require("mongoose");
const session=require("express-session");
const Resturants=require("./modals/resturants");
const User=require("./modals/user");
const Booking=require("./modals/booking");
// const SessionSecret =process.env.SESSIONSECRET;
// console.log(SessionSecret);
// const MONGO_URL='mongodb://127.0.0.1:27017/restruants';
const MONGO_URL=process.env.MONGO_URL;
main().then(()=>{         
    console.log("connected to MongoDB Atlas");
})
.catch((err) =>{ 
    console.error("Monogo Error:",err.message)
});

async function main() {    
  await mongoose.connect(MONGO_URL);
}

mongoose.connection.once("open",()=>{
    console.log("connected DB name:",mongoose.connection.name);
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static("public"));

// Session middleware
app.use(session({
    secret:process.env.SESSIONSECRET||"chotuyaduvanshi9955@RestroHub",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly:true,
        maxAge: 24*60*60*1000 // 24 hours
    }
}));

// Middleware to pass user data to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

/// for ejs template
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));/// for set path of ejs template file;
app.engine("ejs",ejsMate);



//Routes
app.get("/",(req,res)=>{
    res.redirect("/home");
})
app.get("/home",(req,res)=>{
    res.render("./allEjs/home.ejs");
})

app.get("/about",(req,res)=>{
    res.render("./allEjs/about.ejs");
})

app.get("/location-search",(req,res)=>{
    res.render("./allEjs/locationSearch.ejs", {user: req.session.user || null});
})

app.get("/restaurants",async(req,res)=>{
    // Check if user wants to see their orders
    const showOrders = req.query.type === 'orders';
    
    if(showOrders && req.session.user) {
        // Get user's orders from localStorage (passed via session or just show message)
        const orders = req.session.user.orders || [];
        return res.render("./allEjs/resShow.ejs", {
            allrestaurants: [],
            showOrders: true,
            userId: req.session.user.id,
            userName: req.session.user.name
        });
    }
    
    const allrestaurants=await Resturants.find({});
    res.render("./allEjs/resShow.ejs",{allrestaurants, showOrders: false, user: req.session.user});
})

app.get("/search",async(req,res)=>{
    const {q} = req.query;
    let searchResults = [];
    
    if(q) {
        // Search by city (case-insensitive)
        searchResults = await Resturants.find({
            city: { $regex: q, $options: 'i' }
        });
    }
    
    res.render("./allEjs/searchResults.ejs",{searchResults, searchQuery: q});
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

app.get("/settings",(req,res)=>{
    res.render("./allEjs/settings.ejs");
})

app.get("/restaurant-details/:id",(req,res)=>{
    // For now, render with restaurant ID that can be used to fetch details
    res.render("./allEjs/restaurantDetails.ejs", {
        restaurantId: req.params.id,
        user: req.session.user || null
    });
})

app.get("/login",(req,res)=>{
    res.render("./allEjs/login.ejs");
})

app.post("/login",async(req,res)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.render("./allEjs/login.ejs", {
                message: "Please provide email and password",
                error: true
            });
        }
        
        const user = await User.findOne({email});
        
        if(!user) {
            return res.render("./allEjs/login.ejs", {
                message: "User not found. Please sign up first.",
                error: true
            });
        }
        
        // Simple password comparison (in production, use bcrypt)
        if(user.password !== password) {
            return res.render("./allEjs/login.ejs", {
                message: "Invalid password. Please try again.",
                error: true
            });
        }
        
        // Store user in session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        
        // Redirect to home
        res.redirect("/home");
        
    }catch(err){
        console.error("Login error:", err);
        res.render("./allEjs/login.ejs", {
            message: "An error occurred. Please try again.",
            error: true
        });
    }
})

app.get("/signup",(req,res)=>{
    res.render("./allEjs/signup.ejs");
})

app.post("/signup",async(req,res)=>{
    try{
        const {name, email, phone, password, confirmPassword} = req.body;
        
        // Validation
        if(!name || !email || !phone || !password || !confirmPassword) {
            return res.render("./allEjs/signup.ejs", {
                message: "All fields are required",
                error: true
            });
        }
        
        if(password !== confirmPassword) {
            return res.render("./allEjs/signup.ejs", {
                message: "Passwords do not match",
                error: true
            });
        }
        
        if(password.length < 6) {
            return res.render("./allEjs/signup.ejs", {
                message: "Password must be at least 6 characters",
                error: true
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.render("./allEjs/signup.ejs", {
                message: "Email already registered. Please login or use a different email.",
                error: true
            });
        }
        
        // Create new user
        const newUser = new User({
            name,
            email,
            phone,
            password
        });
        
        await newUser.save();
        
        // Redirect to home with success message
        res.redirect("/home");
        
    }catch(err){
        console.error("Signup error:", err);
        res.render("./allEjs/signup.ejs", {
            message: "An error occurred. Please try again.",
            error: true
        });
    }
})

app.get("/feedback",(req,res)=>{
    res.render("./allEjs/feedback.ejs");
})

app.get("/profile",(req,res)=>{
    if(!req.session.user) {
        return res.redirect("/login");
    }
    res.render("./allEjs/profile.ejs", {userProfile: req.session.user});
})

app.get("/logout",(req,res)=>{
    req.session.destroy((err) => {
        if(err) {
            console.error("Logout error:", err);
        }
        res.redirect("/home");
    });
})

// API Routes for Search
app.get("/api/search",async(req,res)=>{
    try{
        const {q, location} = req.query;
        let searchResults = [];
        
        if(q && q.trim().length > 0) {
            let query = {
                $or: [
                    { city: { $regex: q, $options: 'i' } },
                    { name: { $regex: q, $options: 'i' } },
                    { cuisine: { $regex: q, $options: 'i' } }
                ]
            };
            
            // If location is provided, filter by location as well
            if(location && location.trim().length > 0) {
                query.city = { $regex: location, $options: 'i' };
            }
            
            searchResults = await Resturants.find(query).limit(20);
        }
        
        res.json({success: true, results: searchResults, count: searchResults.length});
    }catch(err){
        res.json({success: false, message: err.message, results: []});
    }
})

app.get("/api/search/autocomplete",async(req,res)=>{
    try{
        const {q} = req.query;
        let suggestions = [];
        
        if(q && q.trim().length > 0) {
            const searchQuery = q.trim();
            
            // Get unique cities
            const cities = await Resturants.distinct("city", {
                city: { $regex: searchQuery, $options: 'i' }
            });
            
            // Get unique restaurant names
            const names = await Resturants.distinct("name", {
                name: { $regex: searchQuery, $options: 'i' }
            });
            
            // Get unique cuisines
            const cuisines = await Resturants.distinct("cuisine", {
                cuisine: { $regex: searchQuery, $options: 'i' }
            });
            
            suggestions = [
                ...cities.map(c => ({type: 'city', value: c, icon: 'map-pin'})),
                ...names.map(n => ({type: 'restaurant', value: n, icon: 'utensils'})),
                ...cuisines.map(c => ({type: 'cuisine', value: c, icon: 'fire'}))
            ].slice(0, 12);
            
            console.log(`Autocomplete for "${searchQuery}":`, {citiesCount: cities.length, namesCount: names.length, cuisinesCount: cuisines.length, suggestionsCount: suggestions.length});
        }
        
        res.json({success: true, suggestions: suggestions});
    }catch(err){
        console.error('Autocomplete error:', err);
        res.json({success: false, message: err.message, suggestions: []});
    }
})

app.get("/api/locations",async(req,res)=>{
    try{
        const locations = await Resturants.distinct("city");
        res.json({success: true, locations: locations.sort()});
    }catch(err){
        res.json({success: false, message: err.message, locations: []});
    }
})

// API endpoint to get all restaurants with filters
app.get("/api/restaurants", async(req,res)=>{
    try{
        const { city, cuisine, minRating, maxPrice, search } = req.query;
        let filter = {};

        // Build filter object based on query parameters
        if(city) {
            filter.city = { $regex: city, $options: 'i' };
        }
        
        if(cuisine) {
            filter.cuisine = { $regex: cuisine, $options: 'i' };
        }
        
        if(minRating) {
            filter.rating = { $gte: parseFloat(minRating) };
        }
        
        if(maxPrice) {
            filter.priceRange = { $lte: parseFloat(maxPrice) };
        }
        
        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { cuisine: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const restaurants = await Resturants.find(filter);
        
        res.json({
            success: true,
            data: restaurants,
            count: restaurants.length
        });
    }catch(err){
        res.json({
            success: false,
            message: err.message,
            data: []
        });
    }
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

// ============ BOOKING ROUTES ============

// GET - Booking page
app.get("/booking/:restaurantId", async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await Resturants.findById(restaurantId);
        
        if (!restaurant) {
            return res.status(404).render("./allEjs/error.ejs", { 
                message: "Restaurant not found" 
            });
        }

        res.render("./allEjs/booking.ejs", { 
            restaurant,
            user: req.session.user || null
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("./allEjs/error.ejs", { 
            message: "Error loading booking page" 
        });
    }
});

// POST - Create booking
app.post("/api/bookings", async (req, res) => {
    try {
        const { restaurantId, name, email, phone, guests, date, time, specialRequests } = req.body;

        // Validation
        if (!restaurantId || !name || !email || !phone || !guests || !date || !time) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if restaurant exists
        const restaurant = await Resturants.findById(restaurantId);
        if (!restaurant) {
            return res.json({
                success: false,
                message: "Restaurant not found"
            });
        }

        // Check for duplicate booking at same time
        const existingBooking = await Booking.findOne({
            restaurantId,
            date,
            time
        });

        if (existingBooking) {
            return res.json({
                success: false,
                message: "This time slot is not available. Please choose another time."
            });
        }

        // Generate unique bookingId
        const lastBooking = await Booking.findOne().sort({ bookingId: -1 });
        const bookingId = lastBooking ? lastBooking.bookingId + 1 : 1;

        // Create new booking
        const booking = new Booking({
            bookingId,
            restaurantId,
            userId: req.session.user ? req.session.user.id : null,
            name,
            email,
            phone,
            guests,
            date,
            time,
            specialRequests: specialRequests || ""
        });

        await booking.save();

        res.json({
            success: true,
            message: "Booking confirmed successfully!",
            booking: {
                confirmationCode: booking.confirmationCode,
                bookingId: booking.bookingId,
                date: booking.date,
                time: booking.time,
                guests: booking.guests,
                restaurantName: restaurant.name
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error creating booking: " + err.message
        });
    }
});

// GET - User bookings
app.get("/my-bookings", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const bookings = await Booking.find({ userId: req.session.user.id })
            .populate('restaurantId')
            .sort({ timestamp: -1 });

        res.render("./allEjs/myBookings.ejs", {
            bookings,
            user: req.session.user
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("./allEjs/error.ejs", { 
            message: "Error loading bookings" 
        });
    }
});

// GET - Booking details
app.get("/booking-details/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findOne({ confirmationCode: bookingId })
            .populate('restaurantId');

        if (!booking) {
            return res.status(404).render("./allEjs/error.ejs", { 
                message: "Booking not found" 
            });
        }

        res.render("./allEjs/bookingDetails.ejs", {
            booking,
            user: req.session.user || null
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("./allEjs/error.ejs", { 
            message: "Error loading booking details" 
        });
    }
});

// POST - Cancel booking
app.post("/api/bookings/cancel/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'cancelled' },
            { new: true }
        );

        if (!booking) {
            return res.json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error cancelling booking: " + err.message
        });
    }
});

// API - Get available time slots
app.get("/api/booking-slots/:restaurantId", async (req, res) => {
    try {
        const { restaurantId, date } = req.query;

        if (!restaurantId || !date) {
            return res.json({
                success: false,
                message: "Restaurant ID and date are required"
            });
        }

        // Get all bookings for this restaurant on this date
        const bookings = await Booking.find({
            restaurantId,
            date,
            status: { $ne: 'cancelled' }
        });

        const bookedTimes = bookings.map(b => b.time);

        // Generate available time slots (11:00 AM to 10:00 PM, every 30 mins)
        const availableSlots = [];
        for (let hour = 11; hour < 22; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                if (!bookedTimes.includes(timeStr)) {
                    availableSlots.push(timeStr);
                }
            }
        }

        res.json({
            success: true,
            availableSlots
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error fetching slots: " + err.message
        });
    }
});

app.listen(port,(req,res)=>{
    console.log(`server is listening on port ${port}`);
})