/**
 * The test cases for TC timeline processor using real Elasticsearch.
 */

// During tests the node env is set to test
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const { expect } = require('chai')
const ProcessorService = require('../../src/services/ProcessorService')
const testHelper = require('../common/testHelper')

const {
  metadataId,
  notFoundId,
  milestoneTemplateId,
  productTemplateId,
  projectFormRevisionId,
  projectFormVersionId,
  projectPlanConfigRevisionId,
  projectPlanConfigVersionId,
  projectPriceConfigRevisionId,
  projectPriceConfigVersionId,
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
  milestoneTemplateUpdatedMessage,
  milestoneTemplateCreatedMessage,
  milestoneTemplateDeletedMessage
} = require('../common/testData')

describe('TC Milestone Template Topic Tests', () => {
  it('create milestone template message', async () => {
    await ProcessorService.create(milestoneTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.milestoneTemplates, { id: milestoneTemplateId }),
      milestoneTemplateCreatedMessage.payload,
      _.keys(_.omit(milestoneTemplateCreatedMessage.payload, ['resource'])))
  })

  it('create milestone template message - already exists', async () => {
    await ProcessorService.create(milestoneTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.milestoneTemplates, { id: milestoneTemplateId }),
      milestoneTemplateCreatedMessage.payload,
      _.keys(_.omit(milestoneTemplateCreatedMessage.payload, ['resource'])))
  })

  it('update milestone template message', async () => {
    await ProcessorService.update(milestoneTemplateUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.milestoneTemplates, { id: milestoneTemplateId }),
      milestoneTemplateUpdatedMessage.payload,
      _.keys(_.omit(milestoneTemplateUpdatedMessage.payload, ['resource'])))
  })

  it('update milestone template message - not found', async () => {
    const message = _.cloneDeep(milestoneTemplateUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.milestoneTemplates, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete milestone template message', async () => {
    await ProcessorService.deleteMessage(milestoneTemplateDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.milestoneTemplates, { id: milestoneTemplateId })).to.be.an('undefined')
  })
})

describe('TC Product Category Topic Tests', () => {
  it('create product category message', async () => {
    await ProcessorService.create(productCategoryCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.productCategories, { key: productCategoryKey }),
      productCategoryCreatedMessage.payload,
      _.keys(_.omit(productCategoryCreatedMessage.payload, ['resource'])))
  })

  it('create product category message - already exists', async () => {
    await ProcessorService.create(productCategoryCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.productCategories, { key: productCategoryKey }),
      productCategoryCreatedMessage.payload,
      _.keys(_.omit(productCategoryCreatedMessage.payload, ['resource'])))
  })

  it('update product category message', async () => {
    await ProcessorService.update(productCategoryUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.productCategories, { key: productCategoryKey }),
      productCategoryUpdatedMessage.payload,
      _.keys(_.omit(productCategoryUpdatedMessage.payload, ['resource'])))
  })

  it('update product category message - not found', async () => {
    const message = _.cloneDeep(productCategoryUpdatedMessage)
    message.payload.key = productCategoryNotFoundKey
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.productCategories, { key: productCategoryNotFoundKey })).to.be.an('undefined')
  })

  it('delete product category message', async () => {
    await ProcessorService.deleteMessage(productCategoryDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.productCategories, { key: productCategoryKey })).to.be.an('undefined')
  })
})

describe('TC Product Template Topic Tests', () => {
  it('create product template message', async () => {
    await ProcessorService.create(productTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.productTemplates, { id: productTemplateId }),
      productTemplateCreatedMessage.payload,
      _.keys(_.omit(productTemplateCreatedMessage.payload, ['resource'])))
  })

  it('create product template message - already exists', async () => {
    await ProcessorService.create(productTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.productTemplates, { id: productTemplateId }),
      productTemplateCreatedMessage.payload,
      _.keys(_.omit(productTemplateCreatedMessage.payload, ['resource'])))
  })

  it('update product template message', async () => {
    await ProcessorService.update(productTemplateUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.productTemplates, { id: productTemplateId }),
      productTemplateUpdatedMessage.payload,
      _.keys(_.omit(productTemplateUpdatedMessage.payload, ['resource'])))
  })

  it('update product template message - not found', async () => {
    const message = _.cloneDeep(productTemplateUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.productTemplates, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete product template message', async () => {
    await ProcessorService.deleteMessage(productTemplateDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.productTemplates, { id: productTemplateId })).to.be.an('undefined')
  })
})

