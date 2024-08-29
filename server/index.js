const express = require('express');
const cors = require('cors');
const { mongodbconnected } = require("./connection");
const routeruser = require('./routers/user');
const routerauth = require('./routers/authroute')
const usermodel = require('./models/user');
const logoutroute = require('./routers/user')
const cookieparse = require('cookie-parser');
const bodyparser = require('body-parser');
require("dotenv").config();
const passport = require('passport');
const passportStrategy = require('./passport');
const Session = require('express-session');
require('./middleware/auth')

const app = express();

app.use(Session({
  name : 'session',
  secret : 'somesessionkey',
  maxage : 24 * 60 * 60 * 100,
  resave: false,
  saveUninitialized: true,
  cookie : {secure : false}
}))

const corsOptions = {
  Origin: "https://laiba-02-client.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// Use middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparse());
app.use(bodyparser.json());
app.use(passport.initialize());
app.use(passport.session());

mongodbconnected(process.env.MONGOOSE_URL)
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log('error', err));

app.use('/', routeruser);
app.use('/', routerauth)
app.use('/', logoutroute);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
 res.send( `<h1>Hello From Server</h1>`);
})

app.get('/getusers', (req, res) => {
  usermodel.find()
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

app.get('/getallusers', (req, res) => {
  usermodel.find()
    .then((users) => res.send(users))
    .catch((err) => res.send(err));
});


app.listen(8000, () => console.log("server started"));