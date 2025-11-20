/**
 * Service for customer payment Elasticsearch processor.
 */

const Joi = require('joi')
const config = require('config')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')
const { CUSTOMER_PAYMENT_STATUS } = require('../constants')

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
    amount: Joi.number().integer().min(1).required(),
    currency: Joi.string().required(),
    paymentIntentId: Joi.string().required(),
    status: Joi.string().valid(_.values(CUSTOMER_PAYMENT_STATUS)).required(),
    reference: Joi.string().optional(),
    referenceId: Joi.string().optional(),
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
 * @param {Object} message the customer payment created message
 * @return {Promise} promise result
 */
async function create (message) {
  await client.create({
    index: config.get('esConfig.ES_CUSTOMER_PAYMENT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id,
    body: message
  })
  logger.debug(`CustomerPayment created successfully in elasticsearch index, (customerPayment: ${JSON.stringify(message)})`)
}

create.schema = {
  message: createSchema()
}

/**
 * Update message in Elasticsearch.
 * @param {Object} message the customer payment updated message
 * @return {Promise} promise result
 */
async function update (message) {
  await client.update({
    index: config.get('esConfig.ES_CUSTOMER_PAYMENT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.id,
    body: {
      doc: message
    }
  })
  logger.debug(`CustomerPayment updated successfully in elasticsearch index, (customerPayment: ${message.id})`)
}

update.schema = {
  message: createSchema()
}

// Exports
module.exports = {
  create,
  update
}

logger.buildService(module.exports)
