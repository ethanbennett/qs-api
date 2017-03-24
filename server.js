const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.post('/api/foods', (request, response) => {
  const name = request.body.food.food_name
  const calories = request.body.food.calories
  database.raw(
    'INSERT INTO foods (food_name, calories , created_at) VALUES (?, ?, ?)',
    [name, calories, new Date]
  ).then((data) => { 
    response.status(200).json(data.rows[0])
  }).catch((error) => console.error(error))
})

app.put('/api/foods/:name', (request, response) => {
  const newName = request.body.name
  const name = request.params.name
  const calories = request.body.calories

  database.raw("UPDATE foods SET food_name=?, calories=? WHERE food_name=?", [newName, calories, name])
  .then((data) => {
    response.status(200).json(data)
  }).catch((error) => console.error(error))
})

app.delete('/api/foods/:id', (request, response) => {
  const id = request.params.id
  database.raw("DELETE FROM foods WHERE id = ?", [id]
  ).then((data) => {
    response.sendStatus(200)
  }).catch((error) => console.error(error))
})

app.get('/api/foods/:id', (request, response) => {
  const name = request.params.id
  database.raw("SELECT * FROM foods WHERE id=?", [name])
  .then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    response.status(200).json(data.rows[0])
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app