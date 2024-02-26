var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./models");
require('dotenv').config();
const { setLocale } = require('yup');
const { fr } = require('yup-locales');
const cron = require('./cron');

/* App configuration  */
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

//app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: true, // "true" will copy the domain of the request back
                  // to the reply. If you need more control than this
                  // use a function.

    credentials: true, // This MUST be "true" if your endpoint is
                       // authenticated via either a session cookie
                       // or Authorization header. Otherwise the
                       // browser will block the response.

    methods: 'POST,GET,PUT,OPTIONS,DELETE' // Make sure you're not blocking
                                           // pre-flight OPTIONS requests
}))

app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        // "Origin, Content-Type, Accept"
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// JWT
// app.use(
//     cookieSession({
//         name: "mean-stack-session",
//         keys: [process.env.COOKIE_SECRET],
//         httpOnly: true
//     })
// );

var corsOptions = {
    origin: process.env.ORIGIN
};
// app.use(cors(corsOptions));

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

/* yup local */
setLocale(fr);
/* ---------- */

/* Routing */

/*var indexRouter = require('./routes/index.route');
var userRouter = require('./routes/user.route');
var authRouter = require('./routes/auth.route');
var serviceRouter=require('./routes/service.route');

app.use('/api/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/service',serviceRouter);
app.listen(`${process.env.PORT}`, () => {   
	console.log('Server is running on port'+`${process.env.PORT}`); 
});*/

/*app.listen(`${process.env.PORT}`, () => {   
	console.log('Server is running on port'+`${process.env.PORT}`); 
});*/

var router = require('./routes');

app.use('/auth', router.auth);
app.use('/api/', router.index);
app.use('/api/user', router.user);
app.use('/api/auth', router.auth);
app.use('/api/service', router.service);
app.use('/api/depense', router.depense);
app.use('/api/rendezVous', router.rendezVous);
app.use('/api/prestation', router.prestation);

/* ---------- */

/* CRON */
cron.rendezVousCron.rappel();
/* ---- */

module.exports = app;
