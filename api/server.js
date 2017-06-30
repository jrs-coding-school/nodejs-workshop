const express = require('express')
const app = express()

const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-find'))

app.get('/', (req, res) => {
  res.send({ name: 'Movie Favorite API' })
})

app.listen(4000)
