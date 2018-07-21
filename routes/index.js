var express = require('express');
var router = express.Router();

const request = require('request')
const cheerio = require("cheerio");

const Comments = require('../models/Comments.js')
const Article = require('../models/Article.js')

router.get('/scraper', (req,res) =>  {
  request('https://cleaningtheglass.com/articles/', (error, response, html) =>  { 
  const $ = cheerio.load(html);

    $('a.card.article').each((i,elem) =>  {
      var article = {}
      var x = $(elem)
      article.title = x.children('h2').contents().filter(function()  {
        return this.nodeType == 3
      })[0].nodeValue;
      article.summary = x.find('.article_description').text().trim();
      article.link = x.attr('href').trim()
      article.image = x.find('img').attr('src').trim()

      console.log(article);
      Article.create(article)
        .then((data) => console.log(data))
        .catch((err) => res.json(err))
    })
    res.redirect('/articles')
  })
})

router.get('/', (req,res) =>  {
  res.render('scrape')
})

router.get('/articles', (req,res) =>  {
  Article.find({}).sort({_id: 1}).limit(20)
    .populate('comments')
    .then(data => {
      var hbsObject = {articles: data}
      res.render('home', hbsObject)
    })
    .catch(err => res.json(err))
})


router.post("/articles/:id", function(req, res) {
  Comments.create(req.body)
    .then(comment => Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: comment }}, { new: true }))
    .then(() => res.redirect('/articles'))
    .catch(err => res.json(err))
});

router.get("/comments/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({_id: req.params.id})
    // ..and populate all of the notes associated with it
    .populate("comments")
    .then(function(article) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      let comments = article.comments
      var hbsObject = {message: comments}
      res.render('message', hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get('/favorite/:id', (req,res) =>  {
  Article.findByIdAndUpdate(req.params.id, { $set: { isFav: true}}, {new: true})
  .then(function(update)  {
    res.redirect('/articles')
  })
  .catch(function(err)  {
    res.json(err);
  })
})

router.get('/saved', (req,res) =>  {
  Article.find({isFav: true})
    .then(result => {
      var hbsObject = {saved: result}
      res.render('saved', hbsObject);
    })
    .catch(err => res.json(err))
})

router.get('/delete_all', (req,res) =>  {
  Article.deleteMany({}, response => res.redirect('/articles'))
})




module.exports = router;
