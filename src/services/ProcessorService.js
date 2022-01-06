/**
 * Service for challenge Elasticsearch processor.
 */

const Joi = require('joi')
const _ = require('lodash')
const config = require('config')

const logger = require('../common/logger')
const { RESOURCES } = require('../constants')

const ProcessorServiceProject = require('./ProcessorServiceProject')
const ProcessorServiceProjectTemplate = require('./ProcessorServiceProjectTemplate')
const ProcessorServiceProjectType = require('./ProcessorServiceProjectType')
const ProcessorServiceOrgConfig = require('./ProcessorServiceOrgConfig')
const ProcessorServiceProjectForm = require('./ProcessorServiceProjectForm')
const ProcessorServiceProjectPriceConfig = require('./ProcessorServiceProjectPriceConfig')
const ProcessorServiceProjectPlanConfig = require('./ProcessorServiceProjectPlanConfig')
const ProcessorServiceProductTemplate = require('./ProcessorServiceProductTemplate')
const ProcessorServiceProductCategory = require('./ProcessorServiceProductCategory')
const ProcessorServiceAttachment = require('./ProcessorServiceAttachment')
const ProcessorServicePhase = require('./ProcessorServicePhase')
const ProcessorServiceProjectMember = require('./ProcessorServiceProjectMember')
const ProcessorServicePhaseProduct = require('./ProcessorServicePhaseProduct')
const ProcessorServiceTimeline = require('./ProcessorServiceTimeline')
const ProcessorServiceMilestone = require('./ProcessorServiceMilestone')
const ProcessorServiceMilestoneTemplate = require('./ProcessorServiceMilestoneTemplate')
const ProcessorServiceProjectMemberInvite = require('./ProcessorServiceProjectMemberInvite')
const ProcessorServiceCustomerPayment = require('./ProcessorServiceCustomerPayment')

/**
 * Create schema.
 * @return {Void} schema
 */
function kafkaSchema () {
  return Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().valid(config.KAFKA_MESSAGE_ORIGINATOR).required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

const MappingResourceFunction = {
  [RESOURCES.PROJECT]: ProcessorServiceProject,
  [RESOURCES.PROJECT_TEMPLATE]: ProcessorServiceProjectTemplate,
  [RESOURCES.PROJECT_TYPE]: ProcessorServiceProjectType,
  [RESOURCES.ORG_CONFIG]: ProcessorServiceOrgConfig,
  [RESOURCES.FORM_VERSION]: ProcessorServiceProjectForm,
  [RESOURCES.FORM_REVISION]: ProcessorServiceProjectForm,
  [RESOURCES.PRICE_CONFIG_VERSION]: ProcessorServiceProjectPriceConfig,
  [RESOURCES.PRICE_CONFIG_REVISION]: ProcessorServiceProjectPriceConfig,
  [RESOURCES.PLAN_CONFIG_VERSION]: ProcessorServiceProjectPlanConfig,
  [RESOURCES.PLAN_CONFIG_REVISION]: ProcessorServiceProjectPlanConfig,
  [RESOURCES.PRODUCT_TEMPLATE]: ProcessorServiceProductTemplate,
  [RESOURCES.PRODUCT_CATEGORY]: ProcessorServiceProductCategory,
  [RESOURCES.ATTACHMENT]: ProcessorServiceAttachment,
  [RESOURCES.PHASE]: ProcessorServicePhase,
  [RESOURCES.PROJECT_MEMBER]: ProcessorServiceProjectMember,
  [RESOURCES.PHASE_PRODUCT]: ProcessorServicePhaseProduct,
  [RESOURCES.TIMELINE]: ProcessorServiceTimeline,
  [RESOURCES.MILESTONE]: ProcessorServiceMilestone,
  [RESOURCES.MILESTONE_TEMPLATE]: ProcessorServiceMilestoneTemplate,
  [RESOURCES.CUSTOMER_PAYMENT]: ProcessorServiceCustomerPayment,
  [RESOURCES.PROJECT_MEMBER_INVITE]: ProcessorServiceProjectMemberInvite
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the challenge created message
 * @return {Void} no return
 */
async function create (message) {
  const { payload } = message
  if (MappingResourceFunction[payload.resource]) {
    await MappingResourceFunction[payload.resource].create(_.omit(payload, ['resource']))
  } else {
    throw new Error(`Invalid topic resource: ${payload.resource}`)
  }
}

create.schema = {
  message: kafkaSchema()
}

/**
 * Update message in Elasticsearch.
 * @param {Object} message the challenge updated message
 * @return {Void} no return
 */
async function update (message) {
  const { payload } = message
  if (MappingResourceFunction[payload.resource]) {
    await MappingResourceFunction[payload.resource].update(_.omit(payload, ['resource']))
  } else {
    throw new Error(`Invalid topic resource: ${payload.resource}`)
  }
}

update.schema = {
  message: kafkaSchema()
}

/**
 * Delete message in Elasticsearch.
 * @param {Object} message the challenge deleted message
 * @return {Void} no return
 */
async function deleteMessage (message) {
  const { payload } = message
  if (MappingResourceFunction[payload.resource]) {
    await MappingResourceFunction[payload.resource].deleteMessage(_.omit(payload, ['resource']))
  } else {
    throw new Error(`Invalid topic resource: ${payload.resource}`)
  }
}

deleteMessage.schema = {
  message: kafkaSchema()
}

// Exports
module.exports = {
  create,
  update,
  deleteMessage
}

logger.buildService(module.exports)
