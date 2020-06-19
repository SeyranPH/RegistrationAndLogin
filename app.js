let express = require('express');
let bodyParser = require('body-parser');
const uuid = require('uuidv4').uuid;
const bcrypt = require('bcrypt');

let app = express();
let port = process.env.port || 3000;
let urlencodedParser = bodyParser.urlencoded({extended: false});

const db = {
    users: {},
    sessions: { 
        sessionToUser: {},
        userToSession: {}
    }
};
app.use(express.static(__dirname + "/public"));
app.use(urlencodedParser);
app.use(bodyParser.json());


app.get("/", function (req, res){

});

app.get("/user", function (req, res){

});

app.get("/session", function (req, res){

});

app.get("/product", function (req, res){

});

app.post("/user", function callback(req, res){
    console.log("created user with name" + req.body.username);
    console.log(req.body);
    bcrypt.hash(req.body.password, 5, function (err, hash){
        db.users[req.body.username]=hash;
    });
    res.sendStatus(200);
});

app.post("/session", function callback(req, res){
    if (!req.body.username || !db.users[req.body.username] || !req.body.password){
        res.sendStatus(401);
        return;
    }
    bcrypt.compare(req.body.password, db.users[req.body.username], function (err, result){
        if (!result){
            res.sendStatus(401);    
        }
        else {
            const sessionToken = uuid(); 
            db.sessions.userToSession[req.body.username] = sessionToken;
            db.sessions.sessionToUser[sessionToken] = req.body.username;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({sessions: sessionToken}));
        }
    });

    
});

app.get("/product", function(req, res){
    const sessionToken = req.header("sessionToken");
    if (!sessionToken) {
        res.sendStatus(401);
        return;
    }

    const username = db.sessions.sessionToUser[sessionToken];
    if (username === undefined){
        res.sendStatus(401);
        return;
    }
    else {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({productName: "car"}));
    }

});

//jwt
//db


app.listen(port);
