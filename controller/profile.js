

const  handleProfileGet = (req,res, knex)=>{
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
}

module.exports = {
  handleProfileGet: handleProfileGet
}
