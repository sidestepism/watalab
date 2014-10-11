var socket = io('/');

var recognition;
var nowRecognition = false;

var startDate = +new Date();
var recognitionRestartCount = 0;
var retryCount = 0;

// 確定した結果を表示する場所
var $finalSpan = document.querySelector('#final_span');
// 音声認識中の不確かな情報を表示する場所
var $interimSpan = document.querySelector('#interim_span');

var sendingDelay = 200;
var restartCount = 0;

// 音声認識開始のメソッド
function start() {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "ja_JP";

    // 以下2点がポイント！！
    // 継続的に処理を行い、不確かな情報も取得可能とする.
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onerror = function(e) {
        retryCount++
        console.log(e.error);
        $("#debug").text($("#debug").text() + " " + e.error);
    };
    recognition.onend = function(e) {
        console.log("end");
        if (retryCount) {
            var retryDelay = Math.floor(100 * Math.pow(1.5, retryCount));
            console.log("ERROR RETRY: ", retryDelay, "ms")
            setTimeout(function() {
                $("#debug").text($("#debug").text() + " " + "reconnect");
                recognition.start();
            }, retryDelay)
        } else {
            $("#debug").text($("#debug").text() + " " + "reconnect");
            recognition.start();
        }
    };

    var latestData = {};
    var heartBeatTimer = null;

    recognition.onstart = function() {
        restartCount++;
    }
    // 音声結果を取得するコールバック
    recognition.onresult = function(e) {
        retryCount = 0;
        console.log(e.results);
        var data = {};
        var finalText = '';
        var interimText = '';
        data.results = e.results;

        var txt = "";
        for (var i = 0; i < data.results.length; i++) {
            var res = data.results[i];
            txt += "<p>" + res[0].transcript + "</p>";
        }
        console.log("recognition result", txt);
        $("#results").html(txt);

        socket.emit('speech recognized', data);

        // タイマーがあればタイマーをクリアする
        if (heartBeatTimer) {
            clearInterval(heartBeatTimer);
        }
        // クロージャにdataをわたし，何もなくても5秒に1度recognitionデータを送信する．
        heartBeatTimer = setInterval(function(latestData) {
            return function() {
                console.log('idle timer');
                socket.emit('speech recognized', latestData);
                // もしくは? 毎回リロード
                if (restartCount > 10 || (+new Date()) - startDate > 1000 * 60) {
                    location.reload();
                    console.log("reload!");
                } else {
                    console.log("elapsed time", (+new Date()) - startDate);
                }

            }
        }(data), 5000)

    };
    recognition.start();
    nowRecognition = true;
};

// 音声認識を止めるメソッド
function stop() {
    recognition.stop();
    nowRecognition = false;
}


$(function() {
    start();
    $("#self_recognition").submit(function() {

        var content = $("#self_recognition_text").val()
        console.log("self_recognition", content);
        socket.emit('speech recognized', {
            results: [{
                isFinal: true,
                0: {
                    transcript: "わたしはりんごがきらい"
                }
            }]
        });
        $("#self_recognition_text").val("");        
    });
})