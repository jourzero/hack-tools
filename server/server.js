// Load .env file
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("./lib/appLogger.js");
const reqLogger = require("./lib/reqLogger.js");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config.js");
const hacktool = require("./HackTool.js");
const _ = require("lodash");
let messages = [];
let lastId = 1;

// ========================================== GET CONFIG ==========================================
const port = process.env.PORT || config.port;

// ========================================== EXPRESS ==========================================
// Configure Express
let app = express();
app.disable("x-powered-by");
app.use(reqLogger);
app.use(cookieParser());
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "5mb"}));
app.use(bodyParser.text());
app.use(methodOverride());
app.use(session(config.session));
// Disable caching during some testing
app.disable("etag");

// Serve favicon and static content
app.use(favicon(path.join(__dirname, "../client", "favicon.ico")));
app.use(express.static(path.join(__dirname, "../client")));

// Serve jquery npm module content to clients.  NOTE: make sure client source fiels use: <script src="/jquery/jquery.js"></script>
app.use("/dist/jquery", express.static(path.join(__dirname, "../node_modules/jquery/dist/")));
app.use("/dist/bootstrap", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/")));
app.use("/dist/lodash", express.static(path.join(__dirname, "../node_modules/lodash/")));

// Serve private static content
app.use("/static", express.static(path.join(__dirname, "../static/")));

// Session-persisted message middleware
app.use(function (req, res, next) {
    let err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

// ========================================== HANDLEBARS ==========================================
// Configure express to use handlebars templates
let hbs = exphbs.create({
    defaultLayout: "main",
    extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// ========================================== WEB APP ROUTES ==========================================
// Hack Tool
app.get("/hacktool", function (req, res) {
    // Get user info
    let user = config.authMode == config.AUTH_MODE_NONE ? config.LOCAL_USER : req.user;
    res.render("hacktool", {user: user});
});

app.get("/chat", function (req, res) {
    res.render("chat", {
        messages: messages,
        msgs: JSON.stringify(messages, null, 2),
        chatusers: JSON.stringify(chatusers, null, 2),
        user_canDelete: chatusers[0].canDelete,
        object_canDelete: Object.canDelete,
    });
});

// ========================================== REST ROUTES ==========================================
app.post("/api/hacktool/:hacktool", hacktool.run);

//======================================================================
// Credits: https://github.com/Kirill89/prototype-pollution-explained
//
// This is a simple chat API:
//
// - All users can see all messages.
// - Registered users can post messages.
// - Administrators can delete messages.
//======================================================================
const chatusers = [
    // You know password for the user.
    {name: "user", password: "123456"},
    // You don't know password for the admin.
    //{name: "admin", password: Math.random().toString(32), canDelete: true},
    {name: "admin", password: "1234567", canDelete: true},
];

function findChatUser(auth) {
    return chatusers.find((u) => u.name === auth.name && u.password === auth.password);
}

// Get all messages (publicly available).
app.get("/msg", (req, res) => {
    res.send(messages);
});

// Get all chatusers
app.get("/chatusers", (req, res) => {
    res.send(chatusers);
});

// Post message (restricted for users only).
app.put("/msg", (req, res) => {
    const user = findChatUser(req.body.auth || {});
    logger.info(`New incoming message: ${JSON.stringify(req.body.message)}`);

    if (!user) {
        res.status(403).send({ok: false, error: "Access denied"});
        return;
    }

    const message = {
        // Default message icon. Can be overwritten by user.
        icon: "👋",
    };

    // Prototype pollution attempt (if lodash's merge is vulnerable)
    //if (pollute) message.__proto__.canDelete = true;

    // Call lodash's merge function
    _.merge(message, req.body.message, {
        id: lastId++,
        timestamp: Date.now(),
        userName: user.name,
    });

    messages.push(message);
    res.send({ok: true});
});

// Delete message by ID (restricted for users with flag "canDelete" only).
app.delete("/msg", (req, res) => {
    const user = findChatUser(req.body.auth || {});

    if (!user || !user.canDelete) {
        res.status(403).send({ok: false, error: "Access denied"});
        return;
    }

    messages = messages.filter((m) => m.id !== req.body.messageId);
    res.send({ok: true});
});

// ========================================== ERROR HANDLING ==========================================
// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
function error(status, msg) {
    let err = new Error(msg);
    err.status = status;
    return err;
}

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function (err, req, res, next) {
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500);
    res.send({error: err.message});
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function (req, res) {
    res.status(404);
    res.send({Error: "This request is unsupported!"});
});

// ========================================== START LISTENER ==========================================
app.listen(port);
/* eslint-disable */
logger.info(`Listening on port ${port}`);
/* eslint-enable */
