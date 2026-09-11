require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first'); require('dns').setServers(['8.8.8.8', '1.1.1.1']); require('dotenv').config();

const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const key = process.env.JWT_SECRET || 'electromart-dev-secret';
const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 80,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statuscode: 429, message: 'Too many requests, please try again later.' }
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(path.join(__dirname, '..', 'frontend', 'public', 'uploads')));

// ---------- MongoDB Local connection section ----------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        });

        console.log("MongoDB Connected Successfully (Atlas)");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
};

connectDB()
// ---------- End MongoDB connection section ----------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

const Register = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Password: String,
    UserType: String,
    Status: String
})

const user = mongoose.model("users", Register)
const passwor = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.{8,}).*$/;

const getUserTokenPayload = (userDoc) => ({
    id: String(userDoc._id),
    usertype: userDoc.UserType || 'User',
    mail: userDoc.Email,
    name: `${userDoc.FirstName || ''} ${userDoc.LastName || ''}`.trim()
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
        return res.status(401).json({ statuscode: 401, message: 'Authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ statuscode: 401, message: 'Invalid or expired token.' });
    }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ statuscode: 401, message: 'Authentication required.' });
    }

    const userType = (req.user.usertype || req.user.userType || req.user.UserType || '').toLowerCase();
    if (!allowedRoles.map((role) => role.toLowerCase()).includes(userType)) {
        return res.status(403).json({ statuscode: 403, message: 'You are not authorized to access this resource.' });
    }

    next();
};

app.post("/api/register", authLimiter, async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.pass || '');
    const fname = String(req.body.fname || '').trim();
    const lname = String(req.body.lname || '').trim();

    if (!email || !password || !fname || !lname) {
        return res.status(400).json({ statuscode: 400, message: 'Please fill in all required fields.' });
    }

    if (!passwor.test(password)) {
        return res.status(400).json({ statuscode: 400, message: 'Password must contain uppercase, lowercase, number and special character.' });
    }

    const exist = await user.findOne({ Email: email });
    if (exist) {
        return res.status(409).json({ statuscode: 409, message: 'Email is already used.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = new user({
        FirstName: fname,
        LastName: lname,
        Email: email,
        Password: hash,
        UserType: 'User',
        Status: 'Active'
    });

    const response = await result.save();
    if (response) {
        return res.status(201).json({ statuscode: 1, message: 'Registration successful.' });
    }

    return res.status(500).json({ statuscode: 500, message: 'Unable to register user.' });
})

