const db = require('../../config/mongoose')
const URLdata = require('../urldata')
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowerCaseAlphabet = alphabet.toLowerCase()
const number = '0123456789'
const characterArray = alphabet.split('').concat(lowerCaseAlphabet.split('').concat(number.split('')))


function getRandomCharacter(array) {
  let literal = ''
  for (let i = 0; i < 5; i++) {
    const index = Math.floor(Math.random() * array.length)
    literal += array[index]
  }
  return literal
}

db.once('open', () => {
  const generateCharacter = getRandomCharacter(characterArray)
  
  URLdata.create({
    originalURL: 'https://www.google.com',
    randomCharacter: generateCharacter,
    transformedURL: `http://localhost:3000/urlshortener/${generateCharacter}`
  })
  console.log('done.')
})

module.exports = getRandomCharacter(characterArray)