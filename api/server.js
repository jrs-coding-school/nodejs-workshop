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
const distributor = require('./distributor')

async function changes() {
  const res = await fetch(
    `${process.env.DB}/_changes?feed=longpoll&since=now&include_docs=true`
  ).then(res => res.json())
  if (res.results.length > 0) {
    distributor(res.results[0].doc)
  }
  changes()
}
changes()

app.use(cors({ credentials: true, origin: 'http://localhost:5000' }))

// app.get('/csv', async (req, res) => {
//   // const src = request(process.env.DB + '/_all_docs?include_docs=true', {
//   //   json: true
//   // })
//   const src = pullFetch.json(process.env.DB + '/_all_docs?include_docs=true')
//   const sink = res
//
//   pull(src, stringify(), toPull.sink(sink))
//
//   //map(x => x + 1, [1,2,3,4,5])
//   //#> 2,3,4,5,6
// })

app.get('/movies', async (req, res) => {
  const data = await fetch(
    `${process.env.OMDB_API}&s=${req.query.s}`
  ).then(res => res.json())
  res.send(data)
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
