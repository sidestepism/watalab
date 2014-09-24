var socket = io('/');

var recognition;
var nowRecognition = false;

//確定した結果を表示する場所
var $finalSpan = document.querySelector('#final_span');

// 音声認識中の不確かな情報を表示する場所
var $interimSpan = document.querySelector('#interim_span');

// 音声認識開始のメソッド
function start () {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "ja_JP";

  // 以下2点がポイント！！
  // 継続的に処理を行い、不確かな情報も取得可能とする.
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onerror = function(e){ 
    console.log(e.error);

   };
  recognition.onend = function(e){
    console.log("end");
    recognition.start();
  };

  // 音声結果を取得するコールバック
  recognition.onresult = function (e) {
    console.log(e.results);
    var data = {};
    var finalText = '';
    var interimText = '';
    data.results = e.results;
    
    var txt;
    for(var i = 0; i < data.results.length; i++){
      txt += "<p>" + data.results[i][0].transcript + "</p>";
    }
    $("#results").html(txt);


    socket.emit('speech recognized', data);
  };
  recognition.start();
  nowRecognition = true;
};

// 音声認識を止めるメソッド
function stop () {
  recognition.stop();
  nowRecognition = false;
}

$(function() {
  start();
})

