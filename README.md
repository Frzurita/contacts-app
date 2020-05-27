# Contacts app

This is an example of product built in nestJS and ReactJS using Postgres as a data base.

## How to use it

- Clone the repo into your computer
- Add a .env file inside the backend folder
- Copy all the content inside .env.local into the .env file
- Modify the value of the fields inside the .env file to get a correct configuration of your environment
- Run `yarn install` in the root folder
- Run `yarn start` to start the application in dev mode

## Create the DB using docker

- Install **docker** and **docker-compose**
- run `docker-compose up -d` inside the root folder

## Run tests

- You need to create the DB contacts-app-test to run all the behavioural tests there
- Go to the backend folder
- Run `yarn test:unit` to get the unit tests executed
- Run `yarn test:behaviour` to get the behavioural tests executed
- Run `yarn test:cov` to get a coverage report
- To run the e2e test. Once you started the project, open a new terminal and go to the frontend folder. Once you are there, run `yarn e2e`
