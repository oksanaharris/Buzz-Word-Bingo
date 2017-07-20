var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var server = app.listen(3000, () => {
  console.log('Server listening.');
});


class BuzzWordArray {
  constructor (){
    this.buzzWords =[]
  }

  find(word){
    var found = false;
    this.buzzWords.forEach((wordObj, index, array) => {
      if (wordObj.buzzWord === word){
        console.log('found a match:', wordObj.buzzWord, word);
        console.log('find returning the wordObj', wordObj);
        found = wordObj;
      }
    });

    return found;
  }

  delete(buzzWord){
    console.log('running buzzword.delete()');
    console.log('parameter is ', buzzWord);
    let found = false;
    this.buzzWords.forEach((wordObj, index, array) => {
      if (wordObj.buzzWord === buzzWord){
        console.log('found a match:', wordObj.buzzWord, buzzWord);
        array.splice(index, 1);
        found = true;
      }
    });
    return found;
  }

  reset(){
    this.buzzWords = [];
  }
}


var buzzWords = new BuzzWordArray();


var player1 = {
  score: 0
}


class BuzzWord {
  constructor (buzzWord, points){
    this.buzzWord = buzzWord;
    this.points = points;
    this.heard = 0;
  }

  save() {
    buzzWords.buzzWords.push(this);
  }

  incrementHeard(){
    this.heard++;
  }
}


app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());


app.get('/buzzwords', function (req, res) {
  res.send(JSON.stringify({buzzWords}));
});


app.post('/buzzword', function (req, res) {
  console.log('REQUEST BODY');
  console.log(req.body);
  //not allowing to post to an existing word
  if (!buzzWords.find(req.body.buzzWord)){
    let newWord = new BuzzWord(req.body.buzzWord, parseInt(req.body.points));
    newWord.save();
    res.send(JSON.stringify({ "success": true }));
  } else {
    res.send(JSON.stringify({ "success": false, "error": 'tried to post to an existing word.'}));
  }
  console.log(buzzWords);
});


app.put('/:buzzword', function (req, res) {
  //not doing any validation to make sure buzzWord key value matches url entry - going off of url
  let wordInQuestion = buzzWords.find(req.params.buzzword);
  console.log('printing what find returns', wordInQuestion);
  if (wordInQuestion){
    if (req.body.heard === 'true' || req.body.heard === true){
      wordInQuestion.incrementHeard();
      player1.score += wordInQuestion.points;
      console.log('new score', player1.score);
      res.send(JSON.stringify({ "success": true, "newScore": player1.score}));
    } else {
      res.send(JSON.stringify({ "success": true, "anything happen?": "not really"}));
    }
  } else {
    res.send(JSON.stringify({ "success": false, "error": 'tried to edit a word that isn\'t in there.'}));
  }
  console.log(buzzWords);
});


app.delete('/:buzzword', function (req, res) {
  console.log('trying to delete', req.body.buzzWord, req.params.buzzword);
  if (buzzWords.delete(req.params.buzzword)) {
    console.log(buzzWords);
    res.send(JSON.stringify({ "success": true }));
  } else {
    res.send(JSON.stringify({ "success": false, "error": 'tried to delete a word that isn\'t in there.'}));
    console.log('did not find');
    console.log(buzzWords);
  }
});


app.post('/reset', function (req, res) {
  if (req.body.reset === 'true' || req.body.reset === true){
    buzzWords.reset();
    player1.score = 0;
    res.send(JSON.stringify({ "success": true }));
  } else {
    res.send(JSON.stringify({ "success": true, "anything happen?": "not really"}));
  }
  console.log(buzzWords);
  console.log(player1);
});