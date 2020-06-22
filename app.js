let express = require("express");
let bodyParser = require("body-parser");
const uuid = require("uuidv4").uuid;
const bcrypt = require("bcrypt");

const con = require("./database/index.js");
const User = require("./database/user.js");
const e = require("express");

let app = express();
let port = process.env.port || 3000;
let urlencodedParser = bodyParser.urlencoded({ extended: false });
con();

app.use(express.static(__dirname + "/public"));
app.use(urlencodedParser);
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/user", function (req, res) {
  res.sendFile(__dirname + "/views/user.html");
});

app.get("/session", function (req, res) {
  res.sendFile(__dirname + "/views/session.html");
});

app.get("/product", function (req, res) {});

app.post("/user", function callback(req, res) {
  if (!req.body.username || !req.body.password){
    res.sendStatus(401);
    return;
  }
  console.log("created user with name " + req.body.username);

  bcrypt.hash(req.body.password, 5, function (err, hash) {
    User.create({username: req.body.username, passwordHash: hash}, function (err){
      if (err) throw console.error(err);
      else console.log('registered new user with username: ' + req.body.username + ' and password: ' + hash);
    })
  });
  res.sendStatus(200);
});

app.post("/session", async function (req, res) {
  let userObj = null;
  try {
    userObj =  await User.findOne({"username": req.body.username}).exec();
    console.log(userObj);
  }
  catch (e){
    console.log(e);
  }

  if (!req.body.username || !userObj || !req.body.password) 
  {
    res.sendStatus(401);
    return;
  }
  const result = await bcrypt.compare(req.body.password, userObj.passwordHash);
  
  if (!result) {
    res.sendStatus(401);
  } 
  else {
    const sessionToken = uuid();
    await User.updateOne(
      {"_id" : userObj._id}, 
      {"session": sessionToken}
    ).exec();

    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ sessions: sessionToken }));
  }
});

app.get("/product", function (req, res) {
  const sessionToken = req.header("sessionToken");
  if (!sessionToken) {
    res.sendStatus(401);
    return;
  }

  const username = db.sessions.sessionToUser[sessionToken];
  if (username === undefined) {
    res.sendStatus(401);
    return;
  } else {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ productName: "car" }));
  }
});

//jwt
//db

app.listen(port, function(){
  console.log('listening');
});
