const mongoose = require('mongoose');

const con = () => {
    return mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
};

module.exports = con;
//TODO: move mongodb url to environmental variables