app.post("/api/login", authLimiter, async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.pass || '');

    if (!email || !password) {
        return res.status(400).json({ statuscode: 400, message: 'Email and password are required.' });
    }

    const result = await user.findOne({ Email: email });
    if (!result) {
        return res.status(401).json({ statuscode: 0, message: 'Invalid email or password.' });
    }

    const passw = await bcrypt.compare(password, result.Password);
    if (passw && result.Status === 'Active') {
        const token = jwt.sign(getUserTokenPayload(result), key, { expiresIn: '1h' });
        return res.status(200).json({
            statuscode: 1,
            data: {
                _id: result._id,
                FirstName: result.FirstName,
                LastName: result.LastName,
                Email: result.Email,
                UserType: result.UserType,
                Status: result.Status
            },
            userType: result.UserType,
            jwtoken: token
        });
    }

    return res.status(401).json({ statuscode: 0, message: 'Invalid email or password.' });
})
//admin data
app.get("/api/users", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const result = await user.find().select('-Password')
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//make admin
app.put("/api/makeadmin/:id", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const result = await user.updateOne({ _id: req.params.id }, {
        $set: {
            UserType: req.body.ad
        }
    })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
app.put("/api/changestatus/:id", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const result = await user.updateOne({ _id: req.params.id }, {
        $set: {
            Status: req.body.status
        }
    })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

// category api

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const Category = new mongoose.Schema({
    Name: String,
    Img: String
})
const upload = multer({ storage: myStorage })
const Cate = mongoose.model("category", Category)

app.post("/api/category", upload.single("pic"), async (req, res) => {
    const result = new Cate({
        Name: req.body.name,
        Img: req.file ? req.file.filename : ''
    })
    if (result) {
        const resp = await result.save()
        if (resp) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

app.get("/api/getcategory", async (req, res) => {
    const result = await Cate.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//brand api

const brand = new mongoose.Schema({
    BrandName: String,
    Category: String,
    Img: String
})

const br = mongoose.model("Brands", brand)

app.post("/api/brand", upload.single("pic"), async (req, res) => {
    const result = new br({
        BrandName: req.body.brandname,
        Category: req.body.category,
        Img: req.file ? req.file.filename : ''
    })
    if (result) {
        const resp = await result.save()
        if (resp) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

app.get("/api/showbrand", async (req, res) => {
    const result = await br.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getbrand/:id", async (req, res) => {
    const result = await br.find({ Category: req.params.id })
    if (result) {

        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getbrand2/:id", async (req, res) => {
    const result = await br.find({ Category: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

// product api 

const product = new mongoose.Schema({
    Category: String,
    ProductName: String,
    ProductPrice: Number,
    ProductDetail: String,
    OnSale: String,
    SalePrice: String,
    Date: String,
    AddedBY: String,
    VendorID: String,
    Img: String,
    Brand: String,
    Specifications: String
})

const pro = mongoose.model("Product", product)

app.post("/api/product", upload.single("pic"), async (req, res) => {
    const result = new pro({
        Category: req.body.productt,
        ProductName: req.body.name,
        ProductPrice: req.body.price,
        ProductDetail: req.body.detail,
        OnSale: req.body.sale,
        Date: new Date(),
        AddedBY: req.body.utype,
        VendorID: req.body.vendorid,
        SalePrice: req.body.saleprice,
        Brand: req.body.brand,
        Specifications: req.body.Specifications,
        Img: req.file ? req.file.filename : ''
    })

    if (result) {
        const resp = await result.save()
        if (resp) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }

})

app.get("/api/vendorproduct/:id", async (req, res) => {
    const result = await pro.find({ VendorID: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/laptop", async (req, res) => {
    const result = await pro.find({ Category: '6970dd60300a757a6dcdb92e' }).limit(8)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/mobiles", async (req, res) => {
    const result = await pro.find({ Category: "6970dd2d300a757a6dcdb92a" }).limit(8)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/leds", async (req, res) => {
    const result = await pro.find({ Category: "6970dd16300a757a6dcdb928" })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/airpods", async (req, res) => {
    const result = await pro.find({ Category: "69849f299a77c6ecd3c2839b" })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getproduct", async (req, res) => {
    const result = await pro.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.delete("/api/deletepro/:id", async (req, res) => {
    const result = await pro.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.put("/api/updatepro/:id", upload.single("pic"), async (req, res) => {
    const result = await pro.updateOne({ _id: req.params.id }, {
        $set: {
            Category: req.body.productt,
            ProductName: req.body.name,
            ProductPrice: req.body.price,
            ProductDetail: req.body.detail,
            OnSale: req.body.sale,
            Date: new Date(),
            SalePrice: req.body.saleprice,
            Brand: req.body.brand,
            Specifications: req.body.specifications,
            Img: req.file ? req.file.filename : undefined
        }
    })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/related/:id", async (req, res) => {
    const result = await pro.find({ Category: req.params.id })
    if (result) {

        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/relatedtwo/:id", async (req, res) => {
    const result = await pro.aggregate(
        [
            {
                $match: { Category: req.params.id }
            },
            {
                $sample: { size: 4 }
            }
        ]
    )
    if (result) {

        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/brand/:id", async (req, res) => {
    const result = await pro.find({ Brand: req.params.id })
    if (result) {
        console.log(result)
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
app.get("/api/saleproduct", async (req, res) => {
    const result = await pro.find({ OnSale: true }).limit(4)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
app.get("/api/latestproduct", async (req, res) => {
    const result = await pro.find().sort({ _id: -1 }).limit(4)


    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/detail/:id", async (req, res) => {
    const result = await pro.findOne({ _id: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//contact schema,model

const Contact = new mongoose.Schema({
    Name: String,
    Email: String,
    Mobile: Number,
    Type: String,
    Msg: String
})

const response = mongoose.model("Contact", Contact)

app.post("/api/response", async (req, res) => {
    const result = new response({
        Name: req.body.name,
        Email: req.body.mail,
        Mobile: req.body.phn,
        Type: req.body.type,
        Msg: req.body.msg
    })
    if (result) {
        const response = await result.save()
        if (response) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

//cart schema ,model
const Cart = new mongoose.Schema({
    ProductId: String,
    Name: String,
    Price: String,
    Img: String,
    Quantity: Number,
    User: String,
    ProductBy: String
})

const cartmodel = mongoose.model("Cart", Cart)

app.post("/api/cartdata/:proid", async (req, res) => {
    const proid = req.params.proid
    const exist = await cartmodel.findOne({
        ProductId: proid,
        User: req.body.id
    })
    if (exist) {
        res.send({ statuscode: 2, message: "Already in Cart" })
    }
    else {
        const result = new cartmodel({
            ProductId: proid,
            Name: req.body.name,
            Price: req.body.price,
            Img: req.body.img,
            Quantity: req.body.value,
            User: req.body.id,
            ProductBy: req.body.proby
        })
        if (result) {
            const resp = await result.save()
            if (resp) {
                res.send({ statuscode: 1 })
            }
            else {
                req.send({ statuscode: 0 })
            }
        }
    }
})

app.get("/api/getcartdata/:id", async (req, res) => {
    const result = await cartmodel.find({ User: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ staruscode: 0 })
    }
})

app.delete("/api/remove/:id", async (req, res) => {
    const result = await cartmodel.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.delete("/api/removecartdata/:id", async (req, res) => {
    const result = await cartmodel.deleteMany({ User: req.params.id })
    if (result.deletedCount > 0) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//review api,schema
const Review = new mongoose.Schema({
    Name: String,
    User: String,
    Msg: String,
    Rating: Number,
    Date: String,
    Product: String
})

const review = mongoose.model("Reviews", Review)

app.post("/api/reviews", async (req, res) => {
    const result = new review({
        Name: req.body.username,
        User: req.body.mail,
        Msg: req.body.msg,
        Rating: req.body.rating,
        Date: new Date(),
        Product: req.body.prr
    })
    const response = await result.save()
    if (response) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getreview/:id", async (req, res) => {
    const result = await review.find({ Product: req.params.id }).sort({ _id: -1 }).limit(1)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//wishlist api ,schema

const wish = new mongoose.Schema({
    Productid: String,
    Name: String,
    Img: String,
    Price: Number,
    Date: String,
    UserId: String

})

const wlist = mongoose.model("Wishlist", wish)

app.post("/api/wishpost/:proid", async (req, res) => {
    const proid = req.params.proid
    const exists = await wlist.findOne({
        Productid: proid,
        UserId: req.body.id
    })
    if (exists) {
        res.send({ statuscode: 2, message: "Already in Wishlist" })
    }
    else {
        const result = new wlist({
            Productid: proid,
            Name: req.body.name,
            Img: req.body.img,
            Price: req.body.price,
            Date: new Date(),
            UserId: req.body.id
        })

        const savee = await result.save()
        if (savee) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})



app.get("/api/getwish/:id", async (req, res) => {
    const result = await wlist.find({ UserId: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.delete("/api/deletewish/:id", async (req, res) => {
    const result = await wlist.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})



// checkout api,schema

const Check = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: String,
    Country: String,
    State: String,
    City: String,
    Address: String,
    PostalCode: String,
    Date: String,
    UserId: String,
    Payment: String,
    OrderNo: String,
    Total: Number,
    Order: [{ ProductName: String, Quantity: Number, Price: Number, Img: String, ProBy: String }]
})

const cout = mongoose.model("Checkout", Check)

app.post("/api/checkout", async (req, res) => {
    const result = new cout({
        FirstName: req.body.fname,
        LastName: req.body.lname,
        Phone: req.body.phn,
        Email: req.body.email,
        Country: req.body.country,
        State: req.body.state,
        City: req.body.city,
        Address: req.body.address,
        PostalCode: req.body.postal,
        Date: new Date(),
        UserId: req.body.id,
        Payment: req.body.payment,
        Total: req.body.totalprice,
        Order: req.body.data,
        OrderNo: req.body.orderno
    })
    const resp = await result.save()
    if (resp) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/orderdata", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const result = await cout.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/myorder/:id", async (req, res) => {
    const result = await cout.find({ UserId: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/sales/monthly", authenticateToken, authorizeRoles('admin'), async (req, res) => {

    const orders = await cout.find();

    const monthly = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    orders.forEach(order => {

        if (!Array.isArray(order.Order)) return;

        const date = new Date(order.Date);
        const monthIndex = date.getMonth();
        const months = Object.keys(monthly);

        let orderTotal = 0;

        order.Order.forEach(item => {
            orderTotal += (Number(item.Quantity) || 0) * (Number(item.Price) || 0);
        });

        monthly[months[monthIndex]] += orderTotal;
    });

    res.send({
        statuscode: 1,
        labels: Object.keys(monthly),
        values: Object.values(monthly)
    });
});

app.get("/api/vendorrevenue/:id", async (req, res) => {
    try {
        const vendorid = req.params.id;

        // Fetch only orders that contain this vendor's products
        const orders = await cout.find({
            "Order.ProBy": vendorid
        });

        // Monthly structure
        const monthly = {
            Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
            Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
        };

        const months = Object.keys(monthly);

        orders.forEach(order => {
            if (!order.Order || !Array.isArray(order.Order)) return;

            const date = new Date(order.Date);
            const monthIndex = date.getMonth();

            order.Order.forEach(item => {
                // Match vendor
                if (item.ProBy === vendorid) {
                    const revenue = Number(item.Quantity) * Number(item.Price);
                    monthly[months[monthIndex]] += revenue;

                }
            });
        });

        res.send({
            statuscode: 1,
            labels: Object.keys(monthly),
            values: Object.values(monthly)
        });

    } catch (err) {
        console.log(err);
        res.send({
            statuscode: 0,
            message: "Error fetching revenue"
        });
    }
});


// vendor api 

const vendor = new mongoose.Schema({
    Name: String,
    Email: String,
    Phone: String,
    Password: String,
    Username: String,
    Bank: String,
    City: String,
    State: String,
    UserType: String,
    Status: String,
})

const vendordata = mongoose.model("Vendor", vendor)

app.post("/api/vendorregister", authLimiter, async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10)
    const result = new vendordata({
        Name: req.body.name,
        Email: req.body.email,
        Phone: req.body.phn,
        Password: hashedPassword,
        Username: req.body.uname,
        Bank: req.body.bank,
        City: req.body.city,
        State: req.body.state,
        UserType: "Vendor",
        Status: "Pending"
    })
    const resp = await result.save()
    if (resp) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/vendordata", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const result = await vendordata.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.post("/api/vlog", authLimiter, async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.pass || '');

    const result = await vendordata.findOne({ Email: email });
    if (!result) {
        return res.status(401).json({ statuscode: 0, message: 'Invalid vendor credentials.' });
    }

    const passw2 = await bcrypt.compare(password, result.Password);
    if (result.Email === email && passw2 === true && result.Status === "Accept") {
        let vtoken = jwt.sign({ id: result._id, usertype: result.UserType, mail: result.Email }, key, { expiresIn: "1h" })
        return res.status(200).json({ statuscode: 1, data: result, token: vtoken, userType: result.UserType });
    }

    return res.status(401).json({ statuscode: 0, message: 'Vendor not approved or invalid password.' });
})

app.put("/api/approval/:id", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const result = vendordata.updateOne({ _id: req.params.id }, {
        $set: {
            Status: req.body.status,
        }
    })
    if ((await result).modifiedCount == 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
