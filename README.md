# Favorr APP

## 1. About
Web Application Developement Group Project for UTS subject: Advanced Internet Programming - Spring 2020 

## 2. Problem definition
#### Requirement:
1. Non Moneytary transactional application
2. Social media aspect via offering favor owned for completed task
3. Auto matching party to clear non-monetary debt

#### Solution:
Implementing above requirement using MERN stack, that has good performance and responsive to work with all modern devices. 

## 3. Features
#### Public Request / Create Public request
- Showing list of users created request with their offered favor
- Logged In users can claim or add more favors to a specific request
- Users can search request based on favor or task detail
- Logged in users have the option to create their own request
#### Leaderboard
- Using Mongoose Aggregation to create a dashboard
#### Login/Register
- Authentication Strategy with [Passport JWT](http://www.passportjs.org/packages/passport-jwt/)
#### Upload Photo Proof
- Using across different section of the web app
- Using [multer](https://github.com/expressjs/multer) as Middleware to handle file uploading
- Images are uploaded to Amazon S3 bucket
#### My Favors / My Claimed Favor / Create Favor
- History to show your claimed favors with photo proof
- Dashboard showing favors owned to you and owned by you
- checking out photo proof submitted by other users to you
- create favors owne to you or owned by you
#### Party detection
- Auto matching you with other users to efficiently clear out owned favor

## 4. Tech stack
- Backend: Node, Express
- Frontend: React
- Database: MongoDB and Amazon S3

## 5. Installation
- For development purpose, clone this repository to your desktop and run **npm install** to install all dependecies. 
you will need to create a .env file in Server folder and add pathing to your MongoDB database instance, configure JWT secret, and pathing to the image storing cloud of your choosing.
- Once all dependencies are installed, you can run **npm start dev** in /server for developement and **npm start** to start the application. The application can be accessed at localhost:3000
- It is required that you connect to your MongoDB intance by adding the link of MONGODB_URI in the .env file in /server

## 6. User Story

Below stories helpe the development process and demonstrate user workflow when using the app:

As Bobby,
> I want more log in and record that I own Alice 1x coffee.
> I can also upload photo as proof that I gave Alice 1x coffee - and then delete the favor owned to Alice.

As Alice,
> I also see what I owns other people, and other people who owns me things.

As James,
> I can  remove the favor that people owned me, without upload any photo.
> I can add a favor that Alice owned me, but I have to upload a photo as proof first.

As Kim,
> I'm an unregistered user, I can see the Leaderboard but cannot interact with it.
> I can also see the Request Board, with all requests and their rewards but no button to interact with any request.
> I can either Login with username/password or Register.

As Carol,
> I post a request to clean a fridge and add rewards (the request should show 1x coffee and 1x chocolate offered by Carol).
> I have a request to give me a lift home with a reward of 1x pizza. However as not needed anymore, I remove the reward of 1x Pizza and now the request has been deleted.

As Greg,
> I see Carol request, and add to the request ( the request will now show 1x coffee + 1x chocolate by Carol and 1x chocolate by Greg).

As Peter,
> I logged in and check out the Request Board
> I see Request detail & name of people offering rewards, I upload photo as proof and now see 2 people own me favor:
> Carol owns me 1x coffee + 1x chocolate, Greg owns me 1x chocolate.

## 7. What libraries are being used in the app and why?

- **React** - this is the library we need to access for frontend
- **React-DOM** - this is the library we need to access for frontend
- **React-Router-DOM** - for frontend
- **React-redux** - for frontend
- **Express** - this is used for the backend server
- **Mongoose** - helps create schemas and models for MongoDB
- **DotENV** - A package to be able to use our env file inside our application
- **UUID** - create random UUID for uploaded images to Amazon S3 bucket
- **passport** - user authentication
- **multer** - middleware to handle file upload
- **bcryptjs** - hashing user passwords
- **react-bootstrap** - Bootstrap compoenents built with React


## 8. Licence
All Rights are Reserved.