# agile-checklist
> 

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About My Checklist

It can be used to track different information from the team and other stakeholders about software development processes, customer satisfaction and whatever you decide is important.

Some ideas that helped me design My Checklist:
<ul>
  <li>One of the most important practices in agile methods is the retrospective, when the team can discuss the best and worst practices, actions and results about each iteration and figure out what it can do to overcame the problems and keep increasing its productivity and the releases quality</li>
  <li>The team can identify the majority of the iterations problems and part of them are related to the managemet (agile) and development processes, and with the team itself</li>
  <li>It is important to continuosly track the team perception, plan and control the actions to keep going better, and the team itself can do that</li>
  <li>The team can create some simple checklists for the main development processes and track some information to better understand how to focus its actions to improve in the next iterations. Some examples about what the team can track are: client satisfaction, code review, how the team is using agile methods, feedbacks, and other information that could help understand the project results during its execution</li>
</ul>

![mychecklist](https://user-images.githubusercontent.com/43149895/53651330-30b2ee00-3c25-11e9-8155-d419fb1d3a29.gif)

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
