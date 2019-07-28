

const handleSignin = (req, res, bcrypt, knex)=> {
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
}

module.exports = {
  handleSignin: handleSignin
}
