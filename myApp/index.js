const express = require('express')
const app = express()
const path = require('path')
const env = require('dotenv').config()
const cookie = require('cookie-parser')
const cors = require('cors');
const PORT = process.env.PORT;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views', 'subDir'));
app.set('view engine', 'pug');

// custom middleware logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next();
})

// Cross Origin Resource Sharing 
app.use(cors());

// reuestTime middleware function
const requestTime = (req, res, next) => {
    req.requestTime = Date.now()
    next()
}

app.use(requestTime)


// built-in middleware to handle urlencodes data i.e., form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/subdir', indexRouter)
app.use('/users', usersRouter)

app.use(cookie())


app.get('^/$|/index(.html)?', (req, res) => {
    // res.send("Hello World!")
    // res.sendFile("./views/index.html", { root: __dirname })
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
});
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'newPage.html'))
});
app.get('/back(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');//302 by default
});

// chaining route handlers
const one = (req, res, next) => {
    console.log('One');
    next();
}
const two = (req, res, next) => {
    console.log('Two');
    next();
}
const three = (req, res) => {
    console.log('Three');
    res.send('One Two Three Executed!' + ` Requested at: ${req.requestTime}`);
}

app.get('/chain(.html)?', [one, two, three]);

app.get('/cookie', (req, res) => {
    res.cookie('name', 'Abishek').send('Setting Cookie!!');
})

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
});


app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
})
