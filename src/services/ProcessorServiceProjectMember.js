/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')
const { PROJECT_MEMBER_ROLE } = require('../constants')

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
    isPrimary: Joi.boolean(),
    // unlike in Project Service endpoints, in this processor we should let create members with any roles
    // because Project Service may create members with any roles implicitly, when accepting invitations
    role: Joi.string().valid(_.values(PROJECT_MEMBER_ROLE)).required()
  })
}

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return createIdSchema().keys({
    role: Joi.string().valid(_.values(PROJECT_MEMBER_ROLE))
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
    const members = _.isArray(doc._source.members) ? doc._source.members : []
    const existingMemberIndex = _.findIndex(members, p => p.id === message.id)// if member does not exists already
    console.log(message)
    if (existingMemberIndex === -1) {
      if (!message.userId) {
        members.push(message)
        return
      }
      const memberDetails = await helper.getMemberDetailsByUserIds([message.userId])
      const messageWithDetails = _.merge(message, _.pick(memberDetails[0], 'handle', 'firstName', 'lastName', 'email'))
      members.push(messageWithDetails)
    } else { // if member already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously member was not removed from the index but deleted
      // from the database
      members.splice(existingMemberIndex, 1, message)
    }
    return _.assign(doc._source, { members })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)

  logger.debug(`Project member created successfully in elasticsearch index, (projectMemberId: ${message.id})`)
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
    const members = _.map(doc._source.members, (single) => {
      if (single.id === message.id) {
        return _.merge(single, message)
      }
      return single
    })
    return _.assign(doc._source, { members })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project member updated successfully in elasticsearch index, (projectMemberId: ${message.id})`)
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
    const members = _.filter(doc._source.members, single => single.id !== message.id)
    return _.assign(doc._source, { members })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Project member deleted successfully in elasticsearch index, (projectMemberId: ${message.id})`)
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
