const session = require('express-session');
const flash = require('connect-flash');
// const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const path = require('path');
const Story = require('./models/stories');
const favicon = require('serve-favicon');
const ejsMate = require('ejs-mate');

// Connect with mongo database
main()
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/hackernews');
}

app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
// app.use(morgan('tiny'));

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // to parse the request body with JSON

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash('success');
    next();
})

// ROUTING
app.get('/', async (req, res) => {
    const stories = await Story.find();
    res.render('./stories/index', { stories });
})

// READ
app.get('/search', async (req, res) => {
    const searchText = req.query.q;

    if (searchText) {
        const stories = await Story.find({ title: { $regex: searchText, $options: 'i' } });
        res.render('./stories/search', { stories });
    } else {
        res.redirect('/');
    }
})

// CREATE
app.get('/new', (req, res) => {
    res.render('./stories/new');
})

app.post('/', async (req, res) => {
    const story = new Story(req.body.story);
    await story.save();
    req.flash('success', 'Successfully added a new story!');
    res.redirect('/');
})

// UPDATE
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const stories = await Story.findById(id);
    res.render('./stories/edit', { stories });
})

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const stories = await Story.findByIdAndUpdate(id, { ...req.body.story });
    await stories.save();
    req.flash('success', 'Successfully updated a story!');
    res.redirect('/');
})

// DELETE
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Story.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a story!');
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})