describe('TC Project Form Revision Topic Tests', () => {
  it('create project form revision message', async () => {
    await ProcessorService.create(projectFormRevisionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.forms, { id: projectFormRevisionId }),
      projectFormRevisionCreatedMessage.payload,
      _.keys(_.omit(projectFormRevisionCreatedMessage.payload, ['resource'])))
  })

  it('create project form revision message - already exists', async () => {
    await ProcessorService.create(projectFormRevisionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.forms, { id: projectFormRevisionId }),
      projectFormRevisionCreatedMessage.payload,
      _.keys(_.omit(projectFormRevisionCreatedMessage.payload, ['resource'])))
  })

  it('delete project form revision message', async () => {
    await ProcessorService.deleteMessage(projectFormRevisionDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.forms, { id: projectFormRevisionId })).to.be.an('undefined')
  })
})

describe('TC Project Form Version Topic Tests', () => {
  it('create project form version message', async () => {
    await ProcessorService.create(projectFormVersionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.forms, { id: projectFormVersionId }),
      projectFormVersionCreatedMessage.payload,
      _.keys(_.omit(projectFormVersionCreatedMessage.payload, ['resource'])))
  })

  it('create project form version message - already exists', async () => {
    await ProcessorService.create(projectFormVersionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.forms, { id: projectFormVersionId }),
      projectFormVersionCreatedMessage.payload,
      _.keys(_.omit(projectFormVersionCreatedMessage.payload, ['resource'])))
  })

  it('update project form version message', async () => {
    await ProcessorService.update(projectFormVersionUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.forms, { id: projectFormVersionId }),
      projectFormVersionUpdatedMessage.payload,
      _.keys(_.omit(projectFormVersionUpdatedMessage.payload, ['resource'])))
  })

  it('update project form version message - not found', async () => {
    const message = _.cloneDeep(projectFormVersionUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.forms, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete project form version message', async () => {
    await ProcessorService.deleteMessage(projectFormVersionDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.forms, { id: projectFormVersionId })).to.be.an('undefined')
  })
})

describe('TC Project Project Plan Config Revision Topic Tests', () => {
  it('create project project plan config revision message', async () => {
    await ProcessorService.create(projectPlanConfigRevisionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.planConfigs, { id: projectPlanConfigRevisionId }),
      projectPlanConfigRevisionCreatedMessage.payload,
      _.keys(_.omit(projectPlanConfigRevisionCreatedMessage.payload, ['resource'])))
  })

  it('create project project plan config revision message - already exists', async () => {
    await ProcessorService.create(projectPlanConfigRevisionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.planConfigs, { id: projectPlanConfigRevisionId }),
      projectPlanConfigRevisionCreatedMessage.payload,
      _.keys(_.omit(projectPlanConfigRevisionCreatedMessage.payload, ['resource'])))
  })

  it('delete project project plan config revision message', async () => {
    await ProcessorService.deleteMessage(projectPlanConfigRevisionDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.planConfigs, { id: projectPlanConfigRevisionId })).to.be.an('undefined')
  })
})

