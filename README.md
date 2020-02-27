# Topcoder - Project Elasticsearch Processor

## Dependencies

- nodejs https://nodejs.org/en/ (v8+)
- Kafka
- ElasticSearch
- Docker, Docker Compose

## Local setup

1. Install node dependencies:

   ```bash
   npm install
   ```

2. Run docker compose with dependant services:

   ```bash
   cd local/
   docker-compose up
   ```

   <details><summary>Click to see details</summary>

    This docker-compose run all the dependencies which are necessary for `project-processor-es` to work.

    |  Service | Name | Port  |
    |----------|:-----:|:----:|
    | Elasticsearch | esearch | 9200 |
    | Zookeeper | zookeeper | 2181  |
    | Kafka | kafka | 9092  |

    `docker-compose` automatically creates Kafka topics which are used by `project-processor-es` listed in `local/kafka-client/topics.txt`.

   </details>


3. Set environment variables for M2M authentication: `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_URL`, `AUTH0_AUDIENCE`, `AUTH0_PROXY_SERVER_URL`:

   ```bash
   export AUTH0_CLIENT_ID=<insert required value here>
   export AUTH0_CLIENT_SECRET=<insert required value here>
   export AUTH0_URL=<insert required value here>
   export AUTH0_AUDIENCE=<insert required value here>
   export AUTH0_PROXY_SERVER_URL=<insert required value here>
   ```

4. Initialize Elasticsearch indexes:

   ```bash
   npm run sync:es
   ```

5. Start processor app:

   ```bash
   npm start
   ```

## Commands

### Lint & Tests commands

|  Command | Description  |
|----------|--------------|
| `npm run lint` | Run lint check. |
| `npm run lin:fix` | Run lint check with automatic fixing of errors and warnings where possible. |
| `npm run test` | Run integration tests. |
| `npm run test:cov` | Run integration tests with coverage report. |

### View data in Elasticsearch indexes

You may run the next command to output documents in the Elasticsearch indexes for debugging purposes.

```bash
npm run view-data <INDEX_NAME> <DOCUMENT_ID>
```

##### Examples

- `npm run view-data projects 1` view document with id `1` in `projects` index
- `npm run view-data timelines 1` view document with id `1` in `timelines` index
- `npm run view-data metadata 1` view document with id `1` in `timelines` index *(this index has only one document and all the data is stored inside one document which might be very big)*.

### Kafka commands

If you've used `docker-compose` with the file `local/docker-compose.yml` during local setup to spawn kafka & zookeeper, you can use the following commands to manipulate kafka topics and messages:
(Replace `TOPIC_NAME` with the name of the desired topic)

#### Create Topic

```bash
docker exec project-processor-es-kafka /opt/kafka/bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --partitions 1 --replication-factor 1 --topic TOPIC_NAME
```

#### List Topics

```bash
docker exec project-processor-es-kafka /opt/kafka/bin/kafka-topics.sh --list --zookeeper zookeeper:2181
```

#### Watch Topic

```bash
docker exec  project-processor-es-kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic TOPIC_NAME
```

#### Post Message to Topic (from stdin)

```bash
docker exec -it project-processor-es-kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TOPIC_NAME
```

- Enter or copy/paste the message into the console after starting this command.

#### Post Message to Topic (from file)

```bash
docker exec -i project-processor-es-kafka /opt/kafka/bin/kafka-console-producer.sh --topic project.action.create --broker-list localhost:9092 < test_message.json
```

- All example for messages are in: `./test/data`.

## Configuration

Configuration for the processor is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level; default value: 'debug'
- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_GROUP_ID: the Kafka group id; default value: 'project-processor-es'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to certificate file or certificate content
- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to private key file or private key content
- CREATE_DATA_TOPIC: create data Kafka topic, default value is 'project.action.create'
- UPDATE_DATA_TOPIC: update data Kafka topic, default value is 'project.action.update'
- DELETE_DATA_TOPIC: delete data Kafka topic, default value is 'project.action.delete'
- KAFKA_MESSAGE_ORIGINATOR: Kafka topic originator, default value is 'project-api'
- MEMBER_SERVICE_ENDPOINT: used to get member details
- AUTH0_URL: AUTH0 URL, used to get M2M token
- AUTH0_PROXY_SERVER_URL: AUTH0 proxy server URL, used to get M2M token
- AUTH0_AUDIENCE: AUTH0 audience, used to get M2M token
- TOKEN_CACHE_TIME: AUTH0 token cache time, used to get M2M token
- AUTH0_CLIENT_ID: AUTH0 client id, used to get M2M token
- AUTH0_CLIENT_SECRET: AUTH0 client secret, used to get M2M token
- esConfig: config object for Elasticsearch

