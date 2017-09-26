const net = require('net');
const readline = require("readline");
const fs = require("fs");
const port = 7000;
let json_q = [];
let seed = 0;

const DECLINE = "DEC";
const ACKNOWLEDGE = "ACK";
const QUESTION_ACCEPT = "QA";
const UNKNOWN_VALUE = "UNKNOWN";
const LOGS_DIRECTORY = "Trash";
const CLIENT_NAME_LOG = "Client";
const SERVER_NAME_LOG = "Server";

const server = net.createServer((client) => 
{
console.log('Client connected');

client.setEncoding('utf8');

client.on('data', (data) => 
{
    if (client.id === undefined)
	{
        client.id = (Date.now() + seed++).toString();
        console.log("id : " + client.id);
    }
    log(client.id, data, CLIENT_NAME_LOG);
    if (data === QUESTION_ACCEPT) 
	{
        client.write(ACKNOWLEDGE);
        log(client.id, ACKNOWLEDGE, SERVER_NAME_LOG);
    }
    else 
	{
        let answer = rand_ans(data);
        if (answer === UNKNOWN_VALUE)
		{
            client.write(DECLINE);
            log(client.id, DECLINE, SERVER_NAME_LOG);
            client.disconnect();
        }
        else 
		{
            client.write(answer);
            log(client.id, answer, SERVER_NAME_LOG);
        }
    }
});

client.on('end', () => console.log('Client disconnected'));


});


