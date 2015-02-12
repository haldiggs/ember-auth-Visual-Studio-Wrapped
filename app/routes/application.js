import Ember from 'ember';

import API from '../api';

export default Ember.Route.extend({
  actions: {
    logout: function() {
      var route = this;

      API.logout().then(function() {
        route.session.set('user', null);
        route.transitionTo('index');
      });
    }
  }
});
