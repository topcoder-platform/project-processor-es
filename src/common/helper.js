/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('elasticsearch')
const _ = require('lodash')
const tcCoreLib = require('tc-core-library-js')
const urlencode = require('urlencode')

const logger = require('./logger')

AWS.config.region = config.get('esConfig.AWS_REGION')
// ES Client mapping
const esClients = {}

const m2m = tcCoreLib.auth.m2m(config)
const tcCoreLibUtil = tcCoreLib.util(config)

/**
 * Get machine to machine token.
 * @returns {Promise} promise which resolves to the m2m token
 */
async function getM2MToken () {
  return m2m.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Get ES Client
 * @return {Object} Elastic Host Client Instance
 */
function getESClient () {
  const esHost = config.get('esConfig.HOST')
  if (!esClients.client) {
    // AWS ES configuration is different from other providers
    if (/.*amazonaws.*/.test(esHost)) {
      esClients.client = elasticsearch.Client({
        apiVersion: config.get('esConfig.API_VERSION'),
        hosts: esHost,
        connectionClass: require('http-aws-es'),
        amazonES: {
          region: config.get('esConfig.AWS_REGION'),
          credentials: new AWS.EnvironmentCredentials('AWS')
        }
      })
    } else {
      esClients.client = new elasticsearch.Client({
        apiVersion: config.get('esConfig.API_VERSION'),
        hosts: esHost
      })
    }
  }
  return esClients.client
}

/**
 * Update project es promise
 * @param {Integer} projectId project id
 * @param {Promise} updateDocHandler update doc handler
 * @return {Promise} updateDocHandler update doc es
 */
async function updateProjectESPromise (projectId, updateDocHandler) {
  const client = getESClient()
  const doc = await client.get({
    index: config.get('esConfig.ES_PROJECT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: projectId
  })
  const updatedDoc = await updateDocHandler(doc)
  return client.update({
    index: config.get('esConfig.ES_PROJECT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: projectId,
    body: { doc: updatedDoc }
  })
}

/**
 * Update timeline es promise
 * @param {Integer} timelineId timeline id
 * @param {Promise} updateDocHandler update doc handler
 * @return {Promise} updateDocHandler update doc es
 */
async function updateTimelineESPromise (timelineId, updateDocHandler) {
  const client = getESClient()
  const doc = await client.get({
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: timelineId
  })
  const updatedDoc = await updateDocHandler(doc)
  return client.update({
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: timelineId,
    body: { doc: updatedDoc }
  })
}

/**
 * Update timeline es promise
 * @param {Promise} updateDocHandler update doc handler
 * @return {Promise} updateDocHandler update doc es
 */
async function updateMetadadaESPromise (updateDocHandler) {
  const client = getESClient()
  let doc
  try {
    doc = await client.get({
      index: config.get('esConfig.ES_METADATA_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: config.get('esConfig.ES_METADATA_DEFAULT_ID')
    })
  } catch (e) {
    logger.info('No metadata found. Creating the metadata.')
  }
  if (!doc) {
    doc = await client.create({
      index: config.get('esConfig.ES_METADATA_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: config.get('esConfig.ES_METADATA_DEFAULT_ID'),
      body: {
        id: config.get('esConfig.ES_METADATA_DEFAULT_ID')
      }
    })

    doc = await client.get({
      index: config.get('esConfig.ES_METADATA_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: config.get('esConfig.ES_METADATA_DEFAULT_ID')
    })
  }
  const updatedDoc = await updateDocHandler(doc)
  return client.update({
    index: config.get('esConfig.ES_METADATA_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: config.get('esConfig.ES_METADATA_DEFAULT_ID'),
    body: { doc: updatedDoc }
  })
}

/**
 * Retrieve member details from userIds
 *
 * @param {Array} userIds the list of userIds
 * @returns {Promise} the member details
 */
async function getMemberDetailsByUserIds (userIds) {
  try {
    const token = await getM2MToken()
    const httpClient = tcCoreLibUtil.getHttpClient({ id: `projectMemberService_${userIds.join('_')}`, log: logger })
    return httpClient.get(`${config.MEMBER_SERVICE_ENDPOINT}/_search`, {
      params: {
        query: `${_.map(userIds, id => `userId:${id}`).join(urlencode(' OR ', 'utf8'))}`,
        fields: 'userId,handle,firstName,lastName,email'
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).then(res => _.get(res, 'data.result.content', null))
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Populate member with user details
 *
 * @param {Object} member the member object
 * @returns {Object} the member object with details
 */
async function populateMemberWithUserDetails (member) {
  try {
    const membersDetails = await getMemberDetailsByUserIds([member.userId])
    const memberDetails = membersDetails[0]
    if (memberDetails) {
      logger.debug(`Successfully got user details for member (userId:${member.userId})`)
      return _.merge(member, _.pick(memberDetails, 'handle', 'firstName', 'lastName', 'email'))
    } else {
      throw new Error(`Didn't fine user details for member (userId:${member.userId})`)
    }
  } catch (err) {
    logger.error(`Cannot populate member (userId:${member.userId}) with user details.`)
    logger.debug(`Error during populating member (userId:${member.userId}) with user details`, err)
    return member
  }
}

module.exports = {
  getESClient,
  updateProjectESPromise,
  updateTimelineESPromise,
  updateMetadadaESPromise,
  getMemberDetailsByUserIds,
  populateMemberWithUserDetails
}
