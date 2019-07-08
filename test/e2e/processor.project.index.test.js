/**
 * The test cases for TC project processor using real Elasticsearch.
 */

// During tests the node env is set to test
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const { expect } = require('chai')
const Joi = require('joi')
const ProcessorService = require('../../src/services/ProcessorService')
const testHelper = require('../common/testHelper')
const logger = require('../../src/common/logger')

const {
  projectId,
  notFoundId,
  attachmentId,
  phaseId,
  phaseProductId,
  projectMemberId,
  projectMemberInviteId,
  projectMemberInviteUpdatedMessage,
  projectMemberInviteCreatedMessage,
  projectMemberUpdatedMessage,
  projectMemberCreatedMessage,
  projectMemberDeletedMessage,
  phaseProductUpdatedMessage,
  phaseProductCreatedMessage,
  phaseProductDeletedMessage,
  phaseUpdatedMessage,
  phaseCreatedMessage,
  phaseDeletedMessage,
  projectUpdatedMessage,
  projectCreatedMessage,
  projectDeletedMessage,
  attachmentCreatedMessage,
  attachmentUpdatedMessage,
  attachmentDeletedMessage
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
    const message = _.cloneDeep(projectCreatedMessage)
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

  it('create topic message - invalid parameters, empty topic', async () => {
    const message = _.cloneDeep(projectCreatedMessage)
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

  it('create topic message - invalid parameters, invalid topic resource', async () => {
    const message = _.cloneDeep(projectCreatedMessage)
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

  it('create topic message - invalid parameters, missing originator', async () => {
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectCreatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectUpdatedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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

  it('create topic message - invalid parameters, invalid topic resource', async () => {
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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
    const message = _.cloneDeep(projectDeletedMessage)
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

describe('TC Project Topic Tests', () => {
  it('create project message', async () => {
    await ProcessorService.create(projectCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(data, projectCreatedMessage.payload,
      _.keys(_.omit(projectCreatedMessage.payload, ['resource'])))
  })

  it('create project message - already exists', async () => {
    try {
      await ProcessorService.create(projectCreatedMessage)
    } catch (err) {
      expect(err).to.exist // eslint-disable-line
      expect(err.statusCode).to.equal(409)
      const msg = 'document already exists'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be conflict error.')
  })

  it('update project message', async () => {
    await ProcessorService.update(projectUpdatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(data, projectUpdatedMessage.payload,
      _.keys(_.omit(projectUpdatedMessage.payload, ['resource'])))
  })

  it('update project message - not found', async () => {
    const message = _.cloneDeep(projectUpdatedMessage)
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

  it('delete project message - not found', async () => {
    const message = _.cloneDeep(projectDeletedMessage)
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

  it('delete project message', async () => {
    await ProcessorService.deleteMessage(projectDeletedMessage)
    try {
      await testHelper.getProjectESData(projectId)
    } catch (err) {
      expect(err).to.exist // eslint-disable-line
      expect(err.statusCode).to.equal(404)
      const msg = 'Document not found'
      expect(err.message.indexOf(msg) >= 0).to.equal(true)
      return
    }
    throw new Error('There should be not found error.')
  })
})

describe('TC Attachment Topic Tests', () => {
  before(async () => {
    // runs before all tests in this block
    await ProcessorService.create(projectCreatedMessage)
  })
  after(async () => {
    // runs after all tests in this block
    await ProcessorService.deleteMessage(projectDeletedMessage)
  })

  it('create attachment message', async () => {
    await ProcessorService.create(attachmentCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.attachments, { id: attachmentId }), attachmentCreatedMessage.payload,
      _.keys(_.omit(attachmentCreatedMessage.payload, ['resource'])))
    logger.logFullError(null)
  })

  it('create attachment message - already exists', async () => {
    await ProcessorService.create(attachmentCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.attachments, { id: attachmentId }), attachmentCreatedMessage.payload,
      _.keys(_.omit(attachmentCreatedMessage.payload, ['resource'])))
  })

  it('update attachment message', async () => {
    await ProcessorService.update(attachmentUpdatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.attachments, { id: attachmentId }), attachmentUpdatedMessage.payload,
      _.keys(_.omit(attachmentUpdatedMessage.payload, ['resource'])))
  })

  it('update attachment message - not found', async () => {
    const message = _.cloneDeep(attachmentUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.attachments, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete attachment message', async () => {
    await ProcessorService.deleteMessage(attachmentDeletedMessage)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.attachments, { id: attachmentId })).to.be.an('undefined')
  })
})

describe('TC Phase Topic Tests', () => {
  before(async () => {
    // runs before all tests in this block
    await ProcessorService.create(projectCreatedMessage)
  })
  after(async () => {
    // runs after all tests in this block
    await ProcessorService.deleteMessage(projectDeletedMessage)
  })

  it('create phase message', async () => {
    await ProcessorService.create(phaseCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.phases, { id: phaseId }), phaseCreatedMessage.payload,
      _.keys(_.omit(phaseCreatedMessage.payload, ['resource'])))
  })

  it('create another phase message', async () => {
    const message = _.cloneDeep(phaseCreatedMessage)
    message.payload.id += 1
    await ProcessorService.create(message)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.phases, { id: message.payload.id }), message.payload,
      _.keys(_.omit(message.payload, ['resource'])))
  })

  it('create phase message - already exists', async () => {
    await ProcessorService.create(phaseCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.phases, { id: phaseId }), phaseCreatedMessage.payload,
      _.keys(_.omit(phaseCreatedMessage.payload, ['resource'])))
  })

  it('update phase message', async () => {
    await ProcessorService.update(phaseUpdatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.phases, { id: phaseId }), phaseUpdatedMessage.payload,
      _.keys(_.omit(phaseUpdatedMessage.payload, ['resource'])))
  })

  it('update phase message - not found', async () => {
    const message = _.cloneDeep(phaseUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.phases, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete phase message', async () => {
    await ProcessorService.deleteMessage(phaseDeletedMessage)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.phases, { id: phaseId })).to.be.an('undefined')
  })
})

describe('TC Phase Product Topic Tests', () => {
  before(async () => {
    // runs before all tests in this block
    await ProcessorService.create(projectCreatedMessage)
    await ProcessorService.create(phaseCreatedMessage)
  })
  after(async () => {
    // runs after all tests in this block
    await ProcessorService.deleteMessage(projectDeletedMessage)
  })

  it('create phase product message', async () => {
    await ProcessorService.create(phaseProductCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(_.find(data.phases, { id: phaseId }).products, { id: phaseProductId }),
      phaseProductCreatedMessage.payload,
      _.keys(_.omit(phaseProductCreatedMessage.payload, ['resource'])))
  })

  it('create another phase product message', async () => {
    const message = _.cloneDeep(phaseProductCreatedMessage)
    message.payload.id += 1
    await ProcessorService.create(message)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(_.find(data.phases, { id: phaseId }).products, { id: message.payload.id }),
      message.payload,
      _.keys(_.omit(message.payload, ['resource'])))
  })

  it('create phase product message - already exists', async () => {
    await ProcessorService.create(phaseProductCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(_.find(data.phases, { id: phaseId }).products, { id: phaseProductId }),
      phaseProductCreatedMessage.payload,
      _.keys(_.omit(phaseProductCreatedMessage.payload, ['resource'])))
  })

  it('update phase product message', async () => {
    await ProcessorService.update(phaseProductUpdatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(_.find(data.phases, { id: phaseId }).products, { id: phaseProductId }),
      phaseProductUpdatedMessage.payload,
      _.keys(_.omit(phaseProductUpdatedMessage.payload, ['resource'])))
  })

  it('update phase product message - not found', async () => {
    const message = _.cloneDeep(phaseProductUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(_.find(data.phases, { id: phaseId }).products, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete phase product message', async () => {
    await ProcessorService.deleteMessage(phaseProductDeletedMessage)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(_.find(data.phases, { id: phaseId }).products, { id: phaseProductId })).to.be.an('undefined')
  })
})

describe('TC Project Member Topic Tests', () => {
  before(async () => {
    // runs before all tests in this block
    await ProcessorService.create(projectCreatedMessage)
  })
  after(async () => {
    // runs after all tests in this block
    await ProcessorService.deleteMessage(projectDeletedMessage)
  })

  it('create project member message', async () => {
    await ProcessorService.create(projectMemberCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.members, { id: projectMemberId }), projectMemberCreatedMessage.payload,
      _.keys(_.omit(projectMemberCreatedMessage.payload, ['resource'])))
  })

  it('create project member message - already exists', async () => {
    await ProcessorService.create(projectMemberCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.members, { id: projectMemberId }), projectMemberCreatedMessage.payload,
      _.keys(_.omit(projectMemberCreatedMessage.payload, ['resource'])))
  })

  it('update project member message', async () => {
    await ProcessorService.update(projectMemberUpdatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.members, { id: projectMemberId }), projectMemberUpdatedMessage.payload,
      _.keys(_.omit(projectMemberUpdatedMessage.payload, ['resource'])))
  })

  it('update project member message - not found', async () => {
    const message = _.cloneDeep(projectMemberUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.members, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete project member message', async () => {
    await ProcessorService.deleteMessage(projectMemberDeletedMessage)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.members, { id: projectMemberId })).to.be.an('undefined')
  })
})

describe('TC Project Member Invite Topic Tests', () => {
  before(async () => {
    // runs before all tests in this block
    await ProcessorService.create(projectCreatedMessage)
  })
  after(async () => {
    // runs after all tests in this block
    await ProcessorService.deleteMessage(projectDeletedMessage)
  })

  it('create project member invite message', async () => {
    await ProcessorService.create(projectMemberInviteCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.invites, { id: projectMemberInviteId }), projectMemberInviteCreatedMessage.payload,
      _.keys(_.omit(projectMemberInviteCreatedMessage.payload, ['resource'])))
  })

  it('create project member invite message - already exists', async () => {
    await ProcessorService.create(projectMemberInviteCreatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    testHelper.expectObj(_.find(data.invites, { id: projectMemberInviteId }), projectMemberInviteCreatedMessage.payload,
      _.keys(_.omit(projectMemberInviteCreatedMessage.payload, ['resource'])))
  })

  it('update project member invite message', async () => {
    await ProcessorService.update(projectMemberInviteUpdatedMessage)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.invites, { id: projectMemberInviteId })).to.be.an('undefined')
  })

  it('update project member invite message - not found', async () => {
    const message = _.cloneDeep(projectMemberInviteUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getProjectESData(projectId)
    expect(_.find(data.invites, { id: notFoundId })).to.be.an('undefined')
  })

  it('test logger', async () => {
    /**
     * test long array
     * @param {Array} longArray long array
     * @return {Array} longArray long array
     */
    async function testLongArray (longArray) {
      return longArray
    }
    testLongArray.schema = {
      longArray: Joi.array().required()
    }

    const exportTestLongArray = { testLongArray }
    logger.buildService(exportTestLongArray)

    const longArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6,
      7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    let longArrayClone = await exportTestLongArray.testLongArray(longArray)
    expect(longArray).to.eql(longArrayClone)
    logger.info(null)

    /**
     * test no schema
     * @param {Array} longArrayInput long array
     * @return {Array} longArray long array
     */
    async function testNoSchema (longArrayInput) {
      return longArrayInput
    }

    const exportTestNoSchemaArray = { testNoSchema }
    logger.buildService(exportTestNoSchemaArray)
    longArrayClone = await exportTestNoSchemaArray.testNoSchema(longArray)
    expect(longArray).to.eql(longArrayClone)
  })
})
