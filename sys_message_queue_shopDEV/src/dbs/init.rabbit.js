'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    if(!connection) throw new Error(' Connection not established')

    const channel = await connection.createChannel()

    const queue = 'sys_message_queue_shopDEV'
    await channel.assertQueue(queue, { durable: false })
    return {channel, connection}
  } catch (error) {
    console.error(error)
  }
}

const connectToRabbitMQForTest = async () => {
  try {
    const {channel, connection} = await connectToRabbitMQ()

    const queue = 'test_queue'
    const message = 'Hello, shopDEV by Syuq'

    await channel.assertQueue(queue)
    await channel.sendToQueue(queue, Buffer.from(message))

    // close the connection
    await connection.close()
  } catch (error) {
    console.log(`Error connection to RabbitMQ`, error)
  }
}

const consumerQueue = async ( channel, queueName ) => {
  try {
    await channel.assertQueue(queueName, { durable: true })
    console.log(`Waiting for messages...`)
    channel.consume( queueName, msg => {
      console.log(`Received message: ${queueName}::`, msg.content.toString())
    }, {
      noAck: true
    })
  } catch (error) {
    console.error(`error publish message to rabbitMQ::`, error)
    throw error
  }
}

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue
}