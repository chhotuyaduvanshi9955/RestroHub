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
const Owner = require("./modals/owner");
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
    res.locals.owner = req.session.owner || null;
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
    // Fetch restaurant by ID and render details page
    const id = req.params.id;
    Resturants.findById(id).then(restaurant => {
        if(!restaurant) {
            return res.status(404).render("./allEjs/restaurantDetails.ejs", { restaurant: null, user: req.session.user || null, notFound: true });
        }
        res.render("./allEjs/restaurantDetails.ejs", { restaurant, user: req.session.user || null });
    }).catch(err => {
        console.error('Error fetching restaurant details:', err);
        res.status(500).render("./allEjs/restaurantDetails.ejs", { restaurant: null, user: req.session.user || null, error: true });
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

// ---------- Owner (restaurant owner) routes ----------
function ensureOwner(req, res, next) {
    if (req.session && req.session.owner) return next();
    return res.redirect('/owner/login');
}

app.get('/owner/signup', (req, res) => {
    res.render('./allEjs/ownerSignup.ejs');
});

app.post('/owner/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if(!name || !email || !password || !confirmPassword) {
            return res.render('./allEjs/ownerSignup.ejs', { message: 'All fields are required', error: true });
        }
        if(password !== confirmPassword) {
            return res.render('./allEjs/ownerSignup.ejs', { message: 'Passwords do not match', error: true });
        }
        const existing = await Owner.findOne({ email });
        if(existing) return res.render('./allEjs/ownerSignup.ejs', { message: 'Email already registered', error: true });

        const owner = new Owner({ name, email, password });
        await owner.save();
        req.session.owner = { id: owner._id, name: owner.name, email: owner.email };
        res.redirect('/owner/dashboard');
    } catch(err) {
        console.error('Owner signup error:', err);
        res.render('./allEjs/ownerSignup.ejs', { message: 'An error occurred', error: true });
    }
});

app.get('/owner/login', (req, res) => {
    res.render('./allEjs/ownerLogin.ejs');
});

app.post('/owner/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.render('./allEjs/ownerLogin.ejs', { message: 'Provide email and password', error: true });
        const owner = await Owner.findOne({ email });
        if(!owner) return res.render('./allEjs/ownerLogin.ejs', { message: 'Owner not found', error: true });
        const match = await owner.comparePassword(password);
        if(!match) return res.render('./allEjs/ownerLogin.ejs', { message: 'Invalid credentials', error: true });
        req.session.owner = { id: owner._id, name: owner.name, email: owner.email };
        res.redirect('/owner/dashboard');
    } catch(err) {
        console.error('Owner login error:', err);
        res.render('./allEjs/ownerLogin.ejs', { message: 'An error occurred', error: true });
    }
});

app.get('/owner/logout', (req, res) => {
    if(req.session) {
        req.session.owner = null;
    }
    res.redirect('/home');
});

// Public page: list all owners and their restaurants
app.get('/owners', async (req, res) => {
    try {
        const owners = await Owner.find().populate('restaurants');
        res.render('./allEjs/ownersList.ejs', { owners });
    } catch (err) {
        console.error('Error fetching owners:', err);
        res.status(500).send('Unable to load owners');
    }
});

// Public owner detail page
app.get('/owners/:id', async (req, res) => {
    try {
        const owner = await Owner.findById(req.params.id).populate('restaurants');
        if (!owner) return res.status(404).send('Owner not found');
        res.render('./allEjs/ownerProfile.ejs', { owner });
    } catch (err) {
        console.error('Error fetching owner profile:', err);
        res.status(500).send('Unable to load owner profile');
    }
});

