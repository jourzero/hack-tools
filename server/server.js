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

// ========================================== GET CONFIG ==========================================
const port = process.env.PORT || config.port;

// ========================================== EXPRESS ==========================================
// Configure Express
let app = express();
//app.disable("x-powered-by");
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

// ========================================== REST ROUTES ==========================================
app.post("/api/hacktool/:hacktool", hacktool.run);

// ========================================== ERROR HANDLING ==========================================
// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
function error(status, msg) {
    var err = new Error(msg);
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
