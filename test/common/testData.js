/*
 * Test data to be used in tests
 */
const _ = require('lodash')
const config = require('config')

/**
* get random value
* @param {integer} max max random value
* @return {integer} random value
*/
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const projectCreatedMessage = require('../data/project/project.action.create.json')
const projectUpdatedMessage = require('../data/project/project.action.update.json')
const projectDeletedMessage = require('../data/project/project.action.delete.json')

const attachmentCreatedMessage = require('../data/attachment/project.action.create.json')
const attachmentUpdatedMessage = require('../data/attachment/project.action.update.json')
const attachmentDeletedMessage = require('../data/attachment/project.action.delete.json')

const timelineCreatedMessage = require('../data/timeline/project.action.create.json')
const timelineUpdatedMessage = require('../data/timeline/project.action.update.json')
const timelineDeletedMessage = require('../data/timeline/project.action.delete.json')

const milestoneCreatedMessage = require('../data/milestone/project.action.create.json')
const milestoneUpdatedMessage = require('../data/milestone/project.action.update.json')
const milestoneDeletedMessage = require('../data/milestone/project.action.delete.json')

const milestoneTemplateCreatedMessage = require('../data/milestone.template/project.action.create.json')
const milestoneTemplateUpdatedMessage = require('../data/milestone.template/project.action.update.json')
const milestoneTemplateDeletedMessage = require('../data/milestone.template/project.action.delete.json')

const phaseCreatedMessage = require('../data/phase/project.action.create.json')
const phaseUpdatedMessage = require('../data/phase/project.action.update.json')
const phaseDeletedMessage = require('../data/phase/project.action.delete.json')

const phaseProductCreatedMessage = require('../data/phase.product/project.action.create.json')
const phaseProductUpdatedMessage = require('../data/phase.product/project.action.update.json')
const phaseProductDeletedMessage = require('../data/phase.product/project.action.delete.json')

const productTemplateCreatedMessage = require('../data/product.template/project.action.create.json')
const productTemplateUpdatedMessage = require('../data/product.template/project.action.update.json')
const productTemplateDeletedMessage = require('../data/product.template/project.action.delete.json')

const projectFormRevisionCreatedMessage = require(
  '../data/project.form.revision/project.action.create.json'
)
const projectFormRevisionDeletedMessage = require(
  '../data/project.form.revision/project.action.delete.json'
)

const projectFormVersionCreatedMessage = require('../data/project.form.version/project.action.create.json')
const projectFormVersionUpdatedMessage = require('../data/project.form.version/project.action.update.json')
const projectFormVersionDeletedMessage = require('../data/project.form.version/project.action.delete.json')

const projectPlanConfigRevisionCreatedMessage = require(
  '../data/project.planConfig.revision/project.action.create.json'
)
const projectPlanConfigRevisionDeletedMessage = require(
  '../data/project.planConfig.revision/project.action.delete.json'
)

const projectPlanConfigVersionCreatedMessage = require(
  '../data/project.planConfig.version/project.action.create.json'
)
const projectPlanConfigVersionUpdatedMessage = require(
  '../data/project.planConfig.version/project.action.update.json'
)
const projectPlanConfigVersionDeletedMessage = require(
  '../data/project.planConfig.version/project.action.delete.json'
)

const projectPriceConfigRevisionCreatedMessage = require(
  '../data/project.priceConfig.revision/project.action.create.json'
)
const projectPriceConfigRevisionDeletedMessage = require(
  '../data/project.priceConfig.revision/project.action.delete.json'
)

const projectPriceConfigVersionCreatedMessage = require(
  '../data/project.priceConfig.version/project.action.create.json'
)
const projectPriceConfigVersionUpdatedMessage = require(
  '../data/project.priceConfig.version/project.action.update.json'
)
const projectPriceConfigVersionDeletedMessage = require(
  '../data/project.priceConfig.version/project.action.delete.json'
)

const projectMemberCreatedMessage = require('../data/project.member/project.action.create.json')
const projectMemberUpdatedMessage = require('../data/project.member/project.action.update.json')
const projectMemberDeletedMessage = require('../data/project.member/project.action.delete.json')

const projectMemberInviteCreatedMessage = require(
  '../data/project.member.invite/project.action.create.json'
)
const projectMemberInviteUpdatedMessage = require(
  '../data/project.member.invite/project.action.update.json'
)
const projectMemberInviteDeletedMessage = require(
  '../data/project.member.invite/project.action.delete.json'
)
const orgConfigCreatedMessage = require('../data/project.orgConfig/project.action.create.json')
const orgConfigUpdatedMessage = require('../data/project.orgConfig/project.action.update.json')
const orgConfigDeletedMessage = require('../data/project.orgConfig/project.action.delete.json')

const projectTemplateCreatedMessage = require('../data/project.template/project.action.create.json')
const projectTemplateUpdatedMessage = require('../data/project.template/project.action.update.json')
const projectTemplateDeletedMessage = require('../data/project.template/project.action.delete.json')

const projectTypeCreatedMessage = require('../data/project.type/project.action.create.json')
const projectTypeUpdatedMessage = require('../data/project.type/project.action.update.json')
const projectTypeDeletedMessage = require('../data/project.type/project.action.delete.json')

const productCategoryCreatedMessage = require('../data/product.category/project.action.create.json')
const productCategoryUpdatedMessage = require('../data/product.category/project.action.update.json')
const productCategoryDeletedMessage = require('../data/product.category/project.action.delete.json')

