/**
 * Configuration file to be used while running tests
 */

module.exports = {
  esConfig: {
    ES_PROJECT_INDEX: process.env.ES_PROJECT_INDEX || 'projects_test',
    ES_TIMELINE_INDEX: process.env.ES_TIMELINE_INDEX || 'timelines_test',
    ES_METADATA_INDEX: process.env.ES_METADATA_INDEX || 'metadata_test'
  }
}
