var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search', {});
});

router.get('/search', function(req, res) {
  var keywordsearchString = "";
  if(req.query.keywordsearchString){
    keywordsearchString = req.query.keywordsearchString;
  }
  if(req.query.keywordsearchString){
  /*talked to a few people on how to do this qurey bit, as i wasnt quite sure how to do it/*/
    client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso')"+")" +
    " where $t[string() contains text "+req.query.keywordsearchString+" ]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <li><a href='/document/view?doc={$p}'>{$p}</a></li>",
      function (error, result) {
        if(error){ console.error(error);}
        else {
          res.render('search', { content: result.result, keywordsearchString: req.query.keywordsearchString});
        }
      }
    );
  }else{
    res.render('search', { content: "", keywordsearchString: ""});
  }
});

router.get('/document/view', function(req, res) {
  if(req.query.doc){
    client.execute("XQUERY doc('Colenso/"+req.query.doc+"')",
      function (error, result) {
        if(error){ console.error(error);}
        else {
          res.render('view', { content: result.result, title: req.query.doc, download: "/document/download?doc="+req.query.doc });
        }
      }
    );
  } else {
    res.render('view', { content: req.query.doc });
  }
});

module.exports = router;
