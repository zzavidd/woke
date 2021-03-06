const { assert, request, HEADERS } = require('../configuration');
const { TEST_SESSIONS, TEST_USERS } = require('../data');

const superuser = TEST_USERS.NINE;

let SESSION_ID = 0;

describe('Session Tests', function () {
  this.slow(10000);

  /** Test creating a new session */
  describe('Create', function () {
    it('Add session', function (done) {
      request({
        url: `/api/v1/sessions`,
        method: 'POST',
        body: JSON.stringify(TEST_SESSIONS.CREATED),
        headers: HEADERS.TOKEN(superuser),
        done,
        onSuccess: ({ status, data }) => {
          assert.equal(status, 201);
          assert.hasAllKeys(data, ['id']);
          SESSION_ID = data.id;
        }
      });
    });
  });

  /** Test retrieval of all sessions */
  describe('Read', function () {
    it('Get all sessions', function (done) {
      request({
        url: `/api/v1/sessions`,
        method: 'GET',
        headers: HEADERS.KEY,
        done,
        onSuccess: ({ status, data }) => {
          assert.equal(status, 200);
          assert.isArray(data);
        }
      });
    });

    it('Get single session', function (done) {
      request({
        url: `/api/v1/sessions/${SESSION_ID}`,
        method: 'GET',
        headers: HEADERS.KEY,
        done,
        onSuccess: ({ status, data }) => {
          assert.equal(status, 200);
          assert.isObject(data);
        }
      });
    });

    it('Get featured session', function (done) {
      request({
        url: `/api/v1/sessions/featured`,
        method: 'GET',
        headers: HEADERS.KEY,
        done,
        onSuccess: ({ status, data }) => {
          assert.equal(status, 200);
          assert.hasAllKeys(data, ['session', 'upcoming']);
        }
      });
    });

    it('Attempt get single session with invalid ID', function (done) {
      request({
        url: `/api/v1/sessions/0`,
        method: 'GET',
        headers: HEADERS.KEY,
        done,
        onError: ({ status }) => {
          assert.equal(status, 404);
        }
      });
    });
  });

  /** Test updating the session */
  describe('Update', function () {
    it('Update session without image change', function (done) {
      request({
        url: `/api/v1/sessions/${SESSION_ID}`,
        method: 'PUT',
        body: JSON.stringify({
          session: TEST_SESSIONS.UPDATED,
          changed: false
        }),
        headers: HEADERS.TOKEN(superuser),
        done,
        onSuccess: ({ status, data }) => {
          assert.equal(status, 200);
          assert.hasAllKeys(data, ['slug']);
        }
      });
    });

    it('Update session with image change', function (done) {
      request({
        url: `/api/v1/sessions/${SESSION_ID}`,
        method: 'PUT',
        body: JSON.stringify({
          session: TEST_SESSIONS.UPDATED,
          changed: true
        }),
        headers: HEADERS.TOKEN(superuser),
        done,
        onSuccess: ({ status, data }) => {
          assert.equal(status, 200);
          assert.hasAllKeys(data, ['slug']);
        }
      });
    });

    it('Attempt update session with invalid ID', function (done) {
      request({
        url: `/api/v1/sessions/0`,
        method: 'PUT',
        body: JSON.stringify({
          session: TEST_SESSIONS.UPDATED,
          changed: true
        }),
        headers: HEADERS.TOKEN(superuser),
        done,
        onError: ({ status }) => {
          assert.equal(status, 404);
        }
      });
    });
  });

  /** Test deleting the session */
  describe('Delete', function () {
    it('Delete session', function (done) {
      request({
        url: `/api/v1/sessions/${SESSION_ID}`,
        method: 'DELETE',
        headers: HEADERS.TOKEN(superuser),
        done,
        onSuccess: ({ status }) => {
          assert.equal(status, 204);
        }
      });
    });

    it('Attempt delete session with invalid ID', function (done) {
      request({
        url: `/api/v1/sessions/0`,
        method: 'DELETE',
        headers: HEADERS.TOKEN(superuser),
        done,
        onError: ({ status }) => {
          assert.equal(status, 404);
        }
      });
    });
  });
});
