
var Account = Backbone.Model.extend({
	urlRoot: '/accounts',

	defaults: {
		name: 'Default name',
		initial_balance: 0.00,
		interest_rate: 0.00,
		overpayments: true,
		minimum_payment: 0.00
	}
});

// Need to create an account list collection

var Transaction = Backbone.Model.extend({
	urlRoot: '/transactions',

	defaults: {
		account_id: 0,
		account_name: 'Default name',
		date: '01/01/0101',
		amount: 0.00
	}
});

// Need to create a transaction list collection

// Need to create views for everything

var CalcApp = Backbone.Router.extend({
	routes: {
		'': 'index',
		'/': 'index'
	},

	initialize: function(){
		// This needs to be pointing at an account list, not a specific account
		this.account = new Account();

		// This shouldn't even be here, but until we have an account list
		// it won't make a difference
		this.transaction = new Transaction({ model: account });
	},

	start: function(){
		Backbone.history.start({ pushState: true });
	},

	index: function(){
		this.account.fetch();
	}
});

var calcApp = new CalcApp();

$(function(){
	calcApp.start();
});