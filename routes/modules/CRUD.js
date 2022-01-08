const express = require('express')
const router = express.Router()
const URLdata = require('../../models/urldata')
// const urlExist = require('url-exist')  之後實作「檢查URL有效性」時使用

router.use(express.urlencoded({ extended: true }))

router.post('/', (req, res) => {
  const toGetRandomChar = require('../../models/seeds/urlseeder')

  URLdata.find({})
    .lean()
    .then((dbArray) => {
      // if Mongodb had had the inputed originalURL data, render it on "submit" page.
      const foundData = dbArray.find((eachElement) => { return eachElement.originalURL === req.body.originalURL })
      if (foundData) {
        return res.render('submit', { transformedURL: foundData.transformedURL, randomCharacter: foundData.randomCharacter })
      }
      // if Mongodb did not involve the inputed originalURL data, check the randomCharacter to keep it from repeat, then create the new data. (use the infinite loop to make sure the randomCharacter will not repeat)
      let randomChar = toGetRandomChar.generateCharacter(toGetRandomChar.characterArray) //urlseeder.js exported the object which involved an array & a function. That's why using object method here.
      while (dbArray.some((eachElement) => { return eachElement.randomCharacter === randomChar })) {
        randomChar = toGetRandomChar.generateCharacter(toGetRandomChar.characterArray)
      }
      const newData = URLdata.create({
        originalURL: req.body.originalURL,
        randomCharacter: randomChar,
        transformedURL: `http://localhost:3000/${randomChar}`
      })
      return newData
    })
    .then((gotData) => {
      if (gotData) {
        return res.render('submit', { transformedURL: gotData.transformedURL, randomCharacter: gotData.randomCharacter })
      }
    })
    .catch(() => { res.sendStatus(404) })
})

// 轉址
router.get('/:randomChar', (req, res) => {
  const randomChar = req.params.randomChar
  URLdata.findOne({ randomCharacter: randomChar })
    .then((data) => {
      if (data) {
        return res.status(301).redirect(data.originalURL)
      }
    })
    .catch(() => { res.sendStatus(404) })
})

module.exports = router