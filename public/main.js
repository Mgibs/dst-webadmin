var socket = io();

socket.on('err', function (funName, e) {
    console.error(funName, e);
});

function updateStatus(started) {
    $('#status').text(started ? 'started' : 'stopped');
}

function addLog(time, type, msg) {
    var log = $('#log');
    log.append('<div class="' + type + '">' + msg + '</div>');
    $('#logCont').scrollTop(log.height());
}

$(function () {
    socket.emit('isStarted', function (started) {
        updateStatus(started);
        if (!started) {
            socket.emit('start');
        }
    });
    socket.emit('getLog', function (log) {
        for (var lineI in log) {
            var line = log[lineI];
            addLog(line.time, line.type, line.msg);
        }
    });

    socket.on('started', function () {
        updateStatus(true);
    });
    socket.on('stopped', function () {
        updateStatus(false);
    });

    socket.on('stdout', function(msg) { addLog(new Date(), 'stdout', msg); });
    socket.on('stdin', function(msg) { addLog(new Date(), 'stdin', msg); });
    socket.on('stderr', function(msg) { addLog(new Date(), 'stderr', msg); });
    socket.on('logReset', function() { $('#log').empty(); });
});
