var socket;
var text = {
    text: ''
};

var note = -1;

function setup(){
    // socket = io.connect('131.153.18.105');
    socket = io.connect('localhost');
    $("#text").on("froalaEditor.keyup", function(){
        var html = $(this).froalaEditor('html.get');
        var data = {
            text: html
        };
        socket.emit('text', data);
    });
    $('#text').froalaEditor({
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo'],
        fullPage: true
    });

    socket.on('text', handleRecievedText);
    socket.on('newUser', updateText);
}

function updateText(data){
    var note_id = data["note_id"];
    var users = data["users"];
    var text = data["text"];

    if (note == -1) {
        note = note_id;
    }
    console.log("set note id to", note)

    var ip = socket.handshake.headers["x-real-ip"];
    var port = socket.handshake.headers["x-real-port"];
    console.log("addr"+ip)
    // console.log("data:",note_id, users, text, address);
    // text.text = data.text;
    // $("#text").froalaEditor('html.set', data.text);
    // var editor = $('#text').data('froala.editor');
    // editor.selection.setAtEnd(editor.$el.get(0));
    // editor.selection.restore();
}

function handleRecievedText(data){
    console.log(data);
    text.text = data.text;
    $("#text").froalaEditor('html.set', data.text);
    var editor = $('#text').data('froala.editor');
    editor.selection.setAtEnd(editor.$el.get(0));
    editor.selection.restore();
}