// Toggle restaurant open/closed status (owner only)
app.post('/owner/restaurant/:id/toggle-status', ensureOwner, async (req, res) => {
    try {
        const restId = req.params.id;
        const ownerId = req.session.owner.id;

        // Verify owner owns this restaurant
        const owner = await Owner.findById(ownerId);
        if (!owner) return res.status(403).json({ success: false, message: 'Owner not found' });

        const owns = (owner.restaurants || []).some(r => String(r) === String(restId));
        if (!owns) return res.status(403).json({ success: false, message: 'Not authorized' });

        const rest = await Resturants.findById(restId);
        if (!rest) return res.status(404).json({ success: false, message: 'Restaurant not found' });

        rest.isOpen = !rest.isOpen;
        await rest.save();

        return res.json({ success: true, isOpen: rest.isOpen });
    } catch (err) {
        console.error('Toggle status error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/owner/dashboard', ensureOwner, async (req, res) => {
    const owner = await Owner.findById(req.session.owner.id).populate('restaurants');
    const message = req.session.ownerMsg || null;
    // clear message after reading
    req.session.ownerMsg = null;
    res.render('./allEjs/ownerDashboard.ejs', { owner, message });
});

app.get('/owner/add-restaurant', ensureOwner, (req, res) => {
    res.render('./allEjs/ownerAddRestaurant.ejs', { message: null });
});

app.post('/owner/add-restaurant', ensureOwner, async (req, res) => {
    try {
        let { name, city, cuisine, rating, priceRange, address, description, img } = req.body;

        // Normalize and validate inputs
        name = (name || '').trim();
        city = (city || '').trim();
        cuisine = (cuisine || '').trim();
        address = (address || '').trim();
        description = (description || '').trim();

        // Coerce numeric fields (priceRange now stores starting price, e.g., 200)
        rating = parseFloat(rating) || 4.5;
        priceRange = parseInt(priceRange) || 200;

        // Normalize image URL so public assets resolve correctly
        let imgUrl = (img || '').trim();
        if(!imgUrl) {
            imgUrl = '/images/nature.jpg'; // default placeholder
        } else {
            // If user supplied a path that includes 'public/' (e.g. '/public/images/foo.png')
            // convert it to the URL path served by express.static (e.g. '/images/foo.png')
            if(imgUrl.startsWith('/public/')) imgUrl = imgUrl.replace('/public/', '/');
            if(imgUrl.startsWith('public/')) imgUrl = '/' + imgUrl.replace(/^public\//, '');
            if(imgUrl.startsWith('images/')) imgUrl = '/' + imgUrl; // ensure leading slash
        }

        const newRest = new Resturants({ name, city, cuisine, rating, priceRange, address, description, img: imgUrl });
        const saved = await newRest.save();
        await Owner.findByIdAndUpdate(req.session.owner.id, { $push: { restaurants: saved._id } });

        // Set a short-lived message and redirect to dashboard so owner sees the newly added restaurant
        req.session.ownerMsg = 'Restaurant added successfully!';
        return res.redirect('/owner/dashboard');
    } catch(err) {
        console.error('Add restaurant error:', err);
        res.render('./allEjs/ownerAddRestaurant.ejs', { message: 'An error occurred', error: true });
    }
});

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
            // We'll handle maxPrice via aggregation so that we can normalize
            // old tier-based values (1..4) to their starting prices
            // (1->200, 2->400, 3->800, 4->1500) when comparing.
            // This ensures older DB records still filter correctly.
            // Leave filter unchanged here and apply the normalized comparison
            // later using an aggregation pipeline.
        }

        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { cuisine: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }
        let restaurants;
        if (maxPrice) {
            const max = parseFloat(maxPrice);
            if (isNaN(max)) {
                return res.status(400).json({ success: false, message: 'Invalid maxPrice', data: [] });
            }

            // Build aggregation pipeline: first match other filters, then add
            // a normalizedPrice field which maps old tiers (<=4) to their
            // starting prices, otherwise uses the stored priceRange as-is.
            const pipeline = [];
            if (Object.keys(filter).length) pipeline.push({ $match: filter });

            pipeline.push({
                $addFields: {
                    normalizedPrice: {
                        $switch: {
                            branches: [
                                {
                                    case: { $lte: ["$priceRange", 4] },
                                    then: {
                                        $arrayElemAt: [ [200, 400, 800, 1500], { $subtract: ["$priceRange", 1] } ]
                                    }
                                }
                            ],
                            default: "$priceRange"
                        }
                    }
                }
            });

            pipeline.push({ $match: { normalizedPrice: { $lte: max } } });

            restaurants = await Resturants.aggregate(pipeline);
        } else {
            restaurants = await Resturants.find(filter);
        }
        
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