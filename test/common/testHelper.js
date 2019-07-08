/**
 * Contains helper method for tests
 */

const _ = require('lodash')
const config = require('config')
// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('chai')

const helper = require('../../src/common/helper')

const client = helper.getESClient()

/**
 * Get project elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} the elastic search data of id of configured index type in configured index
 */
async function getProjectESData (id) {
  return client.getSource({
    index: config.get('esConfig.ES_PROJECT_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Get timeline elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} the elastic search data of id of configured index type in configured index
 */
async function getTimelineESData (id) {
  return client.getSource({
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Get metadata elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} the elastic search data of id of configured index type in configured index
 */
async function getMetadataESData (id) {
  return client.getSource({
    index: config.get('esConfig.ES_METADATA_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Expect given objects are equal, ignoring some fields if provided.
 * @param {Object} obj1 obj1
 * @param {Object} obj2 obj2
 * @param {Object} compareFields compare fields
 * @returns {ExpectStatic} the elastic search data of id of configured index type in configured index
 */
function expectObj (obj1, obj2, compareFields) {
  let o1 = _.pick(obj1, _.identity)
  let o2 = _.pick(obj2, _.identity)
  if (compareFields) {
    o1 = _.pick(o1, compareFields)
    o2 = _.pick(o2, compareFields)
  }

  expect(_.isEqual(o1, o2)).to.equal(true)
}

module.exports = {
  getProjectESData,
  getTimelineESData,
  getMetadataESData,
  expectObj
}
