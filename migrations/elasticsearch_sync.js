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
            type: 'keyword'
          },
          contentType: {
            type: 'keyword'
          },
          createdAt: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          createdBy: {
            type: 'integer'
          },
          description: {
            type: 'text'
          },
          filePath: {
            type: 'text'
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
            type: 'text'
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
            type: 'text'
          },
          title: {
            type: 'text'
          }
        }
      },
      cancelReason: {
        type: 'text'
      },
      challengeEligibility: {
        type: 'nested',
        properties: {
          groups: {
            type: 'long'
          },
          role: {
            type: 'keyword'
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
        type: 'text'
      },
      details: {
        type: 'nested',
        properties: {
          TBD_features: {
            type: 'nested',
            properties: {
              description: {
                type: 'text'
              },
              id: {
                type: 'integer'
              },
              isCustom: {
                type: 'boolean'
              },
              title: {
                type: 'text'
              }
            }
          },
          TBD_usageDescription: {
            type: 'text'
          },
          appDefinition: {
            properties: {
              goal: {
                properties: {
                  value: {
                    type: 'text'
                  }
                }
              },
              primaryTarget: {
                type: 'text'
              },
              users: {
                properties: {
                  value: {
                    type: 'text'
                  }
                }
              }
            }
          },
          hideDiscussions: {
            type: 'boolean'
          },
          products: {
            type: 'text'
          },
          summary: {
            type: 'text'
          },
          utm: {
            type: 'nested',
            properties: {
              code: {
                type: 'text'
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
            type: 'text'
          },
          id: {
            type: 'keyword'
          },
          type: {
            type: 'keyword'
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
            type: 'keyword'
          },
          firstName: {
            type: 'text'
          },
          handle: {
            type: 'keyword'
          },
          id: {
            type: 'long'
          },
          isPrimary: {
            type: 'boolean'
          },
          lastName: {
            type: 'text'
          },
          projectId: {
            type: 'long'
          },
          role: {
            type: 'keyword'
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
            type: 'keyword'
          },
          id: {
            type: 'long'
          },
          role: {
            type: 'keyword'
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
        type: 'text'
      },
      status: {
        type: 'keyword'
      },
      terms: {
        type: 'integer'
      },
      type: {
        type: 'keyword'
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
        type: 'text'
      },
      utm: {
        properties: {
          campaign: {
            type: 'text'
          },
          medium: {
            type: 'text'
          },
          source: {
            type: 'text'
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
            type: 'keyword'
          },
          category: {
            type: 'keyword'
          },
          name: {
            type: 'text'
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
            type: 'keyword'
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
            type: 'keyword'
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
            type: 'keyword'
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
            type: 'keyword'
          },
          configName: {
            type: 'keyword'
          },
          configValue: {
            type: 'text'
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
            type: 'text'
          },
          productKey: {
            type: 'keyword'
          },
          category: {
            type: 'text'
          },
          subCategory: {
            type: 'keyword'
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
            type: 'text'
          },
          key: {
            type: 'keyword'
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
            type: 'text'
          },
          key: {
            type: 'keyword'
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
            type: 'text'
          },
          description: {
            type: 'text'
          },
          duration: {
            type: 'integer'
          },
          type: {
            type: 'keyword'
          },
          order: {
            type: 'integer'
          },
          plannedText: {
            type: 'text'
          },
          activeText: {
            type: 'text'
          },
          completedText: {
            type: 'text'
          },
          blockedText: {
            type: 'text'
          },
          hidden: {
            type: 'boolean'
          },
          reference: {
            type: 'text'
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
        type: 'text'
      },
      description: {
        type: 'text'
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
        type: 'text'
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
            type: 'text'
          },
          description: {
            type: 'text'
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
            type: 'keyword'
          },
          type: {
            type: 'keyword'
          },
          details: {
            type: 'nested',
            dynamic: true
          },
          order: {
            type: 'integer'
          },
          plannedText: {
            type: 'text'
          },
          activeText: {
            type: 'text'
          },
          completedText: {
            type: 'text'
          },
          blockedText: {
            type: 'text'
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
  .then(() => {
    logger.info('elasticsearch indices synced successfully')
    process.exit()
  })
  .catch((err) => {
    logger.info('elasticsearch indices sync failed', err)
    process.exit()
  })
