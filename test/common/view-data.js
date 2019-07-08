/**
 * This is used to view Elasticsearch data of given id of configured index type in configured index.
 * Usage:
 * node test/common/view-data {elasticsearch-id}
 */
const logger = require('../../src/common/logger')
const testHelper = require('./testHelper')

if (process.argv.length < 4) {
  logger.error('Missing argument for Elasticsearch index and id.')
  process.exit()
}

const viewDataProject = async () => {
  const data = await testHelper.getProjectESData(process.argv[3])
  logger.info('Elasticsearch Project data:')
  if (data) {
    logger.info(JSON.stringify(data, null, 4))
  }
}

const viewDataTimeline = async () => {
  const data = await testHelper.getTimelineESData(process.argv[3])
  logger.info('Elasticsearch Timeline data:')
  if (data) {
    logger.info(JSON.stringify(data, null, 4))
  }
}

const viewDataMetadata = async () => {
  const data = await testHelper.getMetadataESData(process.argv[3])
  logger.info('Elasticsearch Metadata data:')
  if (data) {
    logger.info(JSON.stringify(data, null, 4))
  }
}

if (process.argv[2].indexOf('projects') >= 0) {
  viewDataProject().then(() => {
    logger.info('Done!')
    process.exit()
  }).catch((e) => {
    if (e.statusCode === 404) {
      logger.info('The project data is not found.')
    } else {
      logger.logFullError(e)
    }
    process.exit()
  })
} else if (process.argv[2].indexOf('timelines') >= 0) {
  viewDataTimeline().then(() => {
    logger.info('Done!')
    process.exit()
  }).catch((e) => {
    if (e.statusCode === 404) {
      logger.info('The timeline data is not found.')
    } else {
      logger.logFullError(e)
    }
    process.exit()
  })
} else if (process.argv[2].indexOf('metadata') >= 0) {
  viewDataMetadata().then(() => {
    logger.info('Done!')
    process.exit()
  }).catch((e) => {
    if (e.statusCode === 404) {
      logger.info('The metadata data is not found.')
    } else {
      logger.logFullError(e)
    }
    process.exit()
  })
} else {
  logger.info('The Elasticsearch index is not found.')
  process.exit()
}
