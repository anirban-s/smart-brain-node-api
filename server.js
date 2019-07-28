const express = require('express');
const bodyParser = require('body-parser');
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

knex.select('*').from('users').then(data=>{
  console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id:'123',
      name: 'John',
      email: 'john@gmail.com',
      password: '123',
      entries: 0,
      joined: new Date()
    },
    {
      id:'124',
      name: 'Shally',
      email: 'shally@gmail.com',
      password: '124',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res)=> {
  if(req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password){
    res.json(database.users[0]);
  }
  else {
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res)=> {
  const {name, email, password} = req.body;
  knex('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(users => {
      res.json(users[0]);
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
