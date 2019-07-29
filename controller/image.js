const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '496072ef859148188eb41c5faefdd9e8'
});

const handleAPICall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
        res.json(data)
      })
    .catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (req,res, knex)=>{
  const { id } = req.body;
  knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('error occured'));
}

module.exports = {
  handleImage:handleImage,
  handleAPICall: handleAPICall
}