Refer to `esConfig` variable in `config/default.js` for ES related configuration.

Also note that there is a `/health` endpoint that checks for the health of the app. This sets up an expressjs server and listens on the environment variable `PORT`. It's not part of the configuration file and needs to be passed as an environment variable

Config for tests are at `config/test.js`, it overrides some default config.

## Local Deployment with Docker

To run the Challenge ES Processor using docker, follow the below steps

1. Navigate to the directory `docker`

2. Rename the file `sample.api.env` to `api.env`

3. Set the required AWS credentials in the file `api.env`

4. Once that is done, run the following command

```
docker-compose up
```

5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## Integration tests

Integration tests use different index `projects_test`, `timelines_test`, `metadata_test` which is not same as the usual index `projects`, `timelines`, `metadata`.

While running tests, the index names could be overwritten using environment variables or leave it as it is to use the default test indices defined in `config/test.js`

```
export ES_PROJECT_INDEX=projects_test
export ES_TIMELINE_INDEX=timelines_test
export ES_METADATA_INDEX=metadata_test
```

#### Running integration tests and coverage

To run test alone

```
npm run test
```

To run test with coverage report

```
npm run test:cov
```

## Verification
- Start Docker services, initialize Elasticsearch, start processor app
- Navigate to the repository root directory.
- Send message:
    `docker exec -i project-processor-es-kafka /opt/kafka/bin/kafka-console-producer.sh --topic project.action.create --broker-list localhost:9092 < ./test/data/project/project.action.create.json`
- run command `npm run view-data projects 1` to view the created data, you will see the data are properly created:

```bash
info: Elasticsearch Project data:
info: {
    "createdAt": "2019-06-20T13:43:23.554Z",
    "updatedAt": "2019-06-20T13:43:23.555Z",
    "terms": [],
    "id": 1,
    "name": "test project",
    "description": "Hello I am a test project",
    "type": "app",
    "createdBy": 40051333,
    "updatedBy": 40051333,
    "projectEligibility": [],
    "bookmarks": [],
    "external": null,
    "status": "draft",
    "lastActivityAt": "2019-06-20T13:43:23.514Z",
    "lastActivityUserId": "40051333",
    "members": [
      {
        "createdAt": "2019-06-20T13:43:23.555Z",
        "updatedAt": "2019-06-20T13:43:23.625Z",
        "id": 2,
        "isPrimary": true,
        "role": "manager",
        "userId": 40051333,
        "updatedBy": 40051333,
        "createdBy": 40051333,
        "projectId": 2,
        "deletedAt": null,
        "deletedBy": null
      }
    ],
    "version": "v2",
    "directProjectId": null,
    "billingAccountId": null,
    "estimatedPrice": null,
    "actualPrice": null,
    "details": null,
    "cancelReason": null,
    "templateId": null,
    "deletedBy": null,
    "attachments": null,
    "phases": null,
    "projectUrl": "https://connect.topcoder-dev.com/projects/2"
}
```


