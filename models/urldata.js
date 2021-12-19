const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  originalURL: {
    type: String,
    require: true
  },
  radomCharacter: {
    type: String,
    require: true
  },
  transformedURL: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('URLdata', urlSchema)