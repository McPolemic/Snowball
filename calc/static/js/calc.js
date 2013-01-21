var Account = Backbone.Tastypie.Model.extend({
	urlRoot: '/api/v1/accounts',

	defaults: {
		name: 'Default name',
		initial_balance: 0.00,
		current_balance: 0.00,
		interest_rate: 0.00,
		overpayments: true,
		minimum_payment: 0.00
	}
});


var AccountList = Backbone.Tastypie.Collection.extend({
	url: '/api/v1/accounts',
	model: Account,

	initialize: function(){
		this.on('remove', this.hideModel);
	},

	hideModel: function(model){
		model.trigger('hide');
	}
});


var AccountView = Backbone.View.extend({
	tagName: 'li',

	template: _.template('<%= name %> - <%= interest_rate %>%'),

	initialize: function(){
		this.model.on('hide', this.remove, this);
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});


var AccountListView = Backbone.View.extend({
	el: '#accountList',

	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},

	addOne: function(accountItem){
		var accountView = new AccountView({model: accountItem});
		this.$el.append(accountView.render().el);
	},

	addAll: function(){
		this.collection.forEach(this.addOne, this);
	},

	render: function(){
		this.addAll();
		return this;
	}
});


var Transaction = Backbone.Tastypie.Model.extend({
	urlRoot: '/api/v1/transactions',

	defaults: {
		account_id: 0,
		date: '01/01/0101',
		amount: 0.00
	}
});


var TransactionList = Backbone.Tastypie.Collection.extend({
	url: '/api/v1/transactions',
	model: Transaction
});


var TransactionView = Backbone.View.extend({
	tagName: 'li',

	template: _.template('<%= account %>'),

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});


var TransactionListView = Backbone.View.extend({
	el: '#transactionList',

	defaults: {
		account_id: 0
	},

	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},

	addOne: function(transaction){
		var transactionView = new TransactionView({model: transaction});
		this.$el.append(transactionView.render().el);
	},

	addAll: function(){
		this.collection.forEach(this.addOne, this);
	},

	render: function(){
		this.addAll();
		return this;
	}
});


// Router handling the models and initial fetches
var CalcApp = Backbone.Router.extend({
	routes: {
		'': 'index',
		'/': 'index'
	},

	initialize: function(){
		this.accountList = new AccountList();
		this.accountListView = new AccountListView({
			collection: this.accountList
		});
	},

	start: function(){
		Backbone.history.start({ pushState: true });
	},

	index: function(){
		this.accountList.fetch();
	}
});


// Create and start the app
var calcApp = new CalcApp();
$(function(){
	calcApp.start();
});
