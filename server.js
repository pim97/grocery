var express = require('express');
var socket = require('socket.io', {secure: true});
var app = express();
var server = app.listen(80);
app.use(express.static('public'));
console.log('Server listening on port 80');
var io = require("socket.io")(server);


var notes = []

var text = {
    text: ''
};

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  app.get('/note/:id', function(req, res) {
      
    io.sockets.on('connection', function (socket) {
        // console.log('Socket succesfully connected with id: '+socket.id);
        connection(socket, req.params.id);
    }); 

    // console.log(req.params.id)
    res.sendFile('/public/index.html' , {root : __dirname});
})

  

function connection(socket, note_id){

    //Getting the index of the note
    var notesIndex = notes.findIndex(x => x.note_id = note_id);

    //If not doesnt exist, then register one with a note id and an empty array of users
    if (notesIndex == -1) {
        notes.push({
            'note_id' : note_id,
            'users_id' : []
        })
    }

    // Add the connected user to a note if exists
    if (notesIndex > -1) {
        var userIndex = notes[notesIndex]['users_id'].findIndex(x => x == socket.id);
        if (userIndex == -1) {
            notes[notesIndex]['users_id'].push(socket.id);
        }

        socket.emit('newUser', {"text" : text, "note_id" : note_id, "users" : notes[notesIndex]['users_id']});
    }


    // socket.on('text', handleTextSent);

    // function handleTextSent(data){
    //     text.text = data.text
    //     io.sockets.emit('text', data);
    // }
}

