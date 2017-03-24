const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const AppController = require('./lib/controllers/app-controller')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.post('/api/foods', AppController.create)

app.put('/api/foods/:name', AppController.update)

app.delete('/api/foods/:id', AppController.deleteEntry)

app.get('/api/foods/:id', AppController.getAll)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app