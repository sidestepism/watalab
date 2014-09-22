// 音声認識機能
var recognition;
var nowRecognition = false;

// 確定した結果を表示する場所
var $finalSpan = document.querySelector('#final_span');

// 音声認識中の不確かな情報を表示する場所
var $interimSpan = document.querySelector('#interim_span');

// 音声認識開始のメソッド
function start () {

    // 以下2点がポイント！！
    // 継続的に処理を行い、不確かな情報も取得可能とする.
    recognition.continuous = true;
    recognition.interimResults = true;
    // 音声結果を取得するコールバック
    $interimSpan.textContent = ""
    $finalSpan.textContent = ""
    recognition.onresult = function (e) {
        console.log(e);
        var finalText = '';
        var interimText = '';
        for (var i = 0; i < e.results.length; i++) {
            // isFinalがtrueの場合は確定した内容
            // 仕様書では「final」という変数名だが、Chromeでは「isFinal」のようです.
            if (e.results[i].isFinal) {
                finalText += e.results[i][0].transcript;
            } else {
                interimText += e.results[i][0].transcript;
            }
        }
        $interimSpan.textContent = interimText;
        $finalSpan.textContent = finalText;
    };
    recognition.start();
    console.log("loading");
    nowRecognition = true;
};

// 音声認識を止めるメソッド
function stop () {
    recognition.stop();
    nowRecognition = false;
}

$(function() {
    // unsupported.
    if (!'webkitSpeechRecognition' in window) {
        alert('Web Speech API には未対応です.');
        return;
    }

    start();
})