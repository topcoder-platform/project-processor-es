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
    id: Joi.number().integer().positive().required(),
    timelineId: Joi.number().integer().positive().required()
  }).unknown(true).required()
}

/**
 * create schema
 * @return {Object} the schema
 */
function updateSchema () {
  return createIdSchema().keys({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    duration: Joi.number().integer().required(),
    actualStartDate: Joi.date().allow(null),
    status: Joi.string().max(45).required(),
    type: Joi.string().max(45).required(),
    details: Joi.object(),
    order: Joi.number().integer().required(),
    plannedText: Joi.string().max(512).required(),
    activeText: Joi.string().max(512).required(),
    completedText: Joi.string().max(512).required(),
    blockedText: Joi.string().max(512).required(),
    hidden: Joi.boolean().optional(),
    createdAt: Joi.any(),
    updatedAt: Joi.any(),
    deletedAt: Joi.any(),
    createdBy: Joi.any(),
    updatedBy: Joi.any(),
    deletedBy: Joi.any()
  }).unknown(true).required()
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return updateSchema().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).allow(null),
    completionDate: Joi.date().min(Joi.ref('startDate')).allow(null)
  }).unknown(true).required()
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Promise} promise result
 */
async function create (message) {
  // handle ES Update
  async function updateDocPromise (doc) { // eslint-disable-line no-unused-vars
    const milestones = _.isArray(doc._source.milestones) ? doc._source.milestones : []

    const existingMilestoneIndex = _.findIndex(milestones, p => p.id === message.id)// if milestone does not exists already
    if (existingMilestoneIndex === -1) {
      // Increase the order of the other milestones in the same timeline,
      // which have `order` >= this milestone order
      _.each(milestones, (milestone) => {
        if (!_.isNil(milestone.order) && !_.isNil(message.order) && milestone.order >= message.order) {
          milestone.order += 1
        }
      })

      milestones.push(message)
    } else { // if milestone already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously milestone was not removed from the index but deleted
      // from the database
      milestones.splice(existingMilestoneIndex, 1, message)
    }
    return _.assign(doc._source, { milestones })
  }

  // NOTE Disable indexing milestones when create at the moment, as it's now being indexed inside Project Service.
  //      It's because adding a milestones may cause cascading updates of other milestones and in such cases we are doing
  //      one ES index call instead of multiple calls. Otherwise ES may fail with error `version conflict`.
  //      This would be turned on back, as soon as we get rid of such cascading updates inside Project Service.
  //
  // await helper.updateTimelineESPromise(message.timelineId, updateDocPromise)
  // logger.debug(`Milestone created successfully in elasticsearch index, (milestoneId: ${message.id})`)
  logger.debug(`TEMPORARY SKIPPED: Milestone created successfully in elasticsearch index, (milestoneId: ${message.id})`)
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
    const milestones = _.map(doc._source.milestones, (single) => {
      if (single.id === message.id) {
        return _.assign(single, message)
      }
      return single
    })
    return _.assign(doc._source, { milestones })
  }

  // NOTE Disable indexing milestones when update at the moment, as it's now being indexed inside Project Service.
  //      It's because updating a milestones may cause cascading updates of other milestones and in such cases we are doing
  //      one ES index call instead of multiple calls. Otherwise ES may fail with error `version conflict`.
  //      This would be turned on back, as soon as we get rid of such cascading updates inside Project Service.
  //
  // await helper.updateTimelineESPromise(message.timelineId, updateDocPromise)
  // logger.debug(`Milestone updated successfully in elasticsearch index, (milestoneId: ${message.id})`)
  logger.debug(`TEMPORARY SKIPPED: Milestone updated successfully in elasticsearch index, (milestoneId: ${message.id})`)
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
    const milestones = _.filter(doc._source.milestones, single => single.id !== message.id)
    return _.assign(doc._source, { milestones })
  }

  await helper.updateTimelineESPromise(message.timelineId, updateDocPromise)
  logger.debug(`Milestone deleted successfully in elasticsearch index, (milestoneId: ${message.id})`)
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
