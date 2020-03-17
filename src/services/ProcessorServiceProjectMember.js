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
    let member = message

    // try to populate member with user details
    // the code should move on, as it's not critical and is only used for searching at the moment
    try {
      const membersDetails = await helper.getMemberDetailsByUserIds([message.userId])
      const memberDetails = membersDetails[0]
      if (memberDetails) {
        member = _.merge(message, _.pick(memberDetails, 'handle', 'firstName', 'lastName', 'email'))
        logger.debug(`Successfully got user details for member (userId:${message.userId})`)
      } else {
        throw new Error(`Didn't fine user details for member (userId:${message.userId})`)
      }
    } catch (err) {
      logger.error(`Cannot populate member (userId:${message.userId}) with user details.`)
      logger.debug(`Error during populating member (userId:${message.userId}) with user details`, err)
    }

    if (existingMemberIndex === -1) {
      members.push(member)
    } else { // if member already exists, ideally we should never land here, but code handles the buggy indexing
      // replaces the old inconsistent index where previously member was not removed from the index but deleted
      // from the database
      members.splice(existingMemberIndex, 1, member)
    }

    // sometimes we have issue that when member accepts invitation the invitation is somehow
    // is not removed from the ES, so here we are making sure that invite is removed when we are adding member
    try { // make sure that this logic never cause an error in member adding process
      const invites = _.filter(doc._source.invites, (invite) => (
        invite.email === member.email || invite.userId === member.userId
      ))

      if (invites.length > 0) {
        logger.warn(`There are ${invites.length} invite(s) are not yet removed` +
          ` for member.id: ${member.id} member.userId: ${member.userId}.`)

        for (let i = 0; i < invites.length; i++) {
          const invite = invites[i]
          logger.debug(`Removing invite.id: ${invite.id} for member.id: ${member.id} member.userId: ${member.userId}.`)
          try {
            const message = { id: invite.id }
            const updateDocHandler = helper.removeInvitePromise(message)
            await updateDocHandler(doc)
            logger.debug(`Successfully removed invite.id: ${invite.id}.`)
          } catch (err) {
            logger.error(`Failed removing invite.id: ${invite.id}. ${err}`)
          }
        }
      }
    } catch (err) {
      logger.error(`Error during removing existent invites for added member: ${err}`)
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
