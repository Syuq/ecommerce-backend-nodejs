'use strict';

async function consumerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest::123456@localhost');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queue-message';
  await channel.assertQueue(queueName, { durable: true });

  for (let i = 0; i < 10; i++) {
    await channel.sendToQueue(queueName, Buffer.from(`Message ${i}`), {
      persistent: true,
      headers: {
        'x-order-id': i
      }
    });
    console.log(`Message ${i} sent`);
  }
}
