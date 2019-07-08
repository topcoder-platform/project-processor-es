/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')

const logger = require('../common/logger')
const helper = require('../common/helper')
const { INVITE_STATUS } = require('../constants')

/**
 * create schema
 * @return {Object} the schema
 */
function createSchema () {
  return Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    projectId: Joi.number().integer().positive().required(),
    userId: Joi.number().optional().allow(null),
    email: Joi.string()
      .email()
      .optional()
      .allow(null),
    status: Joi.any()
      .valid(_.values(INVITE_STATUS))
      .required()
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
    // now merge the updated changes and reindex the document
    const invites = _.isArray(doc._source.invites) ? doc._source.invites : []
    invites.push(message)
    return _.assign(doc._source, { invites })
  }
  await helper.updateProjectESPromise(message.projectId, updateDocPromise)

  logger.debug(`Member invite created successfully in elasticsearch index, (memberInviteId: ${message.id})`)
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
    // now merge the updated changes and reindex the document
    const invites = _.isArray(doc._source.invites) ? doc._source.invites : []
    _.remove(invites, invite => (!!message.email && invite.email === message.email) ||
    (!!message.userId && invite.userId === message.userId))
    return _.assign(doc._source, { invites })
  }

  await helper.updateProjectESPromise(message.projectId, updateDocPromise)
  logger.debug(`Member invite updated successfully in elasticsearch index, (memberInviteId: ${message.id})`)
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
