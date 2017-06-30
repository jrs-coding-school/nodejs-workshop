process.env.NODE_ENV !== 'production' && require('dotenv').config()
const express = require('express')
const app = express()
const { pluck, split, compose, map, trim, concat } = require('ramda')

const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-find'))
const db = PouchDB(process.env.DB)
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('isomorphic-fetch')

app.use(cors({ credentials: true, origin: 'http://localhost:5000' }))

app.get('/movies', async (req, res) => {
  const fetchData = compose(
    map(s =>
      fetch(`${process.env.OMDB_API}&s=${s}`)
        .then(res => res.json())
        .then(res => res.Search)
    ),
    map(trim),
    split(',')
  )
  const data = await Promise.all(fetchData(req.query.s))
  res.send({ Response: 'True', Search: concat(...data) })
})

app.post('/favorites', bodyParser.json(), async (req, res) => {
  try {
    // TODO: joi doc validator
    // const validdoc = await joi(rules, req.body)
    const result = await db.post(req.body)
    const doc = await db.get(result.id)
    res.send(doc)
  } catch (err) {
    res.status(500).send({ ok: false, message: err.message })
  }
})

app.get('/favorites', async (req, res) => {
  console.log('foo bar baz')
  const data = await db.allDocs({ include_docs: true })
  res.send(pluck('doc', data.rows))
})

app.get('/', (req, res) => {
  res.send({ name: 'Movie Favorite API' })
})

app.listen(4000)
