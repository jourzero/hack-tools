const logger = require("./lib/appLogger.js");
const libxmljs = require("libxmljs");
const serialize = require("node-serialize");
const mysql = require("mysql");
const sqlite3 = require("sqlite3");
var ldap = require("ldapjs");
const {exceptions} = require("./lib/appLogger.js");

exports.xmlParser = function (req, res) {
    let ok = function (doc) {
        logger.info(`Successful hacktool execution. Doc: ${JSON.stringify(doc)}`);
        res.json(doc);
    };
    let err = function (errMsg) {
        logger.warn(`Failed hacktool execution: ${JSON.stringify(errMsg)}`);
        res.json({ERROR: errMsg});
    };
    logger.info("Running XML parser");
    _parseXML(req.body, req.query, ok, err);
};

function _parseXML(body, query, success, error) {
    logger.debug(`BODY: ${body}`);
    if (query.noent === "false") query.noent = false;
    if (query.noent === "true") query.noent = true;
    if (query.noblanks === "false") query.noblanks = false;
    if (query.noblanks === "true") query.noblanks = true;
    logger.debug(`Query: ${JSON.stringify(query)}`);
    try {
        let xmlDoc = libxmljs.parseXmlString(body, query);
        let elementType = xmlDoc.root().name();
        let elements = [];
        let elementsObj = {};
        xmlDoc
            .root()
            .childNodes()
            .forEach((element) => {
                let newElement = {};
                //let elementName = element.name();
                for (let node of element.childNodes()) {
                    newElement[node.name()] = node.text();
                }
                elements.push(newElement);
            });
        //success({elements: elements});
        elementsObj[elementType] = elements;
        success(elementsObj);
    } catch (e) {
        error(`XML parsing error: ${e}`);
    }
}

exports.jsonDeserializer = function (req, res) {
    let ok = function (doc) {
        logger.info(`Successful hacktool execution. Doc: ${JSON.stringify(doc)}`);
        res.json(doc);
    };
    let err = function (errMsg) {
        logger.warn(`Failed hacktool execution: ${JSON.stringify(errMsg)}`);
        res.json({ERROR: errMsg});
    };
    logger.info("Running JSON parser");
    _deserializeJSON(req.body, ok, err);
};

function _deserializeJSON(body, success, error) {
    logger.debug(`BODY: ${body}`);
    let jsonData = {};
    try {
        // Keep it insecure ;-) //jsonData = JSON.parse(body);
        jsonData = serialize.unserialize(body);
    } catch (e) {
        error(`JSON parsing error: ${e}`);
    }
    success(jsonData);
}

exports.mysqlQuery = function (req, res) {
    let ok = function (doc) {
        logger.info(`Successful hacktool execution. Doc: ${JSON.stringify(doc)}`);
        res.json(doc);
    };
    let err = function (errMsg) {
        logger.warn(`Failed hacktool execution: ${JSON.stringify(errMsg)}`);
        res.json({ERROR: errMsg});
    };
    logger.info("Running mysql interpreter");
    _mysqlQuery(req.body, req.query, ok, err);
};

function _mysqlQuery(body, query, success, error) {
    logger.debug(`Query: ${JSON.stringify(query)}`);
    //let connection = mysql.createConnection({ host: "localhost", user: "tester", database: "mysql", password: "Passw0rd123", });
    let connection = mysql.createConnection(query);

    try {
        connection.connect();
        connection.query(body, function (err, results, fields) {
            if (err) {
                error(`MySql query error: ${err}`);
            } else {
                success(results);
            }
        });
        logger.debug("Ending connection");
        connection.end();
    } catch (e) {
        error(`MySql client exception: ${e}`);
    }
}

exports.sqliteQuery = function (req, res) {
    let ok = function (doc) {
        logger.info(`Successful hacktool execution. Doc: ${JSON.stringify(doc)}`);
        res.json(doc);
    };
    let err = function (errMsg) {
        logger.warn(`Failed hacktool execution: ${JSON.stringify(errMsg)}`);
        res.json({ERROR: errMsg});
    };
    logger.info("Running mysql interpreter");
    _sqliteQuery(req.body, req.query, ok, err);
};

function _sqliteQuery(body, param, success, error) {
    try {
        let dbFile = param.dbFile;
        let db = new sqlite3.Database(dbFile);
        logger.info(`Query to sqlite3 DB ${dbFile}: ${body}`);
        db.serialize(() => {
            let results = [];
            db.each(
                body,
                (err, row) => {
                    if (err) {
                        logger.error(`Error with sqlite3 query: ${err}`);
                        return;
                    }
                    results.push(row);
                },
                () => {
                    success(results);
                }
            );
        });
        logger.debug("Closing the DB");
        db.close();
    } catch (e) {
        logger.error(`Exception with sqlite3 client: ${e}`);
        error(`Exception with sqlite3 client: ${e}`);
        return;
    }
}

exports.ldapSearch = function (req, res) {
    let ok = function (doc) {
        logger.info(`Successful hacktool execution. Doc: ${JSON.stringify(doc)}`);
        res.json(doc);
    };
    let err = function (errMsg) {
        logger.warn(`Failed hacktool execution: ${JSON.stringify(errMsg)}`);
        res.json({ERROR: errMsg});
    };
    logger.info("Running LDAP search");
    _ldapSearch(req.body, req.query, ok, err);
};

function _ldapSearch(body, query, success, error) {
    logger.debug(`Body (${typeof body}): ${body}`);
    logger.debug(`Query (${typeof query}): ${JSON.stringify(query)}`);

    // Parsing body object as JSON
    let data = {};
    try {
        data = JSON.parse(body);
    } catch (e) {
        error(`Parsing exception: ${e}`);
        return;
    }

    // Create LDAP client
    let client = ldap.createClient(query);

    try {
        // Bind
        logger.info(`Binding using DN ${data.bind.dn}`);
        let entries = [];
        client.bind(data.bind.dn, data.bind.password, function (err) {
            if (err) {
                error(`LDAP bind error: ${err}`);
                return;
            }
            logger.info("LDAP bind succeeded");

            client.search(data.search.base, data.search.options, function (serr, res) {
                if (serr) {
                    error(`LDAP search error: ${serr}`);
                    return;
                }
                res.on("searchEntry", function (entry) {
                    logger.info("entry: " + JSON.stringify(entry.object));
                    entries.push(entry.object);
                });
                res.on("searchReference", function (referral) {
                    logger.info("referral: " + referral.uris.join());
                });
                res.on("error", function (eerr) {
                    logger.error("error: " + eerr.message);
                });
                res.on("end", function (result) {
                    logger.info(`End: ${result.status}`);
                    success(entries);
                    return;
                });
            });
        });

        /*
        connection.connect();
        connection.query(body, function (err, results, fields) {
            if (err) {
                error(`MySql query error: ${err}`);
            } else {
                success(results);
            }
        });
        logger.debug("Ending connection");
        connection.end();
        */
    } catch (e) {
        error(`LDAP exception: ${e}`);
    }
}
