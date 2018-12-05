# agile-checklist
Implementing the Scrum Evaluation Checklist using the PREN technology stack (PostgreSQL, ReactJS, ExpressJS, and NodeJS).

How to Configure Development Environment and Run agile-checklist in Linux Environment

1. sudo apt-get update && sudo apt-get upgrade
2. Browser https://code.visualstudio.com/download Download .deb and install (dpkg -i <your>.deb)
3. In a console (ctrl + alt + t): mkdir Projects && cd Projects
4. git clone --single-branch -b frontend_admin_lte https://github.com/thiagoferrax/agile-checklist.git
5. git config --global user.name "thiagoferrax"
6. sudo apt install nodejs
7. node -v
8. sudo apt install npm
9. npm -v
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
23. Open a browser and http://localhost:8081