const express = require('express')
const router = express.Router()
const URLdata = require('../../models/urldata')

router.use(express.urlencoded({ extended: true }))

router.post('/', (req, res) => {
  const getRandomCharacter = require('../../models/seeds/urlseeder')

  URLdata.find({})
    .select('originalURL')
    .then((field) => {
      // the augument "field" is an array like this: 
      // [{
      //    _id: new ObjectId("61beb08c76b774c53405d90a"),
      //    originalURL: 'https://www.google.com'
      // }]
      const dataArray = []

      field.forEach((object) => { return dataArray.push(object.originalURL) })

      if (!dataArray.some((element) => { return element === req.body.originalURL })) {
        URLdata.create({
          originalURL: req.body.originalURL,
          radomCharacter: getRandomCharacter,
          transformedURL: `http://urlshortener/${getRandomCharacter}`
        })
          .catch((error) => { console.log(error) })
      }
    })

  URLdata.findOne({ originalURL: req.body.originalURL })
    .lean()
    .then((selectedDocument) => {
      res.render('submit', { transformedURL: selectedDocument.transformedURL, originalURL: selectedDocument.originalURL })
    })
})

module.exports = router