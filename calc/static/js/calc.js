
var Account = Backbone.Model.extend({
	defaults: {
		name: 'Default name',
		initial_balance: 0.00,
		current_balance: 0.00,
		interest_rate: 0.00,
		overpayments: true,
		minimum_payment: 0.00
	}
});

var AccountList = Backbone.Collection.extend({
	model: Account,
	url: '/accounts'
});

var Transaction = Backbone.Model.extend({
	defaults: {
		account_id: 0,
		date: '01/01/0101',
		amount: 0.00
	}
});

var TransactionList = Backbone.Collection.extend({
	model: Transaction,
	url: '/transactions'
});

var AccountListView = Backbone.View.extend({
	tagName: 'div',
	id: 'accountList'
});
// Need to create views for everything

var CalcApp = Backbone.Router.extend({
	routes: {
		'': 'index',
		'/': 'index'
	},

	initialize: function(){
		// This needs to be pointing at an account list, not a specific account
		this.accountList = new AccountList();
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
