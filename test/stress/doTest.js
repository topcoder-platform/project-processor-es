global.Promise = require('bluebird')
const config = require('config')
const Kafka = require('no-kafka')
const helper = require('../../src/common/helper')
const testHelper = require('../common/testHelper')
const _ = require('lodash')
const moment = require('moment')
const constants = require('../../src/constants')

const producer = new Kafka.Producer({
  connectionString: config.KAFKA_URL,
  handlerConcurrency: 1,
  groupId: 'project-api'
})

const esClient = helper.getESClient()

async function createTimeline () {
  let now = moment().format()

  const timelinePayload = {
    'resource': constants.RESOURCES.TIMELINE,
    'createdAt': now,
    'updatedAt': now,
    'timestamp': now,
    'id': '1',
    'name': 'stress test timeline',
    'description': 'description',
    'startDate': now,
    'endDate': moment().add(7, 'days').format(),
    'reference': 'project',
    'referenceId': 1,
    'createdBy': 40051336,
    'updatedBy': 40051336,
    'milestones': []
  }

  const lastEndDate = moment().add(3, 'hours')

  _.forEach(_.range(1, config.STRESS_BASIC_QTY * 2 + 1), (i) => {
    const milestonePayload = {
      'resource': constants.RESOURCES.MILESTONE,
      'timelineId': '1',
      'createdAt': now,
      'updatedAt': now,
      'startDate': lastEndDate.format(),
      'createdBy': 40051333,
      'updatedBy': 40051333,
      'hidden': false,
      'id': i,
      'name': 'original milestone ' + i,
      'description': 'description',
      'duration': 3,
      'completionDate': '2021-06-30T00:00:00.000Z',
      'status': 'open',
      'type': 'type3',
      'details': {
        'detail1': {
          'subDetail1C': 3
        },
        'detail2': [
          2,
          3,
          4
        ]
      },
      'order': 1,
      'plannedText': 'plannedText 3',
      'activeText': 'activeText 3',
      'completedText': 'completedText 3',
      'blockedText': 'blockedText 3',
      'actualStartDate': null
    }

    lastEndDate.add(4, 'hours')

    milestonePayload.endDate = lastEndDate.format()

    timelinePayload.milestones.push(milestonePayload)
  })

  return esClient.create({
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: '1',
    body: timelinePayload,
    refresh: 'wait_for'
  })
}

function shuffleArray (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

async function deleteMilestones (ids) {
  const deletionRequests = _.map(ids, (i) => {
    const payload = {
      'resource': constants.RESOURCES.MILESTONE,
      'timelineId': '1',
      'id': i
    }

    const deleteMsg = {
      'topic': config.DELETE_DATA_TOPIC,
      'originator': 'project-api',
      'timestamp': moment().format(),
      'mime-type': 'application/json',
      'payload': payload
    }
    return producer.send({
      'topic': config.DELETE_DATA_TOPIC,
      'message': {
        'value': JSON.stringify(deleteMsg)
      }
    })
  })
  return Promise.all(deletionRequests)
}

async function updateMilestones (ids) {
  const now = moment().format()

  const updateRequests = _.map(ids, (i) => {
    const payload = {
      'resource': constants.RESOURCES.MILESTONE,
      'timelineId': '1',
      'id': i,
      'name': 'updated milestone ' + i,
      'duration': 4,
      'status': 'open',
      'type': 'type3',
      'order': 1,
      'plannedText': 'planned text 3',
      'activeText': 'active text 3',
      'completedText': ' completed text 3',
      'blockedText': 'blocked text 3'
    }
    const updateMsg = {
      'topic': config.UPDATE_DATA_TOPIC,
      'originator': 'project-api',
      'timestamp': now,
      'mime-type': 'application/json',
      'payload': payload
    }
    return producer.send({
      'topic': config.UPDATE_DATA_TOPIC,
      'message': {
        'value': JSON.stringify(updateMsg)
      }
    })
  })

  return Promise.all(updateRequests)
}

async function createNewMilestones (ids) {
  const now = moment().format()
  const lastEndDate = moment().add(10, 'hours')

  const milestoneCreateRequests = _.map(ids, (i) => {
    const milestonePayload = {
      'resource': constants.RESOURCES.MILESTONE,
      'timelineId': '1',
      'createdAt': now,
      'updatedAt': now,
      'startDate': lastEndDate.format(),
      'createdBy': 40051333,
      'updatedBy': 40051333,
      'hidden': false,
      'id': i,
      'name': 'new milestone ' + i,
      'description': 'description',
      'duration': 3,
      'completionDate': '2021-06-30T00:00:00.000Z',
      'status': 'open',
      'type': 'type3',
      'details': {
        'detail1': {
          'subDetail1C': 3
        },
        'detail2': [
          2,
          3,
          4
        ]
      },
      'order': 1,
      'plannedText': 'plannedText 3',
      'activeText': 'activeText 3',
      'completedText': 'completedText 3',
      'blockedText': 'blockedText 3',
      'actualStartDate': null
    }

    lastEndDate.add(4, 'hours')

    milestonePayload.endDate = lastEndDate.format()

    const createMsg = {
      'topic': config.CREATE_DATA_TOPIC,
      'originator': 'project-api',
      'timestamp': moment().format(),
      'mime-type': 'application/json',
      'payload': milestonePayload
    }

    return producer.send({
      'topic': config.CREATE_DATA_TOPIC,
      'message': {
        'value': JSON.stringify(createMsg)
      }
    })
  })

  return Promise.all(milestoneCreateRequests)
}

async function sleep (n) {
  return new Promise((resolve) => {
    setTimeout(resolve, n)
  })
}

async function main () {
  await producer.init()
  console.log('Creating initial data...')
  await createTimeline()
  console.log('Initial data is created.')

  const ids = shuffleArray(_.range(1, config.STRESS_BASIC_QTY * 2 + 1))
  const idsToDelete = ids.slice(0, config.STRESS_BASIC_QTY)
  const idsToCreate = _.map(idsToDelete, (i) => i + 10000)
  const idsToUpdate = ids.slice(config.STRESS_BASIC_QTY)

  console.log('Running multiple operations...')
  await Promise.all([
    deleteMilestones(idsToDelete),
    updateMilestones(idsToUpdate),
    createNewMilestones(idsToCreate)
  ])

  console.log(`Waiting for ${config.STRESS_TESTER_TIMEOUT} seconds before validating the result data...`)
  await sleep(1000 * config.STRESS_TESTER_TIMEOUT)

  const timeline = await testHelper.getTimelineESData('1')

  const milestones = {}

  _.forEach(timeline.milestones, (ms) => {
    milestones[ms.id] = ms
  })

  _.forEach(idsToDelete, (i) => {
    if (milestones[i]) {
      console.error(`milestone with id: ${i} not deleted`)
    }
  })

  _.forEach(idsToUpdate, (i) => {
    if (!(milestones[i] && milestones[i].name === 'updated milestone ' + i)) {
      console.error(`milestone with id: ${i} not updated`)
    }
  })

  _.forEach(idsToCreate, (i) => {
    if (!(milestones[i] && milestones[i].name === 'new milestone ' + i)) {
      console.error(`milestone with id: ${i} not created`)
    }
  })
}

main().then(() => {
  console.log('done')
  process.exit(0)
}, (e) => {
  console.log(e)
  process.exit(1)
})
