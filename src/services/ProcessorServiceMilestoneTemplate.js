/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')
const { MILESTONE_TEMPLATE_REFERENCES } = require('../constants')

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
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    duration: Joi.number().integer().required(),
    type: Joi.string().max(45).required(),
    order: Joi.number().integer().required(),
    plannedText: Joi.string().max(512).required(),
    activeText: Joi.string().max(512).required(),
    completedText: Joi.string().max(512).required(),
    blockedText: Joi.string().max(512).required(),
    reference: Joi.string().valid(_.values(MILESTONE_TEMPLATE_REFERENCES)).required(),
    referenceId: Joi.number().integer().positive().required(),
    metadata: Joi.object().required()
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
    const milestoneTemplate = _.isArray(doc._source.milestoneTemplate) ? doc._source.milestoneTemplate : []

    const existingMilestoneTemplateIndex = _.findIndex(milestoneTemplate, p => p.id === message.id)// if milestone template does not exists already
    if (existingMilestoneTemplateIndex === -1) {
      milestoneTemplate.push(message)
    } else { // if milestone template already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously milestone template was not removed from the index but deleted
      // from the database
      milestoneTemplate.splice(existingMilestoneTemplateIndex, 1, message)
    }
    return _.assign(doc._source, { milestoneTemplate })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Milestone template created successfully in elasticsearch index, (milestoneTemplateId: ${message.id})`)
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
    const milestoneTemplate = _.map(doc._source.milestoneTemplate, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })

    return _.assign(doc._source, { milestoneTemplate })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Milestone template updated successfully in elasticsearch index, (milestoneTemplateId: ${message.id})`)
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
    const milestoneTemplate = _.filter(doc._source.milestoneTemplate, single => single.id !== message.id)
    return _.assign(doc._source, { milestoneTemplate })
  }

  await helper.updateMetadadaESPromise(updateDocPromise)
  logger.debug(`Milestone template deleted successfully in elasticsearch index, (milestoneTemplateId: ${message.id})`)
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
