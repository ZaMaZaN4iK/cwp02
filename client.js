const net = require('net');
const fs = require('fs');
let shuffle = require('shuffle-array');
const port = 7000;
const client = new net.Socket();
let questions = [];
let ind = 0;


const DECLINE = "DEC";
const ACKNOWLEDGE = "ACK";
const QUESTION_ACCEPT = "QA";
const UNKNOWN_VALUE = "UNKNOWN";
const LOGS_DIRECTORY = "Trash";
const CLIENT_NAME_LOG = "Client";
const SERVER_NAME_LOG = "Server";


client.setEncoding('utf8');

client.connect(port, function() 
{
    fs.readFile("qa.json", (err, data) => 
    {
        if (err) 
		{
            console.error("Error with JSON file");
        }
        else 
		{
            questions = JSON.parse(data);
            questions = shuffle(questions);
            client.write(QUESTION_ACCEPT);
            console.log('Connected to the server');
        }
    });
});


