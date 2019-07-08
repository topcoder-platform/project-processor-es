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
    key: Joi.string().max(45).required()
  }).unknown(true).required()
}

/**
 * create schema
 * @return {Object} the schema
 */
function updateSchema () {
  return createIdSchema().keys({
    disabled: Joi.boolean().optional(),
    hidden: Joi.boolean().optional(),
    createdAt: Joi.any(),
    updatedAt: Joi.any(),
    deletedAt: Joi.any(),
    createdBy: Joi.any(),
    updatedBy: Joi.any(),
    deletedBy: Joi.any()
  })
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return updateSchema().keys({
    displayName: Joi.string().max(255).required(),
    icon: Joi.string().max(255).required(),
    question: Joi.string().max(255).required(),
    info: Joi.string().max(255).required(),
    aliases: Joi.array().required(),
    metadata: Joi.object().required()
  })
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  // handle ES Update
  async function updateDocPromise (doc) {
    const projectTypes = _.isArray(doc._source.projectTypes) ? doc._source.projectTypes : []

    const existingProjectTypeIndex = _.findIndex(projectTypes, p => p.key === message.key)// if project type does not exists already
    if (existingProjectTypeIndex === -1) {
      projectTypes.push(message)
    } else { // if project type already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously project type was not removed from the index but deleted
      // from the database
      projectTypes.splice(existingProjectTypeIndex, 1, message)
    }

    return _.assign(doc._source, { projectTypes })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Project type created successfully in elasticsearch index, (projectTypeKey: ${message.key})`)
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
    const projectTypes = _.map(doc._source.projectTypes, (single) => {
      if (single.key === message.key) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { projectTypes })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Project type updated successfully in elasticsearch index, (projectTypeKey: ${message.key})`)
}

update.schema = {
  message: updateSchema()
}

/**
 * Delete message in Elasticsearch.
 * @param {Object} message the challenge deleted message
 * @return {Promise} promise result
 */
async function deleteMessage (message) {
  // handle ES Update
  async function updateDocPromise (doc) {
    const projectTypes = _.filter(doc._source.projectTypes, single => single.key !== message.key)
    return _.assign(doc._source, { projectTypes })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Project type deleted successfully in elasticsearch index, (projectTypeKey: ${message.key})`)
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
