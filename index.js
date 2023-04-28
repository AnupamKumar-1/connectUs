const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 10000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const path = require('path');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());   
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'connectus',
    
    secret: '1Sm:9j4Pp<+O`5zzp2{5|#o($?qr30OCg(>HUji#sL|c%|C[`Lq>BfF[Z.De7Zk',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes'));




// running server
app.listen(port, function (err) {
    if (err) {
        console.log('err', 'server can not be started');
    }
    console.log('server is running on ', port);
})