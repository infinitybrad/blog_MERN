const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//DB config
const db = require("./config/keys").mongoURI;


//Connext to Mongo
mongoose
    .connect(db, {
        useNewUrlParser:true,
        useCreateIndex:true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


const usersRoutes = require('./route/api/users');
const profileRoutes = require('./route/api/profile');
const postsRoutes = require('./route/api/posts');


app.use('/api/users', usersRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/posts',postsRoutes);











const port = 3000;

app.listen(port,() => console.log(`Server running on port ${port}`));

