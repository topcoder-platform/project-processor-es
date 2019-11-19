/**
 * The default configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'project-processor-es',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  CREATE_DATA_TOPIC: process.env.CREATE_DATA_TOPIC || 'project.action.create',
  UPDATE_DATA_TOPIC: process.env.UPDATE_DATA_TOPIC || 'project.action.update',
  DELETE_DATA_TOPIC: process.env.DELETE_DATA_TOPIC || 'project.action.delete',
  KAFKA_MESSAGE_ORIGINATOR: process.env.KAFKA_MESSAGE_ORIGINATOR || 'project-api',

  esConfig: {
    HOST: process.env.ES_HOST || 'localhost:9200',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1', // AWS Region to be used if we use AWS ES
    API_VERSION: process.env.ES_API_VERSION || '6.7',
    ES_PROJECT_INDEX: process.env.ES_PROJECT_INDEX || 'projects',
    ES_TIMELINE_INDEX: process.env.ES_TIMELINE_INDEX || 'timelines',
    ES_METADATA_INDEX: process.env.ES_METADATA_INDEX || 'metadata',
    ES_TYPE: process.env.ES_TYPE || 'doc', // ES 6.x accepts only 1 Type per index and it's mandatory to define it
    ES_METADATA_DEFAULT_ID: process.env.ES_METADATA_DEFAULT_ID || 1 // use for setting default id of metadata
  }
}
