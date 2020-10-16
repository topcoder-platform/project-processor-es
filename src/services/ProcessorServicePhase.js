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
    name: Joi.string().required(),
    status: Joi.string().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    duration: Joi.number().min(0).optional().allow(null),
    budget: Joi.number().min(0).optional(),
    spentBudget: Joi.number().min(0).optional(),
    progress: Joi.number().min(0).optional(),
    details: Joi.any().optional(),
    order: Joi.number().integer().optional().allow(null)
  })
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  // handle ES Update
  async function updateDocPromise (doc) { // eslint-disable-line no-unused-vars
    const phases = _.isArray(doc._source.phases) ? doc._source.phases : []
    const existingPhaseIndex = _.findIndex(phases, p => p.id === message.id)// if phase does not exists already
    if (existingPhaseIndex === -1) {
      // Increase the order of the other phases in the same project,
      // which have `order` >= this phase order
      _.each(phases, (_phase) => {
        if (!_.isNil(_phase.order) && !_.isNil(message.order) && _phase.order >= message.order) {
          _phase.order += 1
        }
      })

      phases.push(message)
    } else { // if phase already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously phase was not removed from the index but deleted
      // from the database
      phases.splice(existingPhaseIndex, 1, message)
    }
    return _.assign(doc._source, { phases })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project phase created successfully in elasticsearch index, (projectPhaseId: ${message.id})`)
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
  async function updateDocPromise (doc) { // eslint-disable-line no-unused-vars
    const phases = _.map(doc._source.phases, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { phases })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project phase updated successfully in elasticsearch index, (projectPhaseId: ${message.id})`)
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
    const phases = _.filter(doc._source.phases, single => single.id !== message.id)
    return _.assign(doc._source, { phases })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project phase deleted successfully in elasticsearch index, (projectPhaseId: ${message.id})`)
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
