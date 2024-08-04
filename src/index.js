require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const connectDB = require("../config/db");
const User = require("./models/User");
const Todo = require("./models/Todo");
const Mask = require("./components/entry/todoList/logger/lib/mask");
const logger = new Mask(require("./components/entry/todoList/logger/lib/logger")); // Import and use the masked logger

// Ensure Passport configuration is loaded
require('../config/passport')(passport);

const app = express();

connectDB();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "..", "dist")));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get("/", ensureAuthenticated, async (req, res) => {
  try {
    logger.info({ endpoint: "/", query: req.query, description: "Query made" }); // Log query
    const todos = await Todo.find({ user: req.user._id });
    logger.info({ endpoint: "/", todos, user: req.user, description: "Response with todos" }); // Log response
    res.render("index", { todos, user: req.user, page: 'home' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.get("/reports", ensureAuthenticated, (req, res) => {
  res.render("reports", { page: 'reports' });
});

app.get("/sales", ensureAuthenticated, (req, res) => {
  res.render("sales", { page: 'sales' });
});

app.get("/analytics", ensureAuthenticated, (req, res) => {
  res.render("analytics", { page: 'analytics' });
});

app.get("/customer-support", ensureAuthenticated, (req, res) => {
  res.render("customer-support", { page: 'customer-support' });
});

app.get("/finance", ensureAuthenticated, (req, res) => {
  res.render("finance", { page: 'finance' });
});

app.get("/human-resources", ensureAuthenticated, (req, res) => {
  res.render("human-resources", { page: 'human-resources' });
});

app.get("/it-support", ensureAuthenticated, (req, res) => {
  res.render("it-support", { page: 'it-support' });
});

app.get("/marketing", ensureAuthenticated, (req, res) => {
  res.render("marketing", { page: 'marketing' });
});

app.get("/operations", ensureAuthenticated, (req, res) => {
  res.render("operations", { page: 'operations' });
});

app.get("/other-business", ensureAuthenticated, (req, res) => {
  res.render("other-business", { page: 'other-business' });
});

app.post("/todo", ensureAuthenticated, async (req, res) => {
  logger.info({ endpoint: "/todo", query: req.body, description: "Query made" }); // Log query
  try {
    const newTodo = new Todo({
      text: req.body.todo,
      user: req.user._id
    });
    await newTodo.save();
    logger.info({ endpoint: "/todo", description: "New todo created", newTodo }); // Log new todo
    const todos = await Todo.find({ user: req.user._id });
    logger.info({ endpoint: "/todo", todos, user: req.user, description: "Response with todos" }); // Log response
    res.json(todos);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.get("/register", (req, res) => {
  res.render("register", { user: req.user, page: 'register' });
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user, page: 'login' });
});

app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  logger.info({ endpoint: "/register", query: req.body, description: "Registration data" }); // Log registration data
  try {
    const user = new User({ username, password, role });
    await user.save();
    logger.info({ endpoint: "/register", description: "User registered", user }); // Log user registered
    res.status(200).json({ redirectUrl: '/login' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", (req, res, next) => {
  logger.info({ endpoint: "/login", query: req.body, description: "Login data" }); // Log login data
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      logger.info({ endpoint: "/login", description: "User logged in", user }); // Log user logged in
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    logger.info({ endpoint: "/logout", description: "User logged out", user: req.user }); // Log user logged out
    res.redirect("/login");
  });
});

module.exports = app;
