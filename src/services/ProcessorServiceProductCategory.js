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
 * update schema
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
    .unknown(true)
    .required()
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return updateSchema().keys({
    key: Joi.string().max(45).required(),
    displayName: Joi.string().max(255).required(),
    icon: Joi.string().max(255).required(),
    question: Joi.string().max(255).required(),
    info: Joi.string().max(255).required(),
    aliases: Joi.array().required()
  })
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
    const productCategories = _.isArray(doc._source.productCategories) ? doc._source.productCategories : []

    const existingProductCategoryIndex = _.findIndex(productCategories, p => p.key === message.key)// if product category does not exists already
    if (existingProductCategoryIndex === -1) {
      productCategories.push(message)
    } else { // if product category already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously product category was not removed from the index but deleted
      // from the database
      productCategories.splice(existingProductCategoryIndex, 1, message)
    }
    return _.assign(doc._source, { productCategories })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Product category created successfully in elasticsearch index, (productCategoryKey: ${message.key})`)
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
    const productCategories = _.map(doc._source.productCategories, (single) => {
      if (single.key === message.key) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { productCategories })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Product category updated successfully in elasticsearch index, (productCategoryKey: ${message.key})`)
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
    const productCategories = _.filter(doc._source.productCategories, single => single.key !== message.key)
    return _.assign(doc._source, { productCategories })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Product category deleted successfully in elasticsearch index, (productCategoryKey: ${message.key})`)
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