describe('TC Project Project Plan Config Version Topic Tests', () => {
  it('create project project plan config version message', async () => {
    await ProcessorService.create(projectPlanConfigVersionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.planConfigs, { id: projectPlanConfigVersionId }),
      projectPlanConfigVersionCreatedMessage.payload,
      _.keys(_.omit(projectPlanConfigVersionCreatedMessage.payload, ['resource'])))
  })

  it('create project project plan config version message - already exists', async () => {
    await ProcessorService.create(projectPlanConfigVersionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.planConfigs, { id: projectPlanConfigVersionId }),
      projectPlanConfigVersionCreatedMessage.payload,
      _.keys(_.omit(projectPlanConfigVersionCreatedMessage.payload, ['resource'])))
  })

  it('update project project plan config version message', async () => {
    await ProcessorService.update(projectPlanConfigVersionUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.planConfigs, { id: projectPlanConfigVersionId }),
      projectPlanConfigVersionUpdatedMessage.payload,
      _.keys(_.omit(projectPlanConfigVersionUpdatedMessage.payload, ['resource'])))
  })

  it('update project project plan config version message - not found', async () => {
    const message = _.cloneDeep(projectPlanConfigVersionUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.planConfigs, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete project project plan config version message', async () => {
    await ProcessorService.deleteMessage(projectPlanConfigVersionDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.planConfigs, { id: projectPlanConfigVersionId })).to.be.an('undefined')
  })
})

describe('TC Project Project Price Config Revision Topic Tests', () => {
  it('create project project price config revision message', async () => {
    await ProcessorService.create(projectPriceConfigRevisionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.priceConfigs, { id: projectPriceConfigRevisionId }),
      projectPriceConfigRevisionCreatedMessage.payload,
      _.keys(_.omit(projectPriceConfigRevisionCreatedMessage.payload, ['resource'])))
  })

  it('create project project price config revision message - already exists', async () => {
    await ProcessorService.create(projectPriceConfigRevisionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.priceConfigs, { id: projectPriceConfigRevisionId }),
      projectPriceConfigRevisionCreatedMessage.payload,
      _.keys(_.omit(projectPriceConfigRevisionCreatedMessage.payload, ['resource'])))
  })

  it('delete project project price config revision message', async () => {
    await ProcessorService.deleteMessage(projectPriceConfigRevisionDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.priceConfigs, { id: projectPriceConfigRevisionId })).to.be.an('undefined')
  })
})

describe('TC Project Project Price Config Version Topic Tests', () => {
  it('create project project price config version message', async () => {
    await ProcessorService.create(projectPriceConfigVersionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.priceConfigs, { id: projectPriceConfigVersionId }),
      projectPriceConfigVersionCreatedMessage.payload,
      _.keys(_.omit(projectPriceConfigVersionCreatedMessage.payload, ['resource'])))
  })

  it('create project project price config version message - already exists', async () => {
    await ProcessorService.create(projectPriceConfigVersionCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.priceConfigs, { id: projectPriceConfigVersionId }),
      projectPriceConfigVersionCreatedMessage.payload,
      _.keys(_.omit(projectPriceConfigVersionCreatedMessage.payload, ['resource'])))
  })

  it('update project project price config version message', async () => {
    await ProcessorService.update(projectPriceConfigVersionUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.priceConfigs, { id: projectPriceConfigVersionId }),
      projectPriceConfigVersionUpdatedMessage.payload,
      _.keys(_.omit(projectPriceConfigVersionUpdatedMessage.payload, ['resource'])))
  })

  it('update project project price config version message - not found', async () => {
    const message = _.cloneDeep(projectPriceConfigVersionUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.priceConfigs, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete project project price config version message', async () => {
    await ProcessorService.deleteMessage(projectPriceConfigVersionDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.priceConfigs, { id: projectPriceConfigVersionId })).to.be.an('undefined')
  })
})

