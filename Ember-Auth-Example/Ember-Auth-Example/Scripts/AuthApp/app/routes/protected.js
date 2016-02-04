import Ember from 'ember';

import API from '../api';

export default Ember.Route.extend({
  beforeModel: function() {
    if (!this.session.get('user')) {
      return Ember.RSVP.reject({ status: 'Unauthorized', message: 'Please login to access this page' });
    }
  },

  model: function() {
    return API.get('protected');
  }
});
