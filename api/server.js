process.env.NODE_ENV !== 'production' && require('dotenv').config()
const express = require('express')
const app = express()
const { pluck } = require('ramda')

const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-find'))
const db = PouchDB(process.env.DB)

const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors({ credentials: true, origin: 'http://localhost:5000' }))

app.post('/favorites', bodyParser.json(), async (req, res) => {
  try {
    const result = await db.post(req.body)
    const doc = await db.get(result.id)
    res.send(doc)
  } catch (err) {
    res.status(500).send({ ok: false, message: err.message })
  }
})

app.get('/favorites', async (req, res) => {
  const data = await db.allDocs({ include_docs: true })
  res.send(pluck('doc', data.rows))
})

app.get('/', (req, res) => {
  res.send({ name: 'Movie Favorite API' })
})

app.listen(4000)
