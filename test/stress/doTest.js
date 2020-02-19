global.Promise = require('bluebird')
const config = require('config')
const Kafka = require('no-kafka')
const helper = require('../../src/common/helper')
const testHelper = require('../common/testHelper')
const _ = require('lodash')
const moment = require('moment')
const constants = require('../../src/constants')
const fs = require('fs')

const producer = new Kafka.Producer({
  connectionString: config.KAFKA_URL,
  handlerConcurrency: 1,
  groupId: "project-api"
})

const es_client = helper.getESClient()

async function createTimeline() {
  let now = moment().format();

  const timeline_payload = {
    "resource": constants.RESOURCES.TIMELINE,
    "createdAt": now,
    "updatedAt": now,
    "timestamp": now,
    "id": "1",
    "name": "stress test timeline",
    "description": "description",
    "startDate": now,
    "endDate": moment().add(7, "days").format(),
    "reference": "project",
    "referenceId": 1,
    "createdBy": 40051336,
    "updatedBy": 40051336,
    "milestones": []
  }

  const last_end_date = moment().add(3, "hours")

  _.forEach(_.range(1, config.STRESS_BASIC_QTY * 2 + 1), (i) => {

    const milestone_payload = {
      "resource": constants.RESOURCES.MILESTONE,
      "timelineId": "1",
      "createdAt": now,
      "updatedAt": now,
      "startDate": last_end_date.format(),
      "createdBy": 40051333,
      "updatedBy": 40051333,
      "hidden": false,
      "id": i,
      "name": "original milestone " + i,
      "description": "description",
      "duration": 3,
      "completionDate": "2021-06-30T00:00:00.000Z",
      "status": "open",
      "type": "type3",
      "details": {
        "detail1": {
          "subDetail1C": 3
        },
        "detail2": [
          2,
          3,
          4
        ]
      },
      "order": 1,
      "plannedText": "plannedText 3",
      "activeText": "activeText 3",
      "completedText": "completedText 3",
      "blockedText": "blockedText 3",
      "actualStartDate": null
    }

    last_end_date.add(4, "hours")

    milestone_payload.endDate = last_end_date.format()

    timeline_payload.milestones.push(milestone_payload)
  })

  return es_client.create({
    index: config.get('esConfig.ES_TIMELINE_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: "1",
    body: timeline_payload
  })
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

async function deleteMilestones(ids) {
  const deletion_requests = _.map(ids, (i) => {

    const payload = {
      "resource": constants.RESOURCES.MILESTONE,
      "timelineId": "1",
      "id": i
    }

    const delete_msg = {
      "topic": config.DELETE_DATA_TOPIC,
      "originator": "project-api",
      "timestamp": moment().format(),
      "mime-type": "application/json",
      "payload": payload
    }
    return producer.send({
      "topic": config.DELETE_DATA_TOPIC,
      "message": {
        "value": JSON.stringify(delete_msg)
      }
    })
  })
  return Promise.all(deletion_requests)
}

async function updateMilestones(ids) {
  const now = moment().format()

  const update_requests = _.map(ids, (i) => {

    const payload = {
      "resource": constants.RESOURCES.MILESTONE,
      "timelineId": "1",
      "id": i,
      "name": "updated milestone " + i,
      "duration": 4,
      "status": "open",
      "type": "type3",
      "order": 1,
      "plannedText": "planned text 3",
      "activeText": "active text 3",
      "completedText": " completed text 3",
      "blockedText": "blocked text 3"
    }
    const update_msg = {
      "topic": config.UPDATE_DATA_TOPIC,
      "originator": "project-api",
      "timestamp": moment().format(),
      "mime-type": "application/json",
      "payload": payload
    }
    return producer.send({
      "topic": config.UPDATE_DATA_TOPIC,
      "message": {
        "value": JSON.stringify(update_msg)
      }
    })
  })

  return Promise.all(update_requests)
}

async function createNewMilestones(ids) {
  const now = moment().format()
  const last_end_date = moment().add(10, "hours")

  const milestone_create_requests = _.map(ids, (i) => {

    const milestone_payload = {
      "resource": constants.RESOURCES.MILESTONE,
      "timelineId": "1",
      "createdAt": now,
      "updatedAt": now,
      "startDate": last_end_date.format(),
      "createdBy": 40051333,
      "updatedBy": 40051333,
      "hidden": false,
      "id": i,
      "name": "new milestone " + i,
      "description": "description",
      "duration": 3,
      "completionDate": "2021-06-30T00:00:00.000Z",
      "status": "open",
      "type": "type3",
      "details": {
        "detail1": {
          "subDetail1C": 3
        },
        "detail2": [
          2,
          3,
          4
        ]
      },
      "order": 1,
      "plannedText": "plannedText 3",
      "activeText": "activeText 3",
      "completedText": "completedText 3",
      "blockedText": "blockedText 3",
      "actualStartDate": null
    }

    last_end_date.add(4, "hours")

    milestone_payload.endDate = last_end_date.format()

    const create_msg = {
      "topic": config.CREATE_DATA_TOPIC,
      "originator": "project-api",
      "timestamp": moment().format(),
      "mime-type": "application/json",
      "payload": milestone_payload
    }

    return producer.send({
      "topic": config.CREATE_DATA_TOPIC,
      "message": {
        "value": JSON.stringify(create_msg)
      }
    })
  })

  return Promise.all(milestone_create_requests)
}

async function sleep(n) {
  return new Promise((resolve) => {
    setTimeout(resolve, n)
  })
}

async function main() {
  await producer.init()
  await createTimeline()

  console.log(`waiting for 5 seconds for timeline to be created`)
  await sleep(5000)
  console.log("queueing milestone operations")

  const ids = shuffleArray(_.range(1, config.STRESS_BASIC_QTY * 2 + 1))
  const ids_to_delete = ids.slice(0, config.STRESS_BASIC_QTY)
  const ids_to_create = _.map(ids_to_delete, (i) => i + 10000)
  const ids_to_update = ids.slice(config.STRESS_BASIC_QTY)

  await Promise.all([
    deleteMilestones(ids_to_delete),
    updateMilestones(ids_to_update),
    createNewMilestones(ids_to_create)
  ])

  console.log(`waiting for ${config.STRESS_TESTER_TIMEOUT} seconds...`)
  await sleep(1000 * config.STRESS_TESTER_TIMEOUT)

  const timeline = await testHelper.getTimelineESData("1")

  const milestones = {}

  _.forEach(timeline.milestones, (ms) => {
    milestones[ms.id] = ms
  })

  const errors = {
    deletion: [],
    updates: [],
    creation: []
  }

  _.forEach(ids_to_delete, (i) => {
    if (milestones[i]) {
      console.log(`milestone with id: ${i} not deleted`)
      errors.deletion.push(i)
    }
  })

  _.forEach(ids_to_update, (i) => {
    if (! (milestones[i] && milestones[i].name == 'updated milestone ' + i)) {
      console.log(`milestone with id: ${i} not updated`)
      errors.updates.push(i)
    }
  })

  _.forEach(ids_to_create, (i) => {
    if (! (milestones[i] && milestones[i].name == 'new milestone ' + i)) {
      console.log(`milestone with id: ${i} not created`)
      errors.creation.push(i)
    }
  })

  fs.writeFileSync(__dirname + "/stress_test_errors.json", JSON.stringify(errors, null, 4))
}

main().then(() => {
  console.log("done")
  process.exit(0)
}, (e) => {
  console.log(e)
  process.exit(1)
})
