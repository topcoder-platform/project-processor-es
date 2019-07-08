/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const config = require('config')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')
const { TIMELINE_REFERENCES } = require('../constants')

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
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).allow(null),
    reference: Joi.string().valid(_.values(TIMELINE_REFERENCES)).required(),
    referenceId: Joi.number().integer().positive().required(),
    templateId: Joi.number().integer().min(1).optional(),
    createdAt: Joi.any(),
    updatedAt: Joi.any(),
    deletedAt: Joi.any(),
    createdBy: Joi.any(),
    updatedBy: Joi.any(),
    deletedBy: Joi.any()
  })
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  await client.create({
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id,
    body: message
  })
  logger.debug(`Timeline created successfully in elasticsearch index, (timeline: ${JSON.stringify(message)})`)
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
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id,
    body: {
      doc: message
    }
  })
  logger.debug(`Timeline updated successfully in elasticsearch index, (timelineId: ${message.id})`)
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
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id
  })
  logger.debug(`Timeline deleted successfully in elasticsearch index, (timelineId: ${message.id})`)
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
