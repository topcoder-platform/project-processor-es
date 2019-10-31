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
 * Expect given objects are equal, or only some fields should be tested if provided.
 *
 * @param {Object} target target
 * @param {Object} expected expected
 * @param {Object} compareFields compare fields
 */
function expectObj (target, expected, compareFields) {
  expect(target, 'expectObj(): "target" object should not be undefined').to.not.be.an('undefined')
  expect(expected, 'expectObj(): "expected" object should not be undefined').to.not.be.an('undefined')

  const targetClean = compareFields ? _.pick(target, compareFields) : target
  const expectedClean = compareFields ? _.pick(expected, compareFields) : expected

  // check if objects are deeply equal by values
  expect(targetClean).to.eql(expectedClean)
}

module.exports = {
  getProjectESData,
  getTimelineESData,
  getMetadataESData,
  expectObj
}
