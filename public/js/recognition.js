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

  recognition.onerror =  function(e){ recognition.start(); };
  recognition.onend = function(e){ recognition.start(); };

  // 音声結果を取得するコールバック
  recognition.onresult = function (e) {
    console.log(e.results);
    var data = {};
    var finalText = '';
    var interimText = '';
    data.results = e.results;

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

// ボタンアクションの定義
// document.querySelector('#btn2').onclick = function () {
//   if (nowRecognition) {
//     stop();
//     this.value = '音声認識を継続的に行う';
//     this.className = '';
//   } else {
//     start();
//     this.value = '音声認識を止める';
//     this.className = 'select';
//   }
// }
