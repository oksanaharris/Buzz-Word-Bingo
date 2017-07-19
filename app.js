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

  // destroy(buzzword){
  //   let found = false;
  //   buzzWords.forEach((wordObj, index, array) => {
  //     if (wordObj.buzzWord === buzzword){
  //       console.log('found a match:', wordObj.buzzWord, req.params.buzzword);
  //       array.splice(index, 1);
  //       found = true;
  //     }
  //   });
  //   return found;
  // }
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

  // add validation that it's not an existing word in our stored array
  // should not be able to post to an existing word

  let newWord = new BuzzWord(req.body.buzzWord, parseInt(req.body.points));
  newWord.save();
  console.log(buzzWords);
  res.send(JSON.stringify({ "success": true }));
});

app.put('/:buzzword', function (req, res) {
  console.log(req.body.heard);
  //validation if this leads to a valid word stored in our array?
  buzzWords.forEach((wordObj) => {
    console.log('running the forEach function');
    if(wordObj.buzzWord === req.body.buzzWord){
      //additional validation here if the buzzWord key-value passed in matches the url?
      console.log('wordObj.buzzWord', wordObj.buzzWord);
      console.log('req.body.buzzWord', req.body.buzzWord);
      console.log('that means its found a match');
      if(req.body.heard === 'true' || req.body.heard === true){
        // wordObj.heard = parseInt(wordObj.heard);
        wordObj.heard++;
        console.log('wordObj.heard', wordObj.heard);
        player1.score += wordObj.points;
        console.log('new score', player1.score);
      }
    }
  });
  console.log(buzzWords);
  res.send(JSON.stringify({ "success": true, "newScore": player1.score}));
  //how do you return false? how do you check if "success"?
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

  }
});