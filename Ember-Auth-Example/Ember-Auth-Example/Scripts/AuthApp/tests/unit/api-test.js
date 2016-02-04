import { module, test } from 'qunit';

import API from 'ember-auth-example/api';
import 'ember-auth-example/mock-server';

module('API client', {
  setup: function() {
    API.token = null;
  }
});

/* ---------- LOGIN ---------- */

test('Login with incorrect password', function(assert) {

  return API.login('wrong', 'wrong').catch(function(error) {

    assert.strictEqual(API.token, null);

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Incorrect username/password');

  });

});

test('Login as user', function(assert) {

  return API.login('user', 'secret').then(function(user) {

    assert.equal(API.token, 'user');

    assert.equal(user.name, 'User');
    assert.equal(user.role, 'user');

  });

});

test('Login as user with incorrect password', function(assert) {

  return API.login('user', 'wrong').catch(function(error) {

    assert.strictEqual(API.token, null);

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Incorrect username/password');

  });

});

test('Login as admin', function(assert) {

  return API.login('admin', 'secret').then(function(user) {

    assert.equal(API.token, 'admin');

    assert.equal(user.name, 'Administrator');
    assert.equal(user.role, 'admin');

  });

});

test('Login as admin with incorrect password', function(assert) {

  return API.login('admin', 'wrong').catch(function(error) {

    assert.strictEqual(API.token, null);

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Incorrect username/password');

  });

});

/* ---------- LOGOUT ---------- */

test('Logout', function(assert) {

  API.token = 'user';

  return API.logout().then(function(message) {
    assert.strictEqual(API.token, null);
  });

});

test('Logout with expired token', function(assert) {

  API.token = 'expired';

  return API.logout().then(function(message) {
    assert.strictEqual(API.token, null);
  });

});

test('Logout without first loggin in', function(assert) {

  return API.logout().then(function(message) {
    assert.strictEqual(API.token, null);
  });

});

/* ---------- PUBLIC PAGE ---------- */

test('Access public page as user', function(assert) {

  API.token = 'user';

  return API.get('public').then(function(content) {
    assert.equal(content, 'Lorem ipsum dolor sit amet');
  });

});

test('Access public page as admin', function(assert) {

  API.token = 'admin';

  return API.get('public').then(function(content) {
    assert.equal(content, 'Lorem ipsum dolor sit amet');
  });

});

test('Access public page with expired token', function(assert) {

  API.token = 'expired';

  return API.get('public').then(function(content) {
    assert.equal(content, 'Lorem ipsum dolor sit amet');
  });

});

/* ---------- PROTECTED PAGE ---------- */

test('Access protected page without logging in', function(assert) {

  return API.get('protected').catch(function(error) {

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Please login to access this page');

  });

});

test('Access protected page as user', function(assert) {

  API.token = 'user';

  return API.get('protected').then(function(content) {
    assert.equal(content, 'Since you can see this, you must be logged in!');
  });

});

test('Access protected page as admin', function(assert) {

  API.token = 'admin';

  return API.get('protected').then(function(content) {
    assert.equal(content, 'Since you can see this, you must be logged in!');
  });

});

test('Access protected page with expired token', function(assert) {

  API.token = 'expired';

  return API.get('protected').catch(function(error) {

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Your session has expired');

  });

});

/* ---------- SECRET PAGE ---------- */

test('Access secret page without logging in', function(assert) {

  return API.get('secret').catch(function(error) {

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Please login to access this page');

  });

});

test('Access secret page as user', function(assert) {

  API.token = 'user';

  return API.get('secret').catch(function(error) {

    assert.equal(error.status, 'Forbidden');
    assert.equal(error.message, 'You are not allowed to access this page');

  });

});

test('Access secret page as admin', function(assert) {

  API.token = 'admin';

  return API.get('secret').then(function(content) {
    assert.equal(content, 'Since you can see this, you must be an admin!');
  });

});

test('Access secret page with expired token', function(assert) {

  API.token = 'expired';

  return API.get('secret').catch(function(error) {

    assert.equal(error.status, 'Unauthorized');
    assert.equal(error.message, 'Your session has expired');

  });

});


