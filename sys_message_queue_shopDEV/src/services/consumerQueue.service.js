'use strict'

const {
  consumerQueue,
  connectToRabbitMQ
} = require('../dbs/init.rabbit')

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ()
      await consumerQueue(channel, queueName)
    } catch (error) {
      console.error(`Error consuming message from queue::`, error)
    };
  }
}

module.exports = messageService