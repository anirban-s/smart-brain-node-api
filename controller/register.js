

const handleRegister = (req, res, knex, bcrypt)=> {
  const {name, email, password} = req.body;
  if(!name || !email || ! password){
    return res.status(400).json('incorrect validation');
  }
  
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
}

module.exports = {
  handleRegister : handleRegister
}
