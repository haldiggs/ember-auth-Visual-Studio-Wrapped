import Ember from 'ember';

import API from '../api';

export default Ember.Route.extend({
  beforeModel: function() {
    if (!this.session.get('user')) {
      return Ember.RSVP.reject({ status: 'Unauthorized', message: 'Please login to access this page' });
    } else if (this.session.get('user.role') !== 'admin') {
      return Ember.RSVP.reject({ status: 'Forbidden', message: 'You are not allowed to access this page' });
    }
  },

  model: function() {
    return API.get('secret');
  }
});
