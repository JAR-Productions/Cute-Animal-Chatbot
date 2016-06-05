'use strict'
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAAG3ZC9ZBNALYBAPn39I0XikJLBbikSfK7VZAZCWduqeEZBWWuGQR3ZCiG3pC6WGN0wUnWYNQXlTDMuZC1AZBfIZCBdProOJTJjDmRWq9z5A16Ts76MVjulJERvNogluSj1f5ZBwc9ymtvHwoZBTbSX5Ei0LQ2ZAmm1R48AB2ZCp1K4NZCMAZDZD',
  verify: 'VERIFY_TOKEN'
})


var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {


  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

  kittenMessage(payload.sender.id, payload.message.text)

  })
})


// send rich message with kitten
function kittenMessage(recipientId, text) {

    text = text || "";


    var values = text.split(' ');

    if (values.length === 3 && values[0] === 'Kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
          var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);

           var message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            }

             sendMessage(recipientId, message);

            return true;
        } 
    }
    
    return false;
    
};



function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: bot.token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

/*

bot.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});*/

http.createServer(bot.middleware()).listen(3000)