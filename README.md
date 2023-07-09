# scissors

### A Scissors application built using node, express. It is used to shorten long URLs

## URL
1. Online: https://mern-hnu2.onrender.com
2. Online Documentation: https://mern-hnu2.onrender.com/api-docs/

## Features
1. Every URL should be validated before a shorter version is created.
2. The application should also generate a QR CODE for their shortened URLs
   - The QR CODE should be downloadable.
4. Users can customize their shortened URLs.
5. Users can track their shortened URL performance
6. User can see the number of people who clicked a particular link

## Setup
* Pull this repo
* In the CLI run npm install to install all node modules.
* Create a .env file and type in the following in it
```
  PORT = //enter your desired port i.e 3000, 4000 etc
  JWT_SECRET = //enter any string here i.e "akhdefwihgrwkgjwkjwkg"
  MONGODB_URL = //enter your database connection
```
* Run npm run dev on the CLI to start application

