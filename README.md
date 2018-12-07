# agile-checklist
Implementing the My Checklist using the PREN stack (PostgreSQL, ReactJS, ExpressJS, and NodeJS).

Configure development environment and run My Checklist in Linux environment

01. sudo apt-get update && sudo apt-get upgrade
02. Browser https://code.visualstudio.com/download Download .deb and install (dpkg -i <your>.deb)
03. In a console (ctrl + alt + t): mkdir Projects && cd Projects
04. git clone https://github.com/thiagoferrax/agile-checklist.git
05. git config --global user.name "thiagoferrax"
06. sudo apt install nodejs
07. node -v
08. sudo apt install npm
09. npm -v
10. sudo apt-get install postgresql postgresql-contrib
11. sudo -u postgres psql
12. \password 123456
13. create database agile_checklist;
14.  \c agile_checklist;
15. Open a new console (ctrl + alt + t): cd ~/Projects && code .
16. sudo npm i npm@latest -g
17. sudo npm install knex -g
18. cd ~/Projects/agile-checklist/backend &&  knex migrate:latest 
19. Check in the psql (postgres) console: \dt
20. cd ~/Projects/agile-checklist/backend && npm i
21. npm start
22. Open a new console (ctrl + alt + t): cd ~/Projects/agile-checklist/frontend && npm i
23. Open a browser and http://localhost:3000
