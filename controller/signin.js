

const handleSignin = (req, res, bcrypt, knex)=> {
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json('invalid input');
  }
  knex.select('email','hash').from('login')
    .where({'email' : email})
    .then(data =>{
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if(isValid){
        return knex.select('*').from('users')
          .where('email', '=', email)
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
