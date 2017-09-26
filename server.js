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

server.listen(port, () =>
{
    fs.readFile("qa.json", (err, data) =>
    {
        if (err) 
		{
            console.error("Error with JSON file");
        }
        else
		{
            json_q = JSON.parse(data);
        }
    });
});


function rand_ans(question)
{
    for (let i = 0; i < json_q.length; i++)
    {
        if (json_q[i].question === question) 
		{
            return Math.floor(Math.random() * 2) === 0 ? json_q[i].ans : json_q[i].wrong_ans;
        }
    }
    return UNKNOWN_VALUE;
}

function log(clientId, line, sender)
{
    fs.appendFileSync(LOGS_DIRECTORY + "/" + clientId + ".log", sender + ": " + line + "\n");
}
