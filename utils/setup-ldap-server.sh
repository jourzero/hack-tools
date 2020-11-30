#!/bin/bash
CMD[1]="mv /etc/ldap/slapd.d /etc/ldap/slapd.d.orig"
CMD[2]="mkdir /etc/ldap/slapd.d"
CMD[3]="mv /var/lib/ldap /var/lib/ldap.orig"
CMD[4]="mkdir /var/lib/ldap"
CMD[5]="slapadd -n 0 -F /etc/ldap/slapd.d -l /app/data/config.ldif"
CMD[6]="slapadd -n 1 -F /etc/ldap/slapd.d -l /app/data/data.ldif"
CMD[7]="chown -R openldap:openldap /etc/ldap/slapd.d"
CMD[8]="chown -R openldap:openldap /var/lib/ldap"
CMD[9]="slapadd -l /app/data/testorg.ldif"
CMD[10]="service slapd start"
CMD[11]="service slapd status"

# Setup environment
INTERACTIVE=0
answer=y

echo -e "\n-- Setting-up ldap server"
if [ "$INTERACTIVE" = 1 ];then
    read -p "Proceed? [n] " answer
fi

if [ "$answer" = y ];then
  for i in $(seq 1 11);do
    echo -e "\n-- Executing ${CMD[$i]}"
    if [ "$INTERACTIVE" -eq 1 ];then
        read -p "Proceed? [n] " answer
    fi
    if [ "$answer" = y ];then
      /bin/bash -c "${CMD[$i]}"
    fi
  done
fi
