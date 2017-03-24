const assert = require('chai').assert
const app = require('../server')
const request = require('request')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe ('Server', () => {
  before(done => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { done(err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  it('should exist', () => {
    assert(app)
  })

  describe('DELETE /api/foods/:name', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (food_name, calories , created_at) VALUES (?, ?, ?)',
        ["bananas", "90", new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('should delete a food', (done) => {
      this.request.delete('/api/foods/1', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        database.raw(`SELECT * FROM FOODS`
          ).then((foods) => {
          assert.equal(foods.rows.length, 1)
          done()
        })
      })
    })
  })

  describe('POST /api/foods', () => {
    beforeEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY'
      ).then(() => done());
    })

    it('should not return a 404', (done) => {
      this.request.post('/api/foods', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    // xit('should receive and store data', (done) => {
    //   const foodie = {food: { food_name: 'pineapple', calories: 10 }}
    //   this.request.post('/api/foods', { form: foodie }, (error, response) => {
    //     if (error) { done(error) }
    //     // console.log(food)
    //     console.log(database)
    //     const secretCount = Object.keys(app.locals.foods).length
    //     assert.equal(secretCount, 1)
    //     done()
    //   })
    // })
  })

  describe('PUT /api/foods/:name', () => {
    beforeEach(() => {
      app.locals.foods = {
        "apple": 10
      }
    })

    it('should properly edit an apple', (done) => {
      const food = { name: 'pinecone', calories: '10' }
      this.request.put('/api/foods/apple', { json: food }, (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 201)
        assert.include(JSON.stringify(response.body), 'pinecone')
        assert.include(JSON.stringify(response.body), '10')
        assert.notInclude(JSON.stringify(response.body), 'apple')
        done()
      })
    })
  })

  describe('GET /api/foods/:name', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (food_name, calories , created_at) VALUES (?, ?, ?)',
        ["bananas", "90", new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('should return 404 if resource is not found', (done) => {
      this.request.get('/api/foods/5', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should return the id and message from the resource found', (done) => {
      this.request.get('/api/foods/1', (error, response) => {
        if (error) { done(error) }

        const id = 1
        const food = "bananas"

        let parsedFood = JSON.parse(response.body)

        assert.equal(parsedFood.id, id)
        assert.equal(parsedFood.food_name, food)
        assert.ok(parsedFood.created_at)
        done()
      })
    })
  })

  describe ('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should return the app title', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error) }
        assert.include(response.body, app.locals.title)
        done()
      })
    })
  })
})