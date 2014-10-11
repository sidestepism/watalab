var socket = io('/');
var recognizer_max_speech_ids = [];

socket.on('reset', function() {
    $(".fragment").hide();
})

socket.on('recognition result', function(data) {
    var $recognition_result = document.querySelector('#recognition_result');

    var recog
    console.log(data)

    if (!data.recognizer_id) {
        console.error('recognizer_id not found');
    }

    var r_id = data.recognizer_id;

    if (!recognizer_max_speech_ids.hasOwnProperty(r_id)) {
        console.log('new recognizer detected', r_id);
        recognizer_max_speech_ids[r_id] = -1;
    }

    for (var i = 0; i < data.results.length; i++) {
        // 結果
        var res = data.results[i];

        var dom_id = "fragment_" + r_id + "_" + i;

        if (recognizer_max_speech_ids[r_id] < i) {
            // 新しい文がきたっぽいからDOMをつくろう
            // 中身はこんなかんじ
            // 
            // <div class="fragment" id="fragment_01234">
            // <span class="final"></span><span class="interim"></span>
            // </div>

            console.log('make dom');
            var newItem = document.createElement('div');
            newItem.className = "fragment";
            newItem.id = dom_id;
            $recognition_result.appendChild(newItem);

            var $finalSpan = document.createElement('span');
            $finalSpan.className = "final";

            var $interimSpan = document.createElement('span');
            $interimSpan.className = "interim";

            newItem.appendChild($finalSpan);
            newItem.appendChild($interimSpan);

            // いまんとこの最大の speech id を覚えておこう
            recognizer_max_speech_ids[r_id] = i;
        }

        var interim = "";
        var final = "";
        console.log(res[0].transcript)
        if (res.isFinal) {
            final += res[0].transcript;
        } else {
            interim += res[0].transcript;
        }

        $("#" + dom_id + " .final").text(final);
        $("#" + dom_id + " .interim").text(interim);
    };
    $('html,body').animate({
        scrollTop: $("#bottom").offset().top
    }, 500);

});