var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./models");
require('dotenv').config();

/* App configuration  */
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

app.use(
    cookieSession({
        name: "mean-stack-session",
        keys: [process.env.COOKIE_SECRET],
        httpOnly: true
    })
);

var corsOptions = {
    origin: process.env.ORIGIN
};
app.use(cors(corsOptions));

/* ------------ */

/* Connection mongoDB */
db.mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
    console.log('Connecté à MongoDB');
    initial();
}).catch((error) => {
    console.log(error);
    process.exit();
});

const Groupe = db.groupe;

async function initial(){
    console.log("Création des groupes d'utilisateur");
    db.GROUPES.forEach(async (groupe) => {
        const groupeId = await Groupe.exists({nom: groupe});
        if(groupeId == null){
            console.log(`Creation du groupe ${groupe}`);
            await new Groupe({nom: groupe}).save();
        }
    });
    console.log("Groupes créées")
}
/* ---------- */

/* Routing */
var indexRouter = require('./routes/index.route');
var userRouter = require('./routes/user.route');
var authRouter = require('./routes/auth.route');

app.use('/api/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
/* ---------- */

module.exports = app;
