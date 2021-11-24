const express = require('express')
const app = express()

const static = express.static(__dirname + '/public');
const session = require('express-session');
const configRoutes = require('./routes')
const exphbs = require('express-handlebars')

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: "navi dendi",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 9000000 }
  })
);


//Logging middleware
app.use(async (req, res, next) => {
  // console.log(new Date().toUTCString());
  // console.log(req.method);
  // console.log(req.originalUrl);
  if (req.session.userId) {
    console.log("Authenticated User");
  } else {
    console.log("Non-Authenticated User");
  }
  next();
})

//Authentication middleware
app.use('/login/private', async (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(403).render("login/error", { error: "user is not logged in" });
    return;
  }
})

app.use('/landing/*', async (req, res, next) => {
  if (req.session.userId) {
    //call your API
    next();
  } else {
    res.status(403).render("login/error", { error: "user is not logged in" });
    return;
  }
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});