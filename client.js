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

client.on('data', function(data) 
{
    if (data === ACKNOWLEDGE) 
	{
        client.write(questions[0].question);
    }
    if (data === DECLINE)
	{
        client.destroy();
        process.terminate();
    }
    if (data !== ACKNOWLEDGE) 
	{
        console.log("Question: " + questions[ind].question);
        console.log("Answer: " + data);
        console.log("Is right: " + (data === questions[ind].ans ? "Yes" : "No"));
        if (ind + 1 === questions.length) 
		{
            console.log("Questions are over");
            client.destroy();
        }
        else
		{
			++ind;
            client.write(questions[ind].question);
        }
    }
});

client.on('close', function() 
{
    console.log('Connection closed');
});

// SO. Is there smth in NPM?
//function shuffle(array)
//{
//    let size = array.length;
//    while (size > 0) 
//	{
//        let index = Math.floor(Math.random() * size);
//        size--;
//        let temp = array[size];
//        array[size] = array[index];
//        array[index] = temp;
//    }
//    return array;
//}
