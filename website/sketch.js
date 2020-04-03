
function setup() {
  createCanvas(400, 400);
  drawData();
  console.log('runing');

  var button = select('#submit');//accedo al botom submit de mi index .html
  button.mousePressed(submitWord); //cuando el raton lo pulta llamo la funcion
  var buttonA = select('#analyze');//accedo al botom submit de mi index .html
  buttonA.mousePressed(analyzeThis);//cuando el boton analizar se pulsa llamo a la funcion analice this
}

function analyzeThis(){
  // Guardo en txt el contenido de <textarea>
  var txt = select('#textinput').value();
  //lo transforomo en un objeto para enviarlo
  var data = {
    text: txt
  }
  //llamo la funcion httpPost('route(definida pormi)', datos a enviar, formato, funcion posted, funcion error)
  httpPost('analyze/', data,'json',dataPosted, postErr);
}

function dataPosted(result){
  console.log(result);
}

function postErr(err){
  console.log(err);
}
//funcion para reescribir los datos
function drawData(){
  loadJSON('/all', gotdata);
}

function submitWord(){
  var word = select('#word').value();
  var number = select('#score').value();
  console. log(word, number);

  loadJSON('add/'+ word + '/' + number, finished);

  function finished(data) {
    console.log(data);
  //  drawData();
  }
}

function gotdata(data){
  background(80);
  //console.log(data);
  //var keys0 = Object.keys(data.aditional);
  var keys1 = Object.keys(data.afinn);
//  console.log(data.aditional);
  var keys = keys1;
  var adit1 = data.afinn;
  for (var i = 0; i < keys.length; i++){
    var word = keys[i];
    var score;
    var found = false;

    if(data.afinn.hasOwnProperty(word)){
        score = Number(adit1[word]);
        found = true;
      }
      if(found && score ==3){
        fill(150);
        textSize(20);
        var x = random(5,width-20);
        var y = random(5, height-5);
        text(word, x, y);

        var reply = {
          found: found,
          score: score,
          word: word
        }
        console.log(reply);
      }
  }
console.log(keys);
}
