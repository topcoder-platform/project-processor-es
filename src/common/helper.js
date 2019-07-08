/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('elasticsearch')

const logger = require('./logger')

AWS.config.region = config.get('esConfig.AWS_REGION')
// ES Client mapping
const esClients = {}

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

module.exports = {
  getESClient,
  updateProjectESPromise,
  updateTimelineESPromise,
  updateMetadadaESPromise
}
