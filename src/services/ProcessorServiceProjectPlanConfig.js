/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')

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
    key: Joi.string().max(45).required(),
    config: Joi.object().required(),
    version: Joi.number().integer().positive().required(),
    revision: Joi.number().integer().positive().required(),
    createdAt: Joi.any(),
    updatedAt: Joi.any(),
    deletedAt: Joi.any(),
    createdBy: Joi.any(),
    updatedBy: Joi.any(),
    deletedBy: Joi.any()
  }).unknown(true).required()
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  // handle ES Update
  async function updateDocPromise (doc) {
    const planConfigs = _.isArray(doc._source.planConfigs) ? doc._source.planConfigs : []

    const existingPlanConfigIndex = _.findIndex(planConfigs, p => p.id === message.id)// if plan config does not exists already
    if (existingPlanConfigIndex === -1) {
      planConfigs.push(message)
    } else { // if plan config already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously plan config was not removed from the index but deleted
      // from the database
      planConfigs.splice(existingPlanConfigIndex, 1, message)
    }

    return _.assign(doc._source, { planConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Plan configs created successfully in elasticsearch index, (planConfigsId: ${message.id})`)
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
  // handle ES Update
  async function updateDocPromise (doc) {
    const planConfigs = _.map(doc._source.planConfigs, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { planConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Plan configs updated successfully in elasticsearch index, (planConfigsId: ${message.id})`)
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
  // handle ES Update
  async function updateDocPromise (doc) {
    const planConfigs = _.filter(doc._source.planConfigs, single => single.id !== message.id)
    return _.assign(doc._source, { planConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Plan configs deleted successfully in elasticsearch index, (planConfigsId: ${message.id})`)
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