- Run the producer and then write some invalid message into the console to send to the `project.action.create` topic:

  `docker exec -it project-processor-es-kafka /opt/kafka/bin/kafka-console-producer.sh --topic project.action.create --broker-list localhost:9092`
  in the console, write message, one message per line:
  `{ "topic": "project.action.create", "originator": "project-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "invalid", "typeId": "8e17090c-465b-4c17-b6d9-dfa16300b0ff", "track": "Code", "name": "test", "description": "desc", "timelineTemplateId": "8e17090c-465b-4c17-b6d9-dfa16300b0aa", "phases": [{ "id": "8e17090c-465b-4c17-b6d9-dfa16300b012", "name": "review", "isActive": true, "duration": 10000 }], "prizeSets": [{ "type": "prize", "prizes": [{ "type": "winning prize", "value": 500 }] }], "reviewType": "code review", "tags": ["code"], "projectId": 123, "forumId": 456, "status": "Active", "created": "2019-02-16T00:00:00", "createdBy": "admin" } }`

  `{ "topic": "project.action.create", "originator": "project-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "typeId": "8e17090c-465b-4c17-b6d9-dfa16300b0ff", "track": "Code", "name": "test", "description": "desc", "timelineTemplateId": "8e17090c-465b-4c17-b6d9-dfa16300b0aa", "phases": [{ "id": "8e17090c-465b-4c17-b6d9-dfa16300b012", "name": "review", "isActive": true, "duration": 10000 }], "prizeSets": [{ "type": "prize", "prizes": [{ "type": "winning prize", "value": 500 }] }], "reviewType": "code review", "tags": ["code"], "projectId": 123, "forumId": -456, "status": "Active", "created": "2018-01-02T00:00:00", "createdBy": "admin" } }`

  `{ [ { abc`
- Then in the app console, you will see error messages

- Sent message to update data:

   `docker exec -i project-processor-es-kafka /opt/kafka/bin/kafka-console-producer.sh --topic project.action.update --broker-list localhost:9092 < ./test/data/project/project.action.update.json`
- Run command `npm run view-data projects 1` to view the updated data, you will see the data are properly updated:

```bash
info: Elasticsearch Project data:
info: {
    "createdAt": "2019-06-20T13:43:23.554Z",
    "updatedAt": "2019-06-20T13:45:20.091Z",
    "terms": [],
    "id": 1,
    "name": "project name updated",
    "description": "Hello I am a test project",
    "type": "app",
    "createdBy": 40051333,
    "updatedBy": 40051333,
    "projectEligibility": [],
    "bookmarks": [],
    "external": null,
    "status": "draft",
    "lastActivityAt": "2019-06-20T13:43:23.514Z",
    "lastActivityUserId": "40051333",
    "members": [
        {
            "createdAt": "2019-06-20T13:43:23.555Z",
            "deletedAt": null,
            "role": "manager",
            "updatedBy": 40051333,
            "createdBy": 40051333,
            "isPrimary": true,
            "id": 2,
            "userId": 40051333,
            "projectId": 2,
            "deletedBy": null,
            "updatedAt": "2019-06-20T13:43:23.625Z"
        }
    ],
    "version": "v2",
    "directProjectId": null,
    "billingAccountId": null,
    "estimatedPrice": null,
    "actualPrice": null,
    "details": null,
    "cancelReason": null,
    "templateId": null,
    "deletedBy": null,
    "attachments": [],
    "phases": [],
    "projectUrl": "https://connect.topcoder-dev.com/projects/2",
    "invites": [],
    "utm": null
}
```


- Run the producer and then write some invalid message into the console to send to the `project.action.create` topic:
  `docker exec -it project-processor-es-kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic project.action.create`
  in the console, write message, one message per line:
  `{ "topic": "project.action.update", "originator": "project-api", "timestamp": "2019-02-17T01:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "typeId": "123", "track": "Code", "name": "test3", "description": "desc3", "timelineTemplateId": "8e17090c-465b-4c17-b6d9-dfa16300b0dd", "groups": ["group2", "group3"], "updated": "2019-02-17T01:00:00", "updatedBy": "admin" } }`

  `{ "topic": "project.action.update", "originator": "project-api", "timestamp": "2019-02-17T01:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "typeId": "8e17090c-465b-4c17-b6d9-dfa16300b0ff", "track": ["Code"], "name": "test3", "description": "desc3", "timelineTemplateId": "8e17090c-465b-4c17-b6d9-dfa16300b0dd", "groups": ["group2", "group3"], "updated": "2019-02-17T01:00:00", "updatedBy": "admin" } }`

  `[ [ [ } } }`

- Then in the app console, you will see error messages

- To test the health check API, run `export PORT=5000`, start the processor, then browse `http://localhost:5000/health` in a browser,
  and you will see result `{"checksRun":1}`
