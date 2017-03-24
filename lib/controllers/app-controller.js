const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

function create(request, response){
  const name = request.body.food.food_name
  const calories = request.body.food.calories
  database.raw(
    'INSERT INTO foods (food_name, calories , created_at) VALUES (?, ?, ?)',
    [name, calories, new Date]
  ).then((data) => { 
    response.status(200).json(data.rows[0])
  }).catch((error) => console.error(error))
}

function update(request, response) {
  const newName = request.body.name
  const name = request.params.name
  const calories = request.body.calories
  database.raw("UPDATE foods SET food_name=?, calories=? WHERE food_name=?", [newName, calories, name])
  .then((data) => {
    response.status(200).json(data)
  }).catch((error) => console.error(error))
}

function deleteEntry(request, response) {
  const id = request.params.id
  database.raw("DELETE FROM foods WHERE id = ?", [id]
  ).then((data) => {
    response.sendStatus(200)
  }).catch((error) => console.error(error))
}

function getAll(request, response) {
  const name = request.params.id
  database.raw("SELECT * FROM foods WHERE id=?", [name])
  .then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    response.status(200).json(data.rows[0])
  })
}

module.exports = {
  create: create,
  update: update,
  deleteEntry: deleteEntry,
  getAll: getAll
}