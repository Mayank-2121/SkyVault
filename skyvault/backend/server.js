const express = require("express");
require('dotenv').config();
const connectDB = require('./database/connect.js');
const bodyParser = require("body-parser");
const routes = require("./routes/route");
const app = express();
const cors = require("cors");
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


app.use(
    cors({
        origin: "http://localhost:3000", // Frontend URL
        credentials: true, // Allow cookies
    })
);

const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
    res.send("Hello from Backend!");
})

aws.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

// const BUCKET = process.env.BUCKET
// const s3 = new aws.S3();
// const upload = multer({
//     store: multerS3({
//         bucket: BUCKET,
//         s3: s3,
//         acl: 'public-read',
//         key: (req, file, cb) => {
//             cb(null, file.originalname);
//         }
//     })
// })

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
//     },
// });
// const upload = multer({ storage });

const start = async () => {
    try {
        app.listen(PORT, function (err) {
            console.log("Server listening on Port", PORT);
        });
    }
    catch (error) {
        console.log("Error in server setup :(");
    }
}

start();

