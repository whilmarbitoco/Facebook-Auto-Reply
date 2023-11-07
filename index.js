const fs = require("fs");
const login = require("fca-unofficial");
const express = require('express');
const app = express();
const port = 3000; 


app.get('/', (req, res) => {
  res.send('Hello, Scylla!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
  
    api.setOptions({listenEvents: true, logLevel: "silent"});

    var listenEmitter = api.listen((err, event) => {
        if(err) return console.error(err);

        switch (event.type) {
            case "message":
            if (event.isGroup === false) {

              api.getUserInfo(event.senderID, (err, data) => {
                if (err) return console.error(err);
                const userName = data[event.senderID].name;
                api.sendMessage(`Hello ${userName},\n\nThis is an automated response message. Whilmar Bitoco is currently unavailable as he is busy at the moment. Your message has been received, and he will get back to you as soon as he is able. Thank you for your understanding.\n\nBest regards,\n\nWhilmar Bitoco`, event.threadID, event.messageID);

              });
              
            }
            
            case "event":
                console.log(event);
                break;
        }
    });
});