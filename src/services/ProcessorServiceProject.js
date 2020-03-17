/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const config = require('config')

const logger = require('../common/logger')
const helper = require('../common/helper')
const { REGEX, PROJECT_STATUS } = require('../constants')

const client = helper.getESClient()

/**
 * create schema
 * @return {Object} the schema
 */
function createIdSchema () {
  return Joi.object().keys({
    id: Joi.number().integer().positive().required()
  }).unknown(true).required()
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return createIdSchema().keys({
    id: Joi.number().integer().positive().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    terms: Joi.array().items(Joi.number().positive()).optional(),
    name: Joi.string().required(),
    description: Joi.string().allow(null).allow('').optional(),
    type: Joi.string().max(45).required(),
    createdBy: Joi.number().integer().positive().required(), // userId
    updatedBy: Joi.number().integer().required(), // userId - can be negative for M2M tokens
    challengeEligibility: Joi.array().items(Joi.object().keys({
      role: Joi.string().valid('submitter', 'reviewer', 'copilot'),
      users: Joi.array().items(Joi.number().positive()),
      groups: Joi.array().items(Joi.number().positive())
    })).allow(null),
    bookmarks: Joi.array().items(Joi.object().keys({
      title: Joi.string(),
      address: Joi.string().regex(REGEX.URL),
      createdAt: Joi.date(),
      createdBy: Joi.number().integer().positive(),
      updatedAt: Joi.date(),
      updatedBy: Joi.number().integer().positive()
    })).optional().allow(null),
    external: Joi.object().keys({
      id: Joi.string(),
      type: Joi.any().valid('github', 'jira', 'asana', 'other'),
      data: Joi.string().max(300) // TODO - restrict length
    }).allow(null),
    status: Joi.string().required(),
    lastActivityAt: Joi.date().required(),
    lastActivityUserId: Joi.string().required(), // user handle
    version: Joi.string(),
    directProjectId: Joi.number().positive().allow(null),
    billingAccountId: Joi.number().positive().allow(null),
    utm: Joi.object().keys({
      source: Joi.string().allow(null),
      medium: Joi.string().allow(null),
      campaign: Joi.string().allow(null)
    }).allow(null),
    estimatedPrice: Joi.number().precision(2).positive().optional()
      .allow(null),
    details: Joi.any(),
    templateId: Joi.number().integer().positive().allow(null),
    estimation: Joi.array().items(Joi.object().keys({
      conditions: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().optional(),
      minTime: Joi.number().integer().required(),
      maxTime: Joi.number().integer().required(),
      buildingBlockKey: Joi.string().required(),
      metadata: Joi.object().optional()
    })).optional(),
    // cancel reason is mandatory when project status is cancelled
    cancelReason: Joi.when('status', {
      is: PROJECT_STATUS.CANCELLED,
      then: Joi.string().required(),
      otherwise: Joi.string().optional().allow(null)
    })
  })
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  const member = await helper.populateMemberWithUserDetails(message.members[0])
  message.members = [member]

  await client.create({
    index: config.get('esConfig.ES_PROJECT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id,
    body: message
  })
  logger.debug(`Project created successfully in elasticsearch index, (projectId: ${message.id})`)
}

create.schema = {
  message: createSchema()
}

/**
 * Update message in Elasticsearch.
 * @param {Object} message the challenge updated message
 * @return {Promise} promise result
 */
async function update (message) {
  // it will do full or partial update
  await client.update({
    index: config.get('esConfig.ES_PROJECT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id,
    body: {
      doc: message
    }
  })
  logger.debug(`Project updated successfully in elasticsearch index, (projectId: ${message.id})`)
}

update.schema = {
  message: createSchema()
}

/**
 * Delete message in Elasticsearch.
 * @param {Object} message the challenge deleted message
 * @return {Promise} promise result
 */
async function deleteMessage (message) {
  await client.delete({
    index: config.get('esConfig.ES_PROJECT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id
  })
  logger.debug(`Project deleted successfully in elasticsearch index, (projectId: ${message.id})`)
}

deleteMessage.schema = {
  message: createIdSchema()
}

// Exports
module.exports = {
  create,
  update,
  deleteMessage
}

logger.buildService(module.exports)
