import Ember from 'ember';

import API from '../api';

export default Ember.Route.extend({
  model: function() {
    return API.get('public');
  }
});