const projectId = projectCreatedMessage.payload.id
const timelineId = timelineCreatedMessage.payload.id
const attachmentId = attachmentCreatedMessage.payload.id
const milestoneId = milestoneCreatedMessage.payload.id
const milestoneTemplateId = milestoneTemplateCreatedMessage.payload.id
const phaseId = phaseCreatedMessage.payload.id
const phaseProductId = phaseProductCreatedMessage.payload.id
const productTemplateId = productTemplateCreatedMessage.payload.id
const projectFormRevisionId = projectFormRevisionCreatedMessage.payload.id
const projectFormVersionId = projectFormVersionCreatedMessage.payload.id
const projectPlanConfigRevisionId = projectPlanConfigRevisionCreatedMessage.payload.id
const projectPlanConfigVersionId = projectPlanConfigVersionCreatedMessage.payload.id
const projectPriceConfigRevisionId = projectPriceConfigRevisionCreatedMessage.payload.id
const projectPriceConfigVersionId = projectPriceConfigVersionCreatedMessage.payload.id
const projectMemberInviteId = projectMemberInviteCreatedMessage.payload.id
const projectMemberId = projectMemberCreatedMessage.payload.id
const orgConfigId = orgConfigCreatedMessage.payload.id
const projectTemplateId = projectTemplateCreatedMessage.payload.id
const projectTypeId = projectTypeCreatedMessage.payload.key
const projectTypeNotFoundId = `${projectTypeCreatedMessage.payload.key}_notFound`
const productCategoryKey = productCategoryCreatedMessage.payload.key
const productCategoryNotFoundKey = `${productCategoryCreatedMessage.payload.key}_notFound`
const metadataId = config.get('esConfig.ES_METADATA_DEFAULT_ID')
let notFoundId = getRandomInt(10000000)
// we use projectId+1, timelineId+1, attachmentId+1,... to create another object if need
while (_.includes([
  projectId, projectId + 1,
  timelineId, timelineId + 1,
  attachmentId, attachmentId + 1,
  milestoneTemplateId, milestoneTemplateId + 1,
  phaseId, phaseId + 1,
  phaseProductId, phaseProductId + 1,
  productTemplateId, productTemplateId + 1,
  projectFormRevisionId, projectFormRevisionId + 1,
  projectFormVersionId, projectFormVersionId + 1,
  projectPlanConfigRevisionId, projectPlanConfigRevisionId + 1,
  projectPlanConfigVersionId, projectPlanConfigVersionId + 1,
  projectPriceConfigRevisionId, projectPriceConfigRevisionId + 1,
  projectPriceConfigVersionId, projectPriceConfigVersionId + 1,
  projectMemberId, projectMemberId + 1,
  projectMemberInviteId, projectMemberInviteId + 1,
  orgConfigId, orgConfigId + 1,
  projectTemplateId, projectTemplateId + 1
], notFoundId)) {
  notFoundId = getRandomInt(10000000)
}

module.exports = {
  metadataId,
  notFoundId,
  projectId,
  timelineId,
  attachmentId,
  milestoneId,
  milestoneTemplateId,
  phaseId,
  phaseProductId,
  productTemplateId,
  projectFormRevisionId,
  projectFormVersionId,
  projectPlanConfigRevisionId,
  projectPlanConfigVersionId,
  projectPriceConfigRevisionId,
  projectPriceConfigVersionId,
  projectMemberId,
  projectMemberInviteId,
  orgConfigId,
  projectTemplateId,
  projectTypeId,
  projectTypeNotFoundId,
  productCategoryKey,
  productCategoryNotFoundKey,
  productCategoryUpdatedMessage,
  productCategoryCreatedMessage,
  productCategoryDeletedMessage,
  projectTypeUpdatedMessage,
  projectTypeCreatedMessage,
  projectTypeDeletedMessage,
  projectTemplateUpdatedMessage,
  projectTemplateCreatedMessage,
  projectTemplateDeletedMessage,
  orgConfigUpdatedMessage,
  orgConfigCreatedMessage,
  orgConfigDeletedMessage,
  projectMemberInviteUpdatedMessage,
  projectMemberInviteCreatedMessage,
  projectMemberInviteDeletedMessage,
  projectMemberUpdatedMessage,
  projectMemberCreatedMessage,
  projectMemberDeletedMessage,
  projectPriceConfigVersionUpdatedMessage,
  projectPriceConfigVersionCreatedMessage,
  projectPriceConfigVersionDeletedMessage,
  projectPriceConfigRevisionCreatedMessage,
  projectPriceConfigRevisionDeletedMessage,
  projectPlanConfigVersionUpdatedMessage,
  projectPlanConfigVersionCreatedMessage,
  projectPlanConfigVersionDeletedMessage,
  projectPlanConfigRevisionCreatedMessage,
  projectPlanConfigRevisionDeletedMessage,
  projectFormVersionUpdatedMessage,
  projectFormVersionCreatedMessage,
  projectFormVersionDeletedMessage,
  projectFormRevisionCreatedMessage,
  projectFormRevisionDeletedMessage,
  productTemplateUpdatedMessage,
  productTemplateCreatedMessage,
  productTemplateDeletedMessage,
  phaseProductUpdatedMessage,
  phaseProductCreatedMessage,
  phaseProductDeletedMessage,
  phaseUpdatedMessage,
  phaseCreatedMessage,
  phaseDeletedMessage,
  milestoneTemplateUpdatedMessage,
  milestoneTemplateCreatedMessage,
  milestoneTemplateDeletedMessage,
  milestoneUpdatedMessage,
  milestoneCreatedMessage,
  milestoneDeletedMessage,
  projectCreatedMessage,
  projectUpdatedMessage,
  projectDeletedMessage,
  attachmentCreatedMessage,
  attachmentUpdatedMessage,
  attachmentDeletedMessage,
  timelineCreatedMessage,
  timelineUpdatedMessage,
  timelineDeletedMessage
}
