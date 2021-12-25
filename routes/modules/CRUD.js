const express = require('express')
const router = express.Router()
const URLdata = require('../../models/urldata')

router.use(express.urlencoded({ extended: true }))

router.post('/', (req, res) => {
  const getRandomCharacter = require('../../models/seeds/urlseeder')

  URLdata.find({}, 'originalURL') //抓全部「且」field名為originalURL的資料出來
    // add new URL info into Mongodb
    .then((field) => {
      // the augument "field" is an array like this: 
      // [{
      //    _id: new ObjectId("61beb08c76b774c53405d90a"),
      //    originalURL: 'https://www.google.com'
      // }]
      const dataArray = []

      field.forEach((object) => { return dataArray.push(object.originalURL) })

      if (!dataArray.some((element) => { return element === req.body.originalURL })) {
        return URLdata.create({
          originalURL: req.body.originalURL,
          randomCharacter: getRandomCharacter,
          transformedURL: `http://localhost:3000/urlshortener/${getRandomCharacter}`
        })
          // Render the page "submit"
          .then(() => {
            URLdata.findOne({ originalURL: req.body.originalURL })
              .lean()
              .then((selectedDocument) => {
                console.log(selectedDocument)
                return res.render('submit', { transformedURL: selectedDocument.transformedURL, randomCharacter: selectedDocument.randomCharacter })
              })
          })
          .catch((error) => { console.log(error) })
      }
    })
})

// 轉址
router.get('/:randomChar', (req, res) => {
  const randomChar = req.params.randomChar
  URLdata.findOne({ randomCharacter: randomChar })
    .then((data) => {
      if (data) {
        return res.redirect(data.originalURL)
      }
    })
    .catch((error) => { console.log(error) })
})

module.exports = router