const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'
app.locals.foods = {
  'apple': 400
}
app.use(bodyParser.json())

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.post('/api/foods', (request, response) => {
  const name = request.params.name
  const calories = request.params.calories
  app.locals.foods[name] = calories
  response.status(201).json({
    name, calories
  })
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

app.get('/api/foods/:name', (request, response) => {
  const name = request.params.name
  const calories = app.locals.foods[name]

  if (!calories) {
    return response.sendStatus(404)
  }
  response.json({
    name, calories
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app