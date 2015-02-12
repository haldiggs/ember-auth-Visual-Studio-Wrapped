import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from './helpers/start-app';

import API from 'ember-auth-example/api';
import 'ember-auth-example/mock-server';

var application;

function clickLink(text) {
  click('a:contains(' + text + ')');
}

function clickButton(text) {
  click('button:contains(' + text + ')');
}

function login(username, password) {
  if (currentURL() !== '/login') {
    visit('/login');
  }

  fillIn('input[name=username]', username);
  fillIn('input[name=password]', password);

  clickButton('Submit');
}

module('Acceptance test', {
  beforeEach: function() {
    API.token = null;
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Visiting the index page', function(assert) {

  visit('/');

  andThen(function() {
    assert.equal( currentURL(), '/' );
    assert.equal( find('h2').text(), 'Ember.js Authentication Example' );
  });

});

test('Log in with incorrect username and password', function(assert) {

  visit('/');

  clickButton('Login');

  andThen(function() {
    assert.equal( currentURL(), '/login' );
    assert.equal( find('h4').text(), 'Please login' );
    assert.strictEqual( find('#content').length, 0 );

    // We are already on the login page, so we should hide the "Login" button!
    assert.strictEqual( find('button:contains(Login):visible').length, 0 );
  });

  login('user', 'wrong');

  andThen(function() {
    assert.equal( currentURL(), '/login' );
    assert.equal( find('#content').text(), 'Incorrect username/password' );
  });

  login('zomg', 'lol');

  andThen(function() {
    assert.equal( currentURL(), '/login' );
    assert.equal( find('#content').text(), 'Incorrect username/password' );
  });

  clickButton('Cancel');

  andThen(function() {
    assert.equal( currentURL(), '/' );
    assert.strictEqual( find(':contains(You are logged in)').length, 0 );
    assert.strictEqual( find('button:contains(Logout)').length, 0 );
  });

});

test('Log in as user', function(assert) {

  login('user', 'secret');

  andThen(function() {
    assert.equal( currentURL(), '/' );
    assert.equal( find('h4').text(), 'You are logged in as User' );
    assert.strictEqual( find('button:contains(Login)').length, 0 );
  });

  clickButton('Logout');

  andThen(function() {
    assert.equal( currentURL(), '/' );
    assert.strictEqual( find(':contains(You are logged in)').length, 0 );
    assert.strictEqual( find('button:contains(Logout)').length, 0 );
  });

});

test('Log in as admin', function(assert) {

  login('admin', 'secret');

  andThen(function() {
    assert.equal( currentURL(), '/' );
    assert.equal( find('h4').text(), 'You are logged in as Administrator' );
    assert.strictEqual( find('button:contains(Login)').length, 0 );
  });

  clickButton('Logout');

  andThen(function() {
    assert.equal( currentURL(), '/' );
    assert.strictEqual( find(':contains(You are logged in)').length, 0 );
    assert.strictEqual( find('button:contains(Logout)').length, 0 );
  });

});

test('Accessing the public page', function(assert) {

  visit('/');

  clickLink('Public Page');

  andThen(function() {
    assert.equal( currentURL(), '/public' );
    assert.equal( find('h4').text(), 'Public Page' );
    assert.equal( find('#content').text(), 'Lorem ipsum dolor sit amet' );
  });

  clickLink('Go back');

  andThen(function() {
    assert.equal( currentURL(), '/' );
  });

});

test('Accessing the protected page as a guest', function(assert) {

  visit('/');

  clickLink('Protected Page');

  andThen(function() {
    assert.equal( currentURL(), '/login' );
    assert.equal( find('h4').text(), 'Please login' );
    assert.equal( find('#content').text(), 'Please login to access this page' );
  });

  login('user', 'secret');

  andThen(function() {
    assert.equal( currentURL(), '/protected' );
    assert.equal( find('h4').text(), 'Protected Page' );
    assert.equal( find('#content').text(), 'Since you can see this, you must be logged in!' );
  });

});

test('Accessing the protected page as an user', function(assert) {

  login('user', 'secret');

  clickLink('Protected Page');

  andThen(function() {
    assert.equal( currentURL(), '/protected' );
    assert.equal( find('h4').text(), 'Protected Page' );
    assert.equal( find('#content').text(), 'Since you can see this, you must be logged in!' );
  });

  clickLink('Go back');

  andThen(function() {
    assert.equal( currentURL(), '/' );
  });

});

test('Accessing the admin-only page as a guest', function(assert) {

  visit('/');

  clickLink('Admin-only Page');

  andThen(function() {
    assert.equal( currentURL(), '/login' );
    assert.equal( find('h4').text(), 'Please login' );
    assert.equal( find('#content').text(), 'Please login to access this page' );
  });

  login('admin', 'secret');

  andThen(function() {
    assert.equal( currentURL(), '/secret' );
    assert.equal( find('h4').text(), 'Admin-only Page' );
    assert.equal( find('#content').text(), 'Since you can see this, you must be an admin!' );
  });

});

test('Accessing the admin-only page as an user', function(assert) {

  login('user', 'secret');

  clickLink('Admin-only Page');

  andThen(function() {
    // PENDING: Ideally, we would want the URL to change, so that the user can
    // go back to the previous page using the back button. This is not currently
    // the case.
    //
    // assert.equal( currentURL(), '/secret' );
    assert.equal( find('h4').text(), 'An error has occured!' );
    assert.equal( find('#content').text(), 'You are not allowed to access this page' );
  });

  clickLink('Go back');

  andThen(function() {
    assert.equal( currentURL(), '/' );
  });

});

test('Accessing the admin-only page as an admin', function(assert) {

  login('admin', 'secret');

  clickLink('Admin-only Page');

  andThen(function() {
    assert.equal( currentURL(), '/secret' );
    assert.equal( find('h4').text(), 'Admin-only Page' );
    assert.equal( find('#content').text(), 'Since you can see this, you must be an admin!' );
  });

  clickLink('Go back');

  andThen(function() {
    assert.equal( currentURL(), '/' );
  });

});
