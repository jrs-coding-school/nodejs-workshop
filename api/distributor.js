const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'movie_favorites'
})
connection.connect()

module.exports = function(doc) {
  connection.query(
    `INSERT INTO favorites (id, title, year, poster) VALUES (?,?,?,?)`,
    [doc._id, doc.title, doc.year, doc.poster],
    function(error, results, fields) {
      if (error) console.log(error)
      //console.log('The solution is: ', results[0].solution)
    }
  )

  // handle connection close on
  // node close event...
}
