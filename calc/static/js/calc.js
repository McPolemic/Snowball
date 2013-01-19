
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
	id: 'accountList',

	initialize: function(){
		this.model.on( 'change', this.render, this );
	},

	template: _.template('<li>test item</li>'),

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var CalcApp = Backbone.Router.extend({
	routes: {
		'': 'index',
		'/': 'index'
	},

	initialize: function(){
		this.accountList = new AccountList();
		this.accountListView = new AccountListView({
			model: accountList,
			url: /api/account
		});
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
