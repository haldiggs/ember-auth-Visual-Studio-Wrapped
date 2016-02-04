import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.route('index', { path: '/' });
	this.route('index', { path: '/index.html' });
	this.route('login');
	this.route('public');
	this.route('protected');
	this.route('secret');
});

export default Router;
