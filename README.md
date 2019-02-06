# agile-checklist
> 

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

>

![mychecklist](https://user-images.githubusercontent.com/43149895/52360662-529cc480-2a1b-11e9-841a-9821ed3ca126.gif)

>

## Install

```
# Download the repository
01. git clone https://github.com/thiagoferrax/agile-checklist.git

# Installing node, npm and knex
02. sudo apt-get install nodejs npm
03. sudo npm i npm@latest -g
04. sudo npm install knex -g

# Installing and configuring postgres
05. sudo apt-get install postgresql postgresql-contrib
06. sudo -u postgres psql
07. \password 123456
08. create database agile_checklist;

# Backend configuration
09. cd agile-checklist/backend && npm i
10. cp env_file .env && nano .env
11. Add a authSecret in the .env file
12. npm start

# Frontend configuration
13. In a new console: cd agile-checklist/frontend && npm i
14. npm start
15. Use a browser to open http://localhost:3000
```
## License

MIT © [thiagoferrax](https://github.com/thiagoferrax)
