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
  console.log(name)
  console.log(calories)
  database.raw(
    'INSERT INTO foods (food_name, calories , created_at) VALUES (?, ?, ?)',
    [name, calories, new Date]
  ).then((data) => { 
    console.log(data)
    response.sendStatus(200)
  }).catch((error) => console.error(error))
  
})

app.put('/api/foods/:name', (request, response) => {
  const newName = request.body.name
  const name = request.params.name
  const calories = request.body.calories
  app.locals.foods[newName] = calories
  delete app.locals.foods[name]
  response.status(201).json({
    newName, calories
})
})

app.delete('/api/foods/:name', (request, response) => {
  const name = request.params.name
  delete app.locals.foods[name]
  return response.sendStatus(200)
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