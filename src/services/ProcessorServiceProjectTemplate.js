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
 * update schema
 * @return {Object} the schema
 */
function updateSchema () {
  return createIdSchema().keys({
    scope: Joi.object().empty(null),
    phases: Joi.object().empty(null),
    form: Joi.object().keys({
      key: Joi.string().required(),
      version: Joi.number()
    }).empty(null),
    planConfig: Joi.object().keys({
      key: Joi.string().required(),
      version: Joi.number()
    }).empty(null),
    priceConfig: Joi.object().keys({
      key: Joi.string().required(),
      version: Joi.number()
    }).empty(null),
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
    name: Joi.string().max(255).required(),
    key: Joi.string().max(45).required(),
    category: Joi.string().max(45).required(),
    icon: Joi.string().max(255).required(),
    question: Joi.string().max(255).required(),
    info: Joi.string().max(255).required(),
    aliases: Joi.array().required()
  })
    .xor('form', 'scope')
    .xor('phases', 'planConfig')
    .nand('priceConfig', 'scope')
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  // handle ES Update
  async function updateDocPromise (doc) {
    const projectTemplates = _.isArray(doc._source.projectTemplates) ? doc._source.projectTemplates : []

    const existingProjectTemplateIndex = _.findIndex(projectTemplates, p => p.id === message.id)// if project template does not exists already
    if (existingProjectTemplateIndex === -1) {
      projectTemplates.push(message)
    } else { // if project template already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously project template was not removed from the index but deleted
      // from the database
      projectTemplates.splice(existingProjectTemplateIndex, 1, message)
    }

    return _.assign(doc._source, { projectTemplates })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Project template created successfully in elasticsearch index, (projectTemplateId: ${message.id})`)
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
    const projectTemplates = _.map(doc._source.projectTemplates, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { projectTemplates })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Project template updated successfully in elasticsearch index, (projectTemplateId: ${message.id})`)
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
    const projectTemplates = _.filter(doc._source.projectTemplates, single => single.id !== message.id)
    return _.assign(doc._source, { projectTemplates })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Project template deleted successfully in elasticsearch index, (projectTemplateId: ${message.id})`)
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
