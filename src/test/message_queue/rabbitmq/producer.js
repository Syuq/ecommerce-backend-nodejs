const amqp = require('amqplib');
const { compareSync } = require('bcrypt');
const { Console } = require('winston/lib/winston/transports');
const messages = 'hello, RabbitMQ!';

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest::123456@localhost');
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, { durable: true });

    // send messages to consumer channel
    await channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`Message sent: ${messages}`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(`Error sending message to queue::`, error);
  }
};

runProducer()
  .then((rs) => console.log(rs))
  .catch(console.error);
