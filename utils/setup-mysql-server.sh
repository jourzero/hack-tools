#!/bin/bash
CMD[1]="apt-get update"
CMD[2]="apt-get -y install mysql-server"
CMD[3]="service mysql start"
CMD[4]="service mysql status"
CMD[5]="mysql < /app/data/create_mysql_tester.sql"
CMD[6]="mysql < /app/data/create_testdb.sql"
INTERACTIVE=0
answer=y

echo -e "\n-- Setting-up mysql server"
if [ "$INTERACTIVE" = 1 ];then
    read -p "Proceed? [n] " answer
fi

if [ "$answer" = y ];then
  for i in $(seq 3 6);do
    echo -e "\n-- Executing ${CMD[$i]}"
    if [ "$INTERACTIVE" -eq 1 ];then
        read -p "Proceed? [n] " answer
    fi
    if [ "$answer" = y ];then
      /bin/bash -c "${CMD[$i]}"
    fi
  done
fi
