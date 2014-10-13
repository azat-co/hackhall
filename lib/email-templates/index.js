var fs = require('fs')
var path = require('path')

module.exports = {
  newApplication: fs.readFileSync(path.join(__dirname, 'newApplication-inline.jade'), 'utf-8'),
  notifyAppoved: fs.readFileSync(path.join(__dirname, 'newApplication.html'))
}