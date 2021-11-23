// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const express = require('express');
const app = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

// app.use(cookieParser('keyboard cat'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash('info');
    next();
})

app.get('/flash', function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('info', 'Flash is back!')
    res.redirect('/');
});

app.get('/', function (req, res) {
    // Get an array of flash messages by passing the key to req.flash()
    res.render('test_index');
});

const port = 3000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})