import Ember from 'ember';

import API from '../api';

export default Ember.Route.extend({
  actions: {
    submit: function() {
      var route = this, controller = this.get('controller');

      var username = controller.get('username'),
          password = controller.get('password');

      controller.set('message', null);

      API.login(username, password).then(
        function(user) {
          route.session.set('user', user);
          route.transitionTo('index');
        },
        function(error) {
          controller.set('message', error.message);
        }
      );
    },

    cancel: function() {
      this.transitionTo('index');
    }
  },

  resetController: function(controller) {
    controller.setProperties({
      username: null,
      password: null,
      message:  null
    });
  }
});
