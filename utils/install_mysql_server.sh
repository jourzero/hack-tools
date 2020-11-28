#!/bin/bash
CMD[1]="apt-get update"
CMD[2]="apt-get install mysql-server"
CMD[3]="service mysql start"
CMD[4]="service mysql status"
CMD[5]="mysql < /app/utils/create_mysql_tester.sql"
INTERACTIVE=0

read -p "This will install and configure mysql in ${CTR_NAME} container. Proceed? [n] " answer
if [ "$answer" = y ];then
  for i in $(seq 2 5);do
    echo -e "\n"
    if [ "$INTERACTIVE" -eq 1 ];then
        read -p "-- Execute this command: ${CMD[$i]} ? [y] " answer
    else
        echo -e "-- Executing this command: ${CMD[$i]}..."
        answer=y
    fi
    if [ "$answer" = y -o "$answer" = "" ];then
      /bin/bash -c "${CMD[$i]}"
    fi
  done
fi
