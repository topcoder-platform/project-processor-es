/**
 * Sync the elastic search indices.
 * For the application to funtion properly it is necessary
 * that following indices are created in elasticsearch before running the application
 *
 * 1. projects: Index for projects. Logically corresponds to project model
 *              and serves as root.
 *              members and attachments will be stored as nested objects to parent document
 *
 */

const config = require('config')
const logger = require('../src/common/logger')
const helper = require('../src/common/helper')

const ES_PROJECT_INDEX = config.get('esConfig.ES_PROJECT_INDEX')
const ES_TIMELINE_INDEX = config.get('esConfig.ES_TIMELINE_INDEX')
const ES_METADATA_INDEX = config.get('esConfig.ES_METADATA_INDEX')
const ES_CUSTOMER_PAYMENT_INDEX = config.get('esConfig.ES_CUSTOMER_PAYMENT_INDEX')
const ES_TYPE = config.get('esConfig.ES_TYPE')

// create new elasticsearch client
// the client modifies the config object, so always passed the cloned object
const esClient = helper.getESClient()

/**
 * Get the request body for the specified index name
 * @private
 *
 * @param  {String}       indexName         the index name
 * @return {Object}                         the request body for the specified index name
 */
function getRequestBody (indexName) {
  const projectMapping = {
    properties: {
      actualPrice: {
        type: 'double'
      },
      attachments: {
        type: 'nested',
        properties: {
          category: {
            type: 'string',
            index: 'not_analyzed'
          },
          contentType: {
            type: 'string',
            index: 'not_analyzed'
          },
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          description: {
            type: 'string'
          },
          path: {
            type: 'string'
          },
          type: {
            type: 'string'
          },
          tags: {
            type: 'string'
          },
          id: {
            type: 'long'
          },
          projectId: {
            type: 'long'
          },
          size: {
            type: 'double'
          },
          title: {
            type: 'string'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },
      billingAccountId: {
        type: 'long'
      },
      bookmarks: {
        type: 'nested',
        properties: {
          address: {
            type: 'string'
          },
          title: {
            type: 'string'
          }
        }
      },
      cancelReason: {
        type: 'string'
      },
      challengeEligibility: {
        type: 'nested',
        properties: {
          groups: {
            type: 'long'
          },
          role: {
            type: 'string',
            index: 'not_analyzed'
          },
          users: {
            type: 'long'
          }
        }
      },
      createdAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      createdBy: {
        type: 'integer'
      },
      description: {
        type: 'string'
      },
      details: {
        type: 'nested',
        properties: {
          TBD_features: {
            type: 'nested',
            properties: {
              description: {
                type: 'string'
              },
              id: {
                type: 'integer'
              },
              isCustom: {
                type: 'boolean'
              },
              title: {
                type: 'string'
              }
            }
          },
          TBD_usageDescription: {
            type: 'string'
          },
          appDefinition: {
            properties: {
              goal: {
                properties: {
                  value: {
                    type: 'string'
                  }
                }
              },
              primaryTarget: {
                type: 'string'
              },
              users: {
                properties: {
                  value: {
                    type: 'string'
                  }
                }
              }
            }
          },
          hideDiscussions: {
            type: 'boolean'
          },
          products: {
            type: 'string'
          },
          summary: {
            type: 'string'
          },
          utm: {
            type: 'nested',
            properties: {
              code: {
                type: 'string'
              }
            }
          }
        }
      },
      directProjectId: {
        type: 'long'
      },
      estimatedPrice: {
        type: 'double'
      },
      external: {
        properties: {
          data: {
            type: 'string'
          },
          id: {
            type: 'string',
            index: 'not_analyzed'
          },
          type: {
            type: 'string',
            index: 'not_analyzed'
          }
        }
      },
      id: {
        type: 'long'
      },
      members: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          email: {
            type: 'string',
            index: 'not_analyzed'
          },
          firstName: {
            type: 'string'
          },
          handle: {
            type: 'string'
          },
          id: {
            type: 'long'
          },
          isPrimary: {
            type: 'boolean'
          },
          lastName: {
            type: 'string'
          },
          projectId: {
            type: 'long'
          },
          role: {
            type: 'string',
            index: 'not_analyzed'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          },
          userId: {
            type: 'long'
          }
        }
      },
      invites: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          email: {
            type: 'string',
            index: 'not_analyzed'
          },
          id: {
            type: 'long'
          },
          role: {
            type: 'string',
            index: 'not_analyzed'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          },
          userId: {
            type: 'long'
          }
        }
      },
      name: {
        type: 'string'
      },
      status: {
        type: 'string',
        index: 'not_analyzed'
      },
      terms: {
        type: 'string'
      },
      groups: {
        type: 'string'
      },
      type: {
        type: 'string',
        index: 'not_analyzed'
      },
      updatedAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      updatedBy: {
        type: 'integer'
      },
      lastActivityAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      lastActivityUserId: {
        type: 'string'
      },
      utm: {
        properties: {
          campaign: {
            type: 'string'
          },
          medium: {
            type: 'string'
          },
          source: {
            type: 'string'
          }
        }
      },
      phases: {
        type: 'nested',
        dynamic: true
      }
    }
  }

  const metadataMapping = {
    properties: {
      projectTemplates: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          key: {
            type: 'string',
            index: 'not_analyzed'
          },
          category: {
            type: 'string',
            index: 'not_analyzed'
          },
          subCategory: {
            type: 'string'
          },
          metadata: {
            type: 'object'
          },
          name: {
            type: 'string'
          },
          id: {
            type: 'long'
          },
          scope: {
            type: 'object'
          },
          form: {
            type: 'object'
          },
          priceConfig: {
            type: 'object'
          },
          planConfig: {
            type: 'object'
          },
          phases: {
            type: 'object'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },
      forms: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          key: {
            type: 'string',
            index: 'not_analyzed'
          },
          version: {
            type: 'integer'
          },
          revision: {
            type: 'integer'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },

      planConfigs: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          key: {
            type: 'string',
            index: 'not_analyzed'
          },
          version: {
            type: 'integer'
          },
          revision: {
            type: 'integer'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },

      priceConfigs: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          key: {
            type: 'string',
            index: 'not_analyzed'
          },
          version: {
            type: 'integer'
          },
          revision: {
            type: 'integer'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },

      orgConfigs: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          orgId: {
            type: 'string',
            index: 'not_analyzed'
          },
          configName: {
            type: 'string',
            index: 'not_analyzed'
          },
          configValue: {
            type: 'string'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },

      productTemplates: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          name: {
            type: 'string'
          },
          productKey: {
            type: 'string',
            index: 'not_analyzed'
          },
          category: {
            type: 'string'
          },
          subCategory: {
            type: 'string',
            index: 'not_analyzed'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          },
          template: {
            type: 'nested',
            dynamic: true
          }
        }
      },

      projectTypes: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          displayName: {
            type: 'string'
          },
          key: {
            type: 'string',
            index: 'not_analyzed'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },

      productCategories: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          displayName: {
            type: 'string'
          },
          key: {
            type: 'string',
            index: 'not_analyzed'
          },
          id: {
            type: 'long'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          }
        }
      },

      milestoneTemplate: {
        type: 'nested',
        properties: {
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          },
          id: {
            type: 'long'
          },
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          duration: {
            type: 'integer'
          },
          type: {
            type: 'string',
            index: 'not_analyzed'
          },
          order: {
            type: 'integer'
          },
          plannedstring: {
            type: 'string'
          },
          activestring: {
            type: 'string'
          },
          completedstring: {
            type: 'string'
          },
          blockedstring: {
            type: 'string'
          },
          hidden: {
            type: 'boolean'
          },
          reference: {
            type: 'string'
          },
          referenceId: {
            type: 'long'
          },
          metadata: {
            type: 'nested',
            dynamic: true
          }
        }
      }
    }
  }

  const timelineMapping = {
    properties: {
      id: {
        type: 'long'
      },
      name: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      startDate: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      endDate: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      reference: {
        type: 'string'
      },
      referenceId: {
        type: 'long'
      },
      templateId: {
        type: 'long'
      },
      createdAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      createdBy: {
        type: 'integer'
      },
      updatedAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      updatedBy: {
        type: 'integer'
      },
      deletedAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      deletedBy: {
        type: 'integer'
      },
      milestones: {
        type: 'nested',
        properties: {
          id: {
            type: 'long'
          },
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          duration: {
            type: 'integer'
          },
          startDate: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          actualStartDate: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          endDate: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          completionDate: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          status: {
            type: 'string',
            index: 'not_analyzed'
          },
          type: {
            type: 'string',
            index: 'not_analyzed'
          },
          details: {
            type: 'nested',
            dynamic: true
          },
          order: {
            type: 'integer'
          },
          plannedstring: {
            type: 'string'
          },
          activestring: {
            type: 'string'
          },
          completedstring: {
            type: 'string'
          },
          blockedstring: {
            type: 'string'
          },
          hidden: {
            type: 'boolean'
          },
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          updatedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          updatedBy: {
            type: 'integer'
          },
          deletedAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          deletedBy: {
            type: 'integer'
          }
        }
      }
    }
  }

  const customerPaymentMapping = {
    properties: {
      id: {
        type: 'long'
      },
      amount: {
        type: 'long'
      },
      currency: {
        type: 'string'
      },
      reference: {
        type: 'string'
      },
      referenceId: {
        type: 'string'
      },
      paymentIntentId: {
        type: 'string'
      },
      clientSecret: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
      createdAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      createdBy: {
        type: 'integer'
      },
      updatedAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      updatedBy: {
        type: 'integer'
      },
      deletedAt: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis'
      },
      deletedBy: {
        type: 'integer'
      }
    }
  }

  const result = {
    index: indexName,
    include_type_name: true,
    body: {
      settings: {
        number_of_shards: 5
      },
      mappings: { }
    }
  }
  switch (indexName) {
    case ES_PROJECT_INDEX:
      result.body.mappings[ES_TYPE] = projectMapping
      break
    case ES_METADATA_INDEX:
      result.body.mappings[ES_TYPE] = metadataMapping
      break
    case ES_TIMELINE_INDEX:
      result.body.mappings[ES_TYPE] = timelineMapping
      break
    case ES_CUSTOMER_PAYMENT_INDEX:
      result.body.mappings[ES_TYPE] = customerPaymentMapping
      break
    default:
      throw new Error(`Invalid index name '${indexName}'`)
  }
  return result
}

// first delete the index if already present
esClient.indices.delete({
  index: ES_PROJECT_INDEX,
  // we would want to ignore no such index error
  ignore: [404]
})
  .then(() => esClient.indices.create(getRequestBody(ES_PROJECT_INDEX)))
  // Re-create timeline index
  .then(() => esClient.indices.delete({ index: ES_TIMELINE_INDEX, ignore: [404] }))
  .then(() => esClient.indices.create(getRequestBody(ES_TIMELINE_INDEX)))
  // Re-create metadata index
  .then(() => esClient.indices.delete({ index: ES_METADATA_INDEX, ignore: [404] }))
  .then(() => esClient.indices.create(getRequestBody(ES_METADATA_INDEX)))
  // Re-create customerPayment index
  .then(() => esClient.indices.delete({ index: ES_CUSTOMER_PAYMENT_INDEX, ignore: [404] }))
  .then(() => esClient.indices.create(getRequestBody(ES_CUSTOMER_PAYMENT_INDEX)))
  .then(() => {
    logger.info('elasticsearch indices synced successfully')
    process.exit()
  })
  .catch((err) => {
    logger.info('elasticsearch indices sync failed', err)
    process.exit()
  })
