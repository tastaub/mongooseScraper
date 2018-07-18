var express = require('express');
var router = express.Router();

const request = require('request')
const cheerio = require("cheerio");

// const Comment = require('../models/Comment.js')
const Article = require('../models/Article.js')

router.get('/scraper', (req,res) =>  {
  request('https://www.theringer.com/', (error, response, html) =>  {
    const $ = cheerio.load(html);
    $('div .c-entry-box--compact__body').each((i,elem) =>  {
      var article = {}
      var x = $(elem).children('h2').children('a')
      article.title = x.text()
      article.summary = $(elem).children('p').text()
      article.link = x.attr('href')
      
      if(article.title !== "" && article.summary !== "") {
        var newArticle = new Article(article)
        Article.create(newArticle)
          .then(dbArticle => res.json(dbArticle))
          .catch(err => res.json(err));
      }
    })
    res.redirect('/articles')
  })
})

router.get('/articles', (req,res) =>  {
  Article.find({})
    .then(data => {
      var hbsObject = {articles: data}
      console.log(hbsObject)
      // res.render('home', hbsObject)
    })
    .catch(err => res.json(err))
})



module.exports = router;
