'use strict'

const { consumerToQueue } = require('./src/services/consumerQueue.service')
const queueName = 'test-topic'

consumerToQueue(queueName).then( () => {
  console.log(`Consumer to queue ${queueName} successfully`)
}).catch( err => {
  console.error(`Error consuming message from queue: ${err.message}`)
})