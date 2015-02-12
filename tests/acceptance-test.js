import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from './helpers/start-app';

import API from 'ember-auth-example/api';
import 'ember-auth-example/mock-server';

var application;

function clickLink(text) {
  click('a:contains(' + text + ')');
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
