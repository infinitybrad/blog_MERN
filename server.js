const express = require("express");
const app = express();

const usersRoutes = require('./route/api/users');
const profileRoutes = require('./route/api/profile');
const postsRoutes = require('./route/api/posts');


app.use('/api/users', usersRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/posts',postsRoutes);











const port = 3000;

app.listen(port,() => console.log(`Server running on port ${port}`));

