// creo my pseudo base de datos
//ahora en un jsonfile //that in p5.js, but we are in node
//var words = loadJSON('words.json');

// funcion de node file sistem, para poder leer archivos
var fs = require('fs');
var data = fs.readFileSync('aditional.json'); //lo paso a data en bruto
var afineData = fs.readFileSync('afine.json');

var afinn = JSON.parse(afineData);
var aditional = JSON.parse(data); //y luego lo formateo a jsonfile
console.log(aditional);
console.log("Starting Server...");
// DECLARA EXPRESS
var express = require('express');
var bodyParser = require('body-parser');

// INICIO EL OBJETO EXPRESS
var app = express();

//var hostname = 'test';
var port = 3000;
// INICIA EL SERVIDOR (PUERTO , FUNCION(OPCIONAL))
var server = app.listen(port, listening);

function listening() {
  console.log("listening on port: " + port);
}

//declaro un directorio para servir
app.use(express.static('website'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// routes
//post routes
app.post('/analyze', analyzeThis);

function analyzeThis(request, response){
  var txt = request.body.text;

  var words = txt.split(/\W+/);
  //console.log(words);
  var totalScore = 0;
  var wordlist = [];
  for (var i = 0; i < words.length; i++){
    var word = words[i];
    var score;
    var found = false;
    if(aditional.hasOwnProperty(word)){
      score = Number(aditional[word]);
      found = true;
    }else if(afinn.hasOwnProperty(word)){
      score = Number(afinn[word]);
      found = true;
    }
    if(found){
      wordlist.push({
        word: word,
        score: score
      });
    }
    totalScore += score;

  }
  var comparative = totalScore / words.length;

  console.log(request.body);
  var reply = {
    score: totalScore,
    comparative: comparative,
    words: wordlist
  }
  response.send(reply);
}



//get routes
//route 1
app.get('/search/:word', sendSearch);

function sendSearch(request, response){
  var tword = request.params.word;
  var reply;
  if(aditional[tword]){
    var num = aditional[tword];
    reply = {
      status: "Found ",
      aword: tword,
      number: num
    }
  }else{
    reply = {
      status: "not found",
      msg: "the word " + tword + " no exist in the database."
    }
  }
  response.send(reply);
}

//route 2 muestro mi diccionario completo
app.get('/all', showAll);

function showAll(request, response){
  var data = {
    aditional: aditional ,
    afinn: afinn
  }

  response.send(data);
}

// route 3, add items to database llamando a la funcion addWord
app.get('/add/:word/:num?', addWord);

function addWord(request, response){
  // accedo a los datos pedidos(request) y los guardo en data
  var data = request.params;
  var tword = data.word;
  // el dato que se guarda en num me aseguro que es un numero
  var num = Number(data.num);
  var reply; // declaro mi respuesta

  if(!num){ // si no se ha introducido numero le obligo aq que lo haga
    reply = {
      msg: "number is required."
    }

  response.send(reply);

  }else { // si todo esta bien, añado la palabra nueva a la base de datos con su nuemro coreespondiendte
    aditional[tword] = num;
    // formateamos los datos antes de agregarlo a nuestro json file
    //var data = JSON.stringify(words) //asi lo agrega en unsa sola linea y sin formato (orras espacio)
    var data = JSON.stringify(aditional, null, 2);
    fs.writeFile('aditional.json', data, finished);
      function finished(err){
        console.log('all set.');
        reply = {
          word: tword,
          number: num,
          status: "succes"
        }
        response.send(reply);
      }

  }
}