describe('TC Project Org Config Topic Tests', () => {
  it('create project org config message', async () => {
    await ProcessorService.create(orgConfigCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.orgConfigs, { id: orgConfigId }),
      orgConfigCreatedMessage.payload,
      _.keys(_.omit(orgConfigCreatedMessage.payload, ['resource'])))
  })

  it('create project org config message - already exists', async () => {
    await ProcessorService.create(orgConfigCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.orgConfigs, { id: orgConfigId }),
      orgConfigCreatedMessage.payload,
      _.keys(_.omit(orgConfigCreatedMessage.payload, ['resource'])))
  })

  it('update project org config message', async () => {
    await ProcessorService.update(orgConfigUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.orgConfigs, { id: orgConfigId }),
      orgConfigUpdatedMessage.payload,
      _.keys(_.omit(orgConfigUpdatedMessage.payload, ['resource'])))
  })

  it('update project org config message - not found', async () => {
    const message = _.cloneDeep(orgConfigUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.orgConfigs, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete project org config message', async () => {
    await ProcessorService.deleteMessage(orgConfigDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.orgConfigs, { id: orgConfigId })).to.be.an('undefined')
  })
})

describe('TC Project Template Topic Tests', () => {
  it('create project template message', async () => {
    await ProcessorService.create(projectTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.projectTemplates, { id: projectTemplateId }),
      projectTemplateCreatedMessage.payload,
      _.keys(_.omit(projectTemplateCreatedMessage.payload, ['resource'])))
  })

  it('create project template add subCategory and metadata correctly', async () => {
    await ProcessorService.create(projectTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    let projectTemplate = _.find(data.projectTemplates, { id: projectTemplateId })
    expect(projectTemplate).to.have.property('subCategory')
    expect(projectTemplate).to.have.property('metadata')
    expect(projectTemplate.subCategory).to.eql('app')
    expect(projectTemplate.metadata).to.eql({})
  })

  it('create project template message - already exists', async () => {
    await ProcessorService.create(projectTemplateCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.projectTemplates, { id: projectTemplateId }),
      projectTemplateCreatedMessage.payload,
      _.keys(_.omit(projectTemplateCreatedMessage.payload, ['resource'])))
  })

  it('update project template message', async () => {
    await ProcessorService.update(projectTemplateUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.projectTemplates, { id: projectTemplateId }),
      projectTemplateUpdatedMessage.payload,
      _.keys(_.omit(projectTemplateUpdatedMessage.payload, ['resource'])))
  })

  it('update project template message - not found', async () => {
    const message = _.cloneDeep(projectTemplateUpdatedMessage)
    message.payload.id = notFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.projectTemplates, { id: notFoundId })).to.be.an('undefined')
  })

  it('delete project template message', async () => {
    await ProcessorService.deleteMessage(projectTemplateDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.projectTemplates, { id: projectTemplateId })).to.be.an('undefined')
  })
})

describe('TC Project Type Topic Tests', () => {
  it('create project type message', async () => {
    await ProcessorService.create(projectTypeCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.projectTypes, { key: projectTypeId }),
      projectTypeCreatedMessage.payload,
      _.keys(_.omit(projectTypeCreatedMessage.payload, ['resource'])))
  })

  it('create project type message - already exists', async () => {
    await ProcessorService.create(projectTypeCreatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.projectTypes, { key: projectTypeId }),
      projectTypeCreatedMessage.payload,
      _.keys(_.omit(projectTypeCreatedMessage.payload, ['resource'])))
  })

  it('update project type message', async () => {
    await ProcessorService.update(projectTypeUpdatedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    testHelper.expectObj(_.find(data.projectTypes, { key: projectTypeId }),
      projectTypeUpdatedMessage.payload,
      _.keys(_.omit(projectTypeUpdatedMessage.payload, ['resource'])))
  })

  it('update project type message - not found', async () => {
    const message = _.cloneDeep(projectTypeUpdatedMessage)
    message.payload.key = projectTypeNotFoundId
    await ProcessorService.update(message)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.projectTypes, { key: projectTypeNotFoundId })).to.be.an('undefined')
  })

  it('delete project type message', async () => {
    await ProcessorService.deleteMessage(projectTypeDeletedMessage)
    const data = await testHelper.getMetadataESData(metadataId)
    expect(_.find(data.projectTypes, { key: projectTypeId })).to.be.an('undefined')
  })
})
