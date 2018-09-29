div = document.createElement('div');
setDivStyle(div);
var showMaxSpeeches = 10
var wholetext = ""

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "generate"){
      startRecognition();
    }

    if (request.action == "history") {
      console.log(wholetext)
    }

  });


  function startRecognition() {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "pt-BR";

    recognition.onresult = function(event) { 
      var sentence = makeASentence(event);
      makeClosedCaption(sentence)
    }
    recognition.start();
  }


  function makeASentence(event) {
    var partialSentence = ""
    var totalSentence = ""
    var newResults = []
    var results = event.results
    newResults = event.results

    for (i=0; i<results.length; i++) {
      if (results[i][0].confidence > 0.8 ) {
        totalSentence += results[i][0].transcript
      }
    }

    if (newResults.length > showMaxSpeeches) {
      var tempArray = Array.from(newResults)
      newResults = tempArray.slice(newResults.length - 2, newResults.length)
    }

    for (i=0; i<newResults.length; i++) {
      if (newResults[i][0].confidence > 0.8) {
        partialSentence += newResults[i][0].transcript
      }
    }

    wholetext = totalSentence
    return partialSentence
  }

  function makeClosedCaption(text) {
    div.textContent = text;
    document.body.appendChild(div);
  }

  function setDivStyle() {
    div.style.bottom = '50%';
    div.style.left = 0;
    div.style.textAlign = 'center';
    div.style.backgroundColor = 'rgba(0,0,0,0.8)';
    div.style.position = 'absolute';
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.fontSize = '30px';
    div.style.width = '50%';
    div.style.transform = 'translate(50%)';
    div.style.border = '2px solid white';
    div.style.borderRadius = "5px";
    div.style.zIndex= "10000";
    div.style.fontFamily = "Arial";
  }
