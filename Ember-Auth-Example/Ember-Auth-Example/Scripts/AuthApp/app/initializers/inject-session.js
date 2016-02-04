import Ember from 'ember';

export default {

  name: 'inject-session',

  initialize: function initialize(container, application) {

    // Register an observable "session" object for tracking current user, etc
    container.register('service:session', Ember.Object);

    // Make the session object available to all routes and controller
    application.inject('route', 'session', 'service:session');
    application.inject('controller', 'session', 'service:session');

  }

};
