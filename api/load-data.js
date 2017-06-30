require('dotenv').config()

const fs = require('fs')
const path = require('path')
const util = require('util')

const PouchDB = require('pouchdb-http')
const db = PouchDB(process.env.DB)

const readFileP = util.promisify(fs.readFile)

async function read() {
  const data = await readFileP(path.resolve(__dirname + '/../db.json'), 'utf-8')
  const docs = JSON.parse(data).favorites
  return await db.bulkDocs(docs)
}

read().then(res => console.log(res), err => console.log(err))
