/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')
const constants = require('../constants')

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
function updateSchema () {
  return createIdSchema().keys({
    title: Joi.string().required(),
    description: Joi.string().optional().allow(null).allow(''),
    allowedUsers: Joi.array().items(Joi.number().integer().positive()).allow(null).default(null),
    tags: Joi.array().items(Joi.string()).optional().allow(null)
  })
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return updateSchema().keys({
    category: Joi.string().optional().allow(null).allow(''),
    size: Joi.number().optional().allow(null),
    contentType: Joi.string().optional().allow(null).when('type', { is: constants.ATTACHMENT_TYPES.FILE, then: Joi.string().required() }),
    path: Joi.string().required(),
    type: Joi.string().valid(_.values(constants.ATTACHMENT_TYPES)),
    tags: Joi.array().items(Joi.string()).optional().allow(null)
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
    const attachments = _.isArray(doc._source.attachments) ? doc._source.attachments : []
    const existingAttachmentIndex = _.findIndex(attachments, p => p.id === message.id)// if attachment does not exists already
    if (existingAttachmentIndex === -1) {
      attachments.push(message)
    } else { // if attachment already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously attachment was not removed from the index but deleted
      // from the database
      attachments.splice(existingAttachmentIndex, 1, message)
    }
    return _.assign(doc._source, { attachments })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)

  logger.debug(`Project attachment created successfully in elasticsearch index, (projectAttachmentId: ${message.id})`)
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
    const attachments = _.map(doc._source.attachments, (single) => {
      if (single.id === message.id) {
        return _.merge(single, message)
      }
      return single
    })
    return _.assign(doc._source, { attachments })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project attachment updated successfully in elasticsearch index, (projectAttachmentId: ${message.id})`)
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
    const attachments = _.filter(doc._source.attachments, single => single.id !== message.id)
    return _.assign(doc._source, { attachments })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project attachment deleted successfully in elasticsearch index, (projectAttachmentId: ${message.id})`)
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
