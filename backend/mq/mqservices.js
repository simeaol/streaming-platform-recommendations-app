var amqp = require('amqplib/callback_api');

const RABBIT_USER_NAME = process.env.RABBIT_USER_NAME || 'equipe7';
const RABBIT_USER_PASSWORD = process.env.RABBIT_USER_PASSWORD || 'equipe7';
const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL || `amqp://${RABBIT_USER_NAME}:${RABBIT_USER_PASSWORD}@173.193.120.98:30082`;

let ch = null;
amqp.connect(RABBIT_MQ_URL, (err, conn) => {
   conn.createChannel((err, channel) =>{
      ch = channel;
   });
});

publishToQueue = async (queueName, data) => {
   ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
   console.log(`data sent to queue: ${queueName}`)
};

process.on('exit', (code) => {
   ch.close();
   console.log(`Closing rabbitmq channel`);
});

module.exports = {
    publishToQueue,
};