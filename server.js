const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});

const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, bcrypt, knex) })

app.post('/register', (req,res) => { register.handleRegister(req, res, knex, bcrypt) })

app.get('/profile/:id', (req, res)=> { profile.handleProfileGet(req,res, knex)})

app.put('/image', (req, res)=> {image.handleImage(req,res, knex)})

app.post('/imageUrl', (req, res)=> {image.handleAPICall(req,res)})



app.listen(process.env.PORT || 3000, ()=>{
  console.log('app is running on port ${process.env.PORT}');
})
