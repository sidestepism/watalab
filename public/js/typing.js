var socket = io('/');
var results = []

function type(content) {
    results.push({
        isFinal: true,
        0: {
            transcript: content
        }
    });
    socket.emit('speech recognized', {
        results: results
    });
}
function say(content) {
    socket.emit('please say', {
        content: content
    });
}



$(function() {
    $("#self_recognition").submit(function() {
        var content = $("#self_recognition_text").val()
        console.log("self_recognition", content);
        results.push({
            isFinal: true,
            0: {
                transcript: content
            }
        });
        socket.emit('speech recognized', {
            results: results
        });
        $("#self_recognition_text").val("");
    });
    $("#reset_button").click(function() {
        socket.emit('reset request');
    })
})