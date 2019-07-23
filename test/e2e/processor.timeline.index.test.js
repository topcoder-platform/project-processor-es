/**
 * The test cases for TC timeline processor using real Elasticsearch.
 */

// During tests the node env is set to test
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const { expect } = require('chai')
const ProcessorService = require('../../src/services/ProcessorService')
const testHelper = require('../common/testHelper')
const logger = require('../../src/common/logger')

const {
  notFoundId,
  timelineId,
  timelineUpdatedMessage,
  timelineCreatedMessage,
  timelineDeletedMessage,
  milestoneId,
  milestoneUpdatedMessage,
  milestoneCreatedMessage,
  milestoneDeletedMessage
} = require('../common/testData')

describe('TC Validate Topic Tests', () => {
  it('create topic message - invalid parameters, null message', async () => {
    try {
      await ProcessorService.create(null)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"message" must be an object'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, missing topic', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    delete message.topic
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"topic" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, invalid topic resource', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    message.payload.resource = 'invalid topic resource'
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('Error')
      const msg = 'invalid topic resource'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, empty topic', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    message.topic = ''
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"topic" is not allowed to be empty'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, missing originator', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    delete message.originator
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"originator" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, wrong originator', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    message.originator = 'test'
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"originator" must be one of [project-api]'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, invalid timestamp', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    message.timestamp = 'abc'
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"timestamp" must be a number of milliseconds or valid date string'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, null timestamp', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    message.timestamp = null
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"timestamp" must be a number of milliseconds or valid date string'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, missing payload', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    delete message.payload
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"payload" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, missing payload id', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    delete message.payload.id
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"id" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('create topic message - invalid parameters, invalid payload id', async () => {
    const message = _.cloneDeep(timelineCreatedMessage)
    message.payload.id = 'abc'
    try {
      await ProcessorService.create(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"id" must be a number'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, null message', async () => {
    try {
      await ProcessorService.update(null)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"message" must be an object'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, missing topic', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    delete message.topic
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"topic" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, invalid topic resource', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.payload.resource = 'invalid topic resource'
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('Error')
      const msg = 'invalid topic resource'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, empty topic', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.topic = ''
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"topic" is not allowed to be empty'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, missing originator', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    delete message.originator
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"originator" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, wrong originator', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.originator = 'test'
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"originator" must be one of [project-api]'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, invalid timestamp', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.timestamp = 'abc'
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"timestamp" must be a number of milliseconds or valid date string'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, null timestamp', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.timestamp = null
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"timestamp" must be a number of milliseconds or valid date string'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, missing payload', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    delete message.payload
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"payload" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, missing payload id', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    delete message.payload.id
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"id" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, invalid payload id', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.payload.id = 'abc'
    try {
      await ProcessorService.update(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"id" must be a number'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, null message', async () => {
    try {
      await ProcessorService.deleteMessage(null)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"message" must be an object'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, missing topic', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    delete message.topic
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"topic" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('update topic message - invalid parameters, invalid topic resource', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.payload.resource = 'invalid topic resource'
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('Error')
      const msg = 'invalid topic resource'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, empty topic', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.topic = ''
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"topic" is not allowed to be empty'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, missing originator', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    delete message.originator
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"originator" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, wrong originator', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.originator = 'test'
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"originator" must be one of [project-api]'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, invalid timestamp', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.timestamp = 'abc'
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"timestamp" must be a number of milliseconds or valid date string'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, null timestamp', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.timestamp = null
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"timestamp" must be a number of milliseconds or valid date string'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, missing payload', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    delete message.payload
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"payload" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, missing payload id', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    delete message.payload.id
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"id" is required'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })

  it('delete topic message - invalid parameters, invalid payload id', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.payload.id = 'abc'
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      logger.logFullError(err)
      expect(err).to.exist // eslint-disable-line
      expect(err.name).to.equal('ValidationError')
      const msg = '"id" must be a number'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be validation error.')
  })
})

describe('TC Timeline And Nested Timeline Topic Tests', () => {
  it('create timeline message', async () => {
    await ProcessorService.create(timelineCreatedMessage)
    const data = await testHelper.getTimelineESData(timelineId)
    testHelper.expectObj(data, timelineCreatedMessage.payload,
      _.keys(_.omit(timelineCreatedMessage.payload, ['resource'])))
  })

  it('create timeline message - already exists', async () => {
    try {
      await ProcessorService.create(timelineCreatedMessage)
    } catch (err) {
      expect(err).to.exist // eslint-disable-line
      expect(err.statusCode).to.equal(409)
      const msg = 'document already exists'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be conflict error.')
  })

  it('update timeline message', async () => {
    await ProcessorService.update(timelineUpdatedMessage)
    const data = await testHelper.getTimelineESData(timelineId)
    testHelper.expectObj(data, timelineUpdatedMessage.payload,
      _.keys(_.omit(timelineUpdatedMessage.payload, ['resource'])))
  })

  it('update timeline message - not found', async () => {
    const message = _.cloneDeep(timelineUpdatedMessage)
    message.payload.id = notFoundId
    try {
      await ProcessorService.update(message)
    } catch (err) {
      expect(err).to.exist // eslint-disable-line
      expect(err.statusCode).to.equal(404)
      const msg = 'document missing'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be not found error.')
  })

  it('delete timeline message - not found', async () => {
    const message = _.cloneDeep(timelineDeletedMessage)
    message.payload.id = notFoundId
    try {
      await ProcessorService.deleteMessage(message)
    } catch (err) {
      expect(err).to.exist // eslint-disable-line
      expect(err.statusCode).to.equal(404)
      const msg = 'Not Found'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be not found error.')
  })

  it('delete timeline message', async () => {
    await ProcessorService.deleteMessage(timelineDeletedMessage)
    try {
      await testHelper.getTimelineESData(timelineId)
    } catch (err) {
      expect(err).to.exist // eslint-disable-line
      expect(err.statusCode).to.equal(404)
      const msg = 'Not Found'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be not found error.')
  })
})

describe('TC Milestone Topic Tests', () => {
  before(async () => {
    // runs before all tests in this block
    await ProcessorService.create(timelineCreatedMessage)
  })

  it('create milestone message', async () => {
    await ProcessorService.create(milestoneCreatedMessage)
    const data = await testHelper.getTimelineESData(timelineId)
    testHelper.expectObj(_.find(data.milestones, { id: milestoneId }), milestoneCreatedMessage.payload,
      _.keys(_.omit(milestoneCreatedMessage.payload, ['resource'])))
  })

  it('create another milestone message', async () => {
    const message = _.cloneDeep(milestoneCreatedMessage)
    message.payload.id += 1
    await ProcessorService.create(message)
    const data = await testHelper.getTimelineESData(timelineId)
    testHelper.expectObj(_.find(data.milestones, { id: message.payload.id }), message.payload,
      _.keys(_.omit(message.payload, ['resource'])))
  })

  it('create milestone message - already exists', async () => {
    await ProcessorService.create(milestoneCreatedMessage)
    const data = await testHelper.getTimelineESData(timelineId)
    testHelper.expectObj(_.find(data.milestones, { id: milestoneId }), milestoneCreatedMessage.payload,
      _.keys(_.omit(milestoneCreatedMessage.payload, ['resource'])))
  })

  it('update milestone message', async () => {
    await ProcessorService.update(milestoneUpdatedMessage)
    const data = await testHelper.getTimelineESData(timelineId)
    testHelper.expectObj(_.find(data.milestones, { id: milestoneId }), milestoneUpdatedMessage.payload,
      _.keys(_.omit(milestoneUpdatedMessage.payload, ['resource'])))
  })

  it('update milestone message - not found', async () => {
    const message = _.cloneDeep(milestoneUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getTimelineESData(timelineId)
    expect(_.find(data.milestones, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete milestone message', async () => {
    await ProcessorService.deleteMessage(milestoneDeletedMessage)
    const data = await testHelper.getTimelineESData(timelineId)
    expect(_.find(data.milestones, { id: milestoneId })).to.be.an('undefined')
  })
})
