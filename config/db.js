const mongoose = require('mongoose');

//connect database
mongoose.connect('mongodb://localhost:27017/user_logindb',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: false });

