/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')

/**
 * create id schema
 * @return {Object} the schema
 */
function createIdSchema () {
  return Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    projectId: Joi.number().integer().positive().required()
  }).unknown(true).required()
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return createIdSchema().keys({
    id: Joi.number().integer().positive().required(),
    projectId: Joi.number().integer().positive().required(),
    phaseId: Joi.number().integer().positive().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    templateId: Joi.number().positive().optional().allow(null),
    directProjectId: Joi.number().positive().optional().allow(null),
    billingAccountId: Joi.number().positive().optional().allow(null),
    estimatedPrice: Joi.number().positive().optional(),
    actualPrice: Joi.number().positive().optional(),
    details: Joi.any().optional()
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
    const phases = _.isArray(doc._source.phases) ? doc._source.phases : []

    _.each(phases, (phase) => {
      if (phase.id === message.phaseId) {
        phase.products = _.isArray(phase.products) ? phase.products : []
        phase.products.push(message)
      }
    })
    return _.assign(doc._source, { phases })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Phase product created successfully in elasticsearch index, (phaseProductId: ${message.id})`)
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
    const phases = _.map(doc._source.phases, (phase) => {
      if (phase.id === message.phaseId) {
        phase.products = _.map(phase.products, (product) => {
          if (product.id === message.id) {
            return _.assign(product, message)
          }
          return product
        })
      }
      return phase
    })
    return _.assign(doc._source, { phases })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Phase product updated successfully in elasticsearch index, (phaseProductId: ${message.id})`)
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
    const phases = _.map(doc._source.phases, (phase) => {
      if (phase.id === message.phaseId) {
        phase.products = _.filter(phase.products, product => product.id !== message.id)
      }
      return phase
    })
    return _.assign(doc._source, { phases })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Phase product deleted successfully in elasticsearch index, (phaseProductId: ${message.id})`)
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
