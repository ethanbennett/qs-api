const assert = require('chai').assert
const app = require('../server')
const request = require('request')

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
    beforeEach(() => {
      app.locals.foods = {
        "apple": 10
      }
    })

    it('should delete a food', (done) => {
      this.request.delete('/api/foods/apple', (error, response) => {
        if (error) { done(error) }
        const secretCount = Object.keys(app.locals.foods).length
        assert.equal(secretCount, 0)
        assert.equal(response.statusCode, 200)
        done()
      })
    })
  })

  describe('POST /api/foods', () => {
    beforeEach(() => {
      app.locals.foods = {}
    })

    it('should not return a 404', (done) => {
      this.request.post('/api/foods', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('should receive and store data', (done) => {
      const food = { name: 'pineapple', calories: 10 }
      this.request.post('/api/foods', { form: food }, (error, response) => {
        if (error) { done(error) }
        const secretCount = Object.keys(app.locals.foods).length
        assert.equal(secretCount, 1)
        done()
      })
    })
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
    beforeEach(() => {
      app.locals.foods = {
        "apple": 10
      }
    })

    it('should return a 404 if resource is not found', (done) => {
      this.request.get('/api/foods/2', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        assert.include(response.body, 'Not Found')
        done()
      })
    })

    it('should return the name and calories if the resource is found', (done) => {
      this.request.get('/api/foods/apple', (error, response) => {
        if (error) { done(error) }
        assert.include(response.body, 'apple')
        assert.include(response.body, 10)
        assert.include(response.body, 'name')
        assert.include(response.body, 'calories')
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