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
    const priceConfigs = _.isArray(doc._source.priceConfigs) ? doc._source.priceConfigs : []

    const existingPriceConfigIndex = _.findIndex(priceConfigs, p => p.id === message.id)// if price config does not exists already
    if (existingPriceConfigIndex === -1) {
      priceConfigs.push(message)
    } else { // if price config already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously price config was not removed from the index but deleted
      // from the database
      priceConfigs.splice(existingPriceConfigIndex, 1, message)
    }

    return _.assign(doc._source, { priceConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Price configs created successfully in elasticsearch index, (priceConfigsId: ${message.id})`)
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
    const priceConfigs = _.map(doc._source.priceConfigs, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { priceConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Price configs updated successfully in elasticsearch index, (priceConfigsId: ${message.id})`)
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
    const priceConfigs = _.filter(doc._source.priceConfigs, single => single.id !== message.id)
    return _.assign(doc._source, { priceConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Price configs deleted successfully in elasticsearch index, (priceConfigsId: ${message.id})`)
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
