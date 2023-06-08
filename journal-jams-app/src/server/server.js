const express = require('express');
const mongoose = require('mongoose');
const Entry = require('../Models/Entries'); 
const User = require('../Models/UserInfo');
const profilepic = require('../Models/ProfilePics');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require( 'body-parser');
const routes = require('./routes/profilepic_backend.js');

//express app
const app = express();

dotenv.config({path: 'src/server/.env'}); //reads the .env file and parses it
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static('src'));
console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection;
database.on('error', (error) => console.log(error));
database.once('connected', () => {
    console.log('Connected to database'),
    app.listen(1234);
});

app.post('/api/newProfilePic', upload.single('image'), async (req, res) => {
    console.log('Inside of /api/newProfilePic');
    const image = new profilepic({
        data: req.file.buffer,
        contentType: req.file.mimetype,
    });
    image.save()    
        .then((result) => {
            console.log("Sent your profile pic to the DB!");
            res.json({ id: image._id });
            // res.send(result);
        })
        .catch((err) => {
            console.error('Failed to upload image', err);
            // res.status(500).json({ error: 'Failed to upload image' });
        });
});

app.post('/api/newUser/:email', (req, res) => { //add the newEntry to the DB
    console.log("Inside of /api/newUser");
    const new_entry = new User({
        email: req.params.email,
    });
    new_entry.save()
        .then((result) => {
            console.log("Sent your username to the DB!");
            res.send(result);
            // res.redirect('http://localhost:3000/login')
        })
        .catch((err) => {
            console.log(err);
        });
});


app.post('/api/newEntry', (req, res) => { //add the newEntry to the DB
    const new_entry = new Entry({
        title: req.body.title,
        text: req.body.entry,
        mood: "happy" //placeholder-- TODO: set to predicted mood
    });

    new_entry.save()
        .then((result) => {
            console.log("Sent your entry to the DB!");
            res.redirect('http://localhost:3000/Entries')
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/api/allEntries', (req, res) => {
    console.log("Inside of /api/allEntries");
    Entry.find()
        .then((result) => {
            // console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});

// app.use('/api', routes);
