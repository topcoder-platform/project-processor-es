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
    name: Joi.string().max(255),
    productKey: Joi.string().max(45),
    category: Joi.string().max(45),
    subCategory: Joi.string().max(45),
    icon: Joi.string().max(255),
    brief: Joi.string().max(45),
    details: Joi.string().max(255),
    aliases: Joi.array(),
    template: Joi.object().empty(null),
    form: Joi.object().keys({
      key: Joi.string().required(),
      version: Joi.number()
    }).empty(null),
    disabled: Joi.boolean().optional(),
    hidden: Joi.boolean().optional(),
    isAddOn: Joi.boolean().optional(),
    createdAt: Joi.any(),
    updatedAt: Joi.any(),
    deletedAt: Joi.any(),
    createdBy: Joi.any(),
    updatedBy: Joi.any(),
    deletedBy: Joi.any()
  })
    .xor('form', 'template')
    .unknown(true)
    .required()
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  // handle ES Update
  async function updateDocPromise (doc) {
    const productTemplates = _.isArray(doc._source.productTemplates) ? doc._source.productTemplates : []

    const existingProductTemplateIndex = _.findIndex(productTemplates, p => p.id === message.id)// if product template does not exists already
    if (existingProductTemplateIndex === -1) {
      productTemplates.push(message)
    } else { // if product template already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously product template was not removed from the index but deleted
      // from the database
      productTemplates.splice(existingProductTemplateIndex, 1, message)
    }
    return _.assign(doc._source, { productTemplates })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Product template created successfully in elasticsearch index, (productTemplateId: ${message.id})`)
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
    const productTemplates = _.map(doc._source.productTemplates, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { productTemplates })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Product template updated successfully in elasticsearch index, (productTemplateId: ${message.id})`)
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
    const productTemplates = _.filter(doc._source.productTemplates, single => single.id !== message.id)
    return _.assign(doc._source, { productTemplates })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Product template deleted successfully in elasticsearch index, (productTemplateId: ${message.id})`)
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
