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
    orgId: Joi.string().max(45).required(),
    configName: Joi.string().max(45).required(),
    configValue: Joi.string().max(512),
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
    const orgConfigs = _.isArray(doc._source.orgConfigs) ? doc._source.orgConfigs : []

    const existingOrgConfigIndex = _.findIndex(orgConfigs, p => p.id === message.id)// if org config does not exists already
    if (existingOrgConfigIndex === -1) {
      orgConfigs.push(message)
    } else { // if org config already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously org config was not removed from the index but deleted
      // from the database
      orgConfigs.splice(existingOrgConfigIndex, 1, message)
    }
    return _.assign(doc._source, { orgConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Org config created successfully in elasticsearch index, (orgConfigId: ${message.id})`)
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
    const orgConfigs = _.map(doc._source.orgConfigs, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { orgConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Org config updated successfully in elasticsearch index, (orgConfigId: ${message.id})`)
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
    const orgConfigs = _.filter(doc._source.orgConfigs, single => single.id !== message.id)
    return _.assign(doc._source, { orgConfigs })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Org config deleted successfully in elasticsearch index, (orgConfigId: ${message.id})`)
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
