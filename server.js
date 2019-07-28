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

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res)=> {
  knex.select('email','hash').from('login')
    .where({'email' : req.body.email})
    .then(data =>{
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if(isValid){
        return knex.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(users => {
            res.json(users[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      }else{
        res.status(400).json('invalid credentials')
      }
    })
    .catch(err => res.status(400).json('invalid credentials'))
})

app.post('/register', (req, res)=> {
  const {name, email, password} = req.body;
  const hash = bcrypt.hashSync(password);

  knex.transaction(trx => {
    trx.insert({
      hash:hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(users => {
          res.json(users[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req,res)=>{
  const { id } = req.params;
  let found = false;

  knex.select('*').from('users').where({ id: id })
    .then(user=> {
      if(user.length){
        res.json(user[0]);
      }else{
        res.status(404).json('Not Found');
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req,res)=>{
  const { id } = req.body;
  knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('error occured'));
})

app.listen(3000, ()=>{
  console.log('app is running on port 3000');
})
