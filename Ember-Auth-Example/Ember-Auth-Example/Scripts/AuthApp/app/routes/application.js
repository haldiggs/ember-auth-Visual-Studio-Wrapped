/* globals jQuery */
import Ember from 'ember';
import { MousetrapRoute, mousetrap } from 'ember-mousetrap';
import API from '../api';

export default Ember.Route.extend(MousetrapRoute, {
	actions: {
		logout: function() {
			var route = this;

			API.logout().then(function() {
				route.session.set('user', null);
				route.transitionTo('index');
			});
		},

		expireSession: function() {
			API.token = 'expired';
		},

		error: function(error, transition) {
			if (error.status === 'Unauthorized') {
				var loginController = this.controllerFor('login');

				loginController.setProperties({
					message: error.message,
					transition: transition
				});

				this.transitionTo('login');
			} else {
				// Allow other error to bubble
				return true;
			}
		}
	},
	shortcuts: {
		// single keys
		enter: mousetrap('enter', function() { jQuery('#btnLogin').click(); }),
		foo: mousetrap('4', function() { API.highlight(2); }),
		bar: mousetrap('x', 'keyup', function() { highlight(3); }),

		// combinations
		baz: mousetrap('ctrl+shift+k', function(e) {
			highlight([6, 7, 8, 9]);
			return false;
		}),

		qux: mousetrap(['ctrl+k', 'ctrl+k'], function(e) {
			highlight([11, 12, 13, 14]);
			return false;
		}),

		// gmail style sequences
		foobar: mousetrap('g i', function() { highlight(17); }),
		foobaz: mousetrap('* a', function() { highlight(18); }),

		// konami code!
		mighty: mousetrap('up up down down left right left right b a enter', function() {
			highlight([21, 22, 23]);
		})
	}
});
