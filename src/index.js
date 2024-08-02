require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const connectDB = require("../config/db");
const User = require("./models/User");
const Todo = require("./models/Todo");
const logger = require('../logger');  // Correctly import the logger

// Ensure Passport configuration is loaded
require('../config/passport')(passport);

const app = express();

logger.info('[Startup] Application starting...');
logger.debug('[Startup] Environment variables loaded:', process.env);

connectDB();
logger.info('[Database] Database connected successfully');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
logger.info('[Express] View engine set to Pug');
logger.debug('[Express] Views directory set to:', path.join(__dirname, "views"));

app.use(bodyParser.json());
logger.info('[Middleware] JSON Body parser added');
app.use(bodyParser.urlencoded({ extended: true }));
logger.info('[Middleware] URL-encoded Body parser added');
app.use(express.static(path.resolve(__dirname, "..", "dist")));
logger.info('[Middleware] Static files directory set to:', path.resolve(__dirname, "..", "dist"));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
logger.info('[Middleware] Session middleware configured');
app.use(passport.initialize());
logger.info('[Middleware] Passport initialized');
app.use(passport.session());
logger.info('[Middleware] Passport session middleware added');

app.use((req, res, next) => {
  logger.debug('[Middleware] User in session:', req.user);
  res.locals.user = req.user;
  next();
});
logger.info('[Middleware] User information added to response locals');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    logger.debug('[Middleware] User authenticated:', req.user._id);
    return next();
  }
  logger.info('[Middleware] User not authenticated, redirecting to /login');
  res.redirect('/login');
}

app.get("/", ensureAuthenticated, async (req, res) => {
  logger.info('[GET /] Request received');
  try {
    logger.debug('[GET /] Fetching todos for user:', req.user._id);
    const todos = await Todo.find({ user: req.user._id });
    logger.info('[GET /] Todos fetched successfully');
    logger.debug('[GET /] Todos:', JSON.stringify(todos));
    res.render("index", { todos, user: req.user });
    logger.info('[GET /] Response rendered with todos and user information');
  } catch (error) {
    logger.error('[GET /] Error fetching todos:', error.message);
    res.status(500).send('Server Error');
    logger.info('[GET /] Server error response sent');
  }
});

app.get("/reports", ensureAuthenticated, (req, res) => {
  logger.info('[GET /reports] Request received');
  res.render("reports");
  logger.info('[GET /reports] Response rendered');
});

app.get("/sales", ensureAuthenticated, (req, res) => {
  logger.info('[GET /sales] Request received');
  res.render("sales");
  logger.info('[GET /sales] Response rendered');
});

app.get("/analytics", ensureAuthenticated, (req, res) => {
  logger.info('[GET /analytics] Request received');
  res.render("analytics");
  logger.info('[GET /analytics] Response rendered');
});

app.get("/customer-support", ensureAuthenticated, (req, res) => {
  logger.info('[GET /customer-support] Request received');
  res.render("customer-support");
  logger.info('[GET /customer-support] Response rendered');
});

app.get("/finance", ensureAuthenticated, (req, res) => {
  logger.info('[GET /finance] Request received');
  res.render("finance");
  logger.info('[GET /finance] Response rendered');
});

app.get("/human-resources", ensureAuthenticated, (req, res) => {
  logger.info('[GET /human-resources] Request received');
  res.render("human-resources");
  logger.info('[GET /human-resources] Response rendered');
});

app.get("/it-support", ensureAuthenticated, (req, res) => {
  logger.info('[GET /it-support] Request received');
  res.render("it-support");
  logger.info('[GET /it-support] Response rendered');
});

app.get("/marketing", ensureAuthenticated, (req, res) => {
  logger.info('[GET /marketing] Request received');
  res.render("marketing");
  logger.info('[GET /marketing] Response rendered');
});

app.get("/operations", ensureAuthenticated, (req, res) => {
  logger.info('[GET /operations] Request received');
  res.render("operations");
  logger.info('[GET /operations] Response rendered');
});

app.get("/other-business", ensureAuthenticated, (req, res) => {
  logger.info('[GET /other-business] Request received');
  res.render("other-business");
  logger.info('[GET /other-business] Response rendered');
});

app.post("/todo", ensureAuthenticated, async (req, res) => {
  logger.info('[POST /todo] Request received');
  logger.debug('[POST /todo] Request body:', req.body);
  try {
    logger.debug('[POST /todo] Creating new todo:', req.body.todo);
    const newTodo = new Todo({
      text: req.body.todo,
      user: req.user._id
    });
    await newTodo.save();
    logger.info('[POST /todo] Todo saved successfully');
    logger.debug('[POST /todo] Saved todo:', JSON.stringify(newTodo));

    const todos = await Todo.find({ user: req.user._id });
    logger.info('[POST /todo] Fetched todos for response');
    logger.debug('[POST /todo] Todos:', JSON.stringify(todos));
    res.json(todos);
    logger.info('[POST /todo] JSON response sent with todos');
  } catch (error) {
    logger.error('[POST /todo] Error saving todo:', error.message);
    res.status(500).send('Server Error');
    logger.info('[POST /todo] Server error response sent');
  }
});

app.get("/register", (req, res) => {
  logger.info('[GET /register] Request received');
  res.render("register", { user: req.user });
  logger.info('[GET /register] Response rendered');
});

app.get("/login", (req, res) => {
  logger.info('[GET /login] Request received');
  res.render("login", { user: req.user });
  logger.info('[GET /login] Response rendered');
});

app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  logger.info('[POST /register] Request received');
  logger.debug('[POST /register] Request body:', req.body);
  try {
    logger.debug('[POST /register] Creating new user with username:', username);
    const user = new User({ username, password, role });
    await user.save();
    logger.info('[POST /register] User registered successfully');
    res.status(200).json({ redirectUrl: '/login' });
    logger.info('[POST /register] JSON response sent with redirect URL');
  } catch (error) {
    logger.error('[POST /register] Registration error:', error.message);
    res.status(400).json({ error: error.message });
    logger.info('[POST /register] JSON response sent with error message');
  }
});

app.post("/login", (req, res, next) => {
  logger.info('[POST /login] Request received');
  logger.debug('[POST /login] Request body:', req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.error('[POST /login] Authentication error:', err);
      return next(err);
    }
    if (!user) {
      logger.info('[POST /login] Authentication failed');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        logger.error('[POST /login] Login error:', err);
        return next(err);
      }
      logger.info('[POST /login] Authentication successful');
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  logger.info('[GET /logout] Request received');
  logger.debug('[GET /logout] Logging out user:', req.user._id);
  req.logout((err) => {
    if (err) {
      logger.error('[GET /logout] Logout error:', err);
      return next(err);
    }
    logger.info('[GET /logout] User logged out successfully');
    res.redirect("/login");
    logger.info('[GET /logout] Redirected to /login');
  });
});

module.exports = app;

logger.info('[Startup] Application setup complete, ready to listen for requests');
