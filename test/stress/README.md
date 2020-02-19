## Configuration

* STRESS_BASIC_QTY: As requested in challenge description

* STRESS_TESTER_TIMEOUT: Number of seconds to wait after queueing create/update/delete requests
and before validating data. Default is 80s, which is enough for `STRESS_BASIC_QTY=100`. This
might have to be increased if `STRESS_BASIC_QTY` is higher than 100.

## Validation

* Start processor:

    npm start

* Run `npm run test:stress`

Saves ids of milestones not updated/created/deleted to `test/stress/stress_test_errors.json`
