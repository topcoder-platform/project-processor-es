# Stress test

## Overview

This test is checking if any error would happen if we create, updated and delete milestones in **the same** timeline document in Elasticsearch `timelines` index at the same time. We are sending multiple Kafka events in parallel to trigger create, updated and delete milestone operations.

1. First, the script should create initial data in the ES index:
   - create one timeline in the `timeline` index with `2*STRESS_BASIC_QTY` milestones (it's important that all milestones belong to the same timeline)

2. After initial data is created start an actual stress test by sending `3*STRESS_BASIC_QTY` Kafka messages in parallel:
   - `STRESS_BASIC_QTY` Kafka messages to delete half of the initially created milestones
   - `STRESS_BASIC_QTY` Kafka messages to update another half of initially created milestones
   - `STRESS_BASIC_QTY` Kafka messages to create `STRESS_BASIC_QTY` new milestones in the same timeline

## Configuration

* `STRESS_BASIC_QTY`: The basic number of objects to use in stress test.

* `STRESS_TESTER_TIMEOUT`: Number of seconds to wait after queueing create/update/delete requests and before validating data. Default is 80s, which is enough for `STRESS_BASIC_QTY=100`. This might have to be increased if `STRESS_BASIC_QTY` is higher than 100.

## Run

* Start processor

  It should point the **test** ES, so set `NODE_ENV=test`.

   ```
   NODE_ENV=test npm start
   ```

* Run stress test

  It would test using **test** ES, as this command sets `NODE_ENV=test`.

  ```
  npm run test:stress
  ```
