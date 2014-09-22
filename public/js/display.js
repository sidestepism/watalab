var socket = io('/');
var recognizer_max_speech_ids = [];

socket.on('recognition result', function(data) {
    var $recognition_result = document.querySelector('#recognition_result');

    if (!data.recognizer_id) console.error('recognizer_id not found');

    if (recognizer_max_speech_ids[data.recognizer_id]) {
        console.log('new recognizer detected', data.recognizer_id);
        recognizer_max_speech_ids[data.recognizer_id] = 0;
    }

    for (var i = 0; i < data.results.length; i++) {
        // 結果
        var res = data.results[i];
        // 認識器のID
        var r_id = data.recognizer_id;

        if (recognizer_max_speech_ids[r_id] < i) {
            // 新しい文がきたっぽいからDOMをつくろう
            // 中身はこんなかんじ
            // 
            // <div class="fragment" id="fragment_01234">
            // <span class="final"></span><span class="interim"></span>
            // </div>
            
            var newItem = document.createElement('div');
            newItem.class = "fragment";
            newItem.id = "fragment_" + r_id;
            $recognition_result.appendChild(newItem);

            var $finalSpan = document.createElement('span');
            $finalSpan.class = "final";
            var $interimSpan = document.createElement('span');
            $interimSpan.class = "interim";

            newItem.appendChild($finalSpan);
            newItem.appendChild($interimSpan);

            // いまんとこの最大の speech id を覚えておこう
            recognizer_max_speech_ids[r_id] = i;
        }
        var interim = "";
        var final = "";
        if (res.isFinal) {
            final += res.transcript;
        } else {
            interim += res.transcript;
        }

        $("#fragment_" + r_id + " .final").text(final);
        $("#fragment_" + r_id + " .interim").text(interim);
    };
});