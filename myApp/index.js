const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3001;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// custom middleware logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next();
})

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


app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
});


app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
})
