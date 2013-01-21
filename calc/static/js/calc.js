var Account = Backbone.Tastypie.Model.extend({
	urlRoot: '/api/v1/accounts',

	defaults: {
		name: 'Default name',
		initial_balance: 0.00,
		current_balance: 0.00,
		interest_rate: 0.00,
		overpayments: true,
		minimum_payment: 0.00
	},

	initialize: function(){
		// Initialize tranactions array for this account
		this.transactions = new TransactionList();
		this.transactions.url = this.urlRoot + '/' + this.id + '/transactions/';
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
	template: jsTemplates['accountView/nested'],

	events: {'click a': 'handleClick'},

	initialize: function(){
		// Create unique id for the element
		this.id = 'Account' + this.model.id;

		// Create link to this instance
		this.model.view = this;

		this.model.on('hide', this.remove, this);

		this.transactionListView = null;
		this.showTransactions = false;
	},

	render: function(){
		this.$el.attr('id', 'account'+this.model.id).html(this.template(this.model.toJSON()));
		return this;
	},

	handleClick: function(event){
		event.preventDefault();
		var url_ref = $(event.target).attr('href') + '/';
		calcApp.navigate(url_ref, {trigger: true});
	}
});


var AccountListView = Backbone.View.extend({
	el: '#content',

	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},

	addOne: function(accountItem){
		var accountView = new AccountView({
			model: accountItem,
			tagName: 'li'
		});
		this.$el.append(accountView.render().el);
	},

	addAll: function(){
		this.$el.html('');
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

	template: jsTemplates['transactionView/main'],

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});


var TransactionListView = Backbone.View.extend({
	el: '.transactionList',

	defaults: {
		account_id: 0
	},

	initialize: function(){
		// Reinitialize el since the DOM has changed
		this.elementString = '#account' + this.options.accountId + ' .transactionList'
		this.setElement($(this.elementString));

		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},

	addOne: function(transaction){
		var transactionView = new TransactionView({model: transaction});
		$(this.elementString).append(transactionView.render().el);

	},

	addAll: function(){
		this.collection.forEach(this.addOne, this);
	},

	render: function(){
		this.addAll();
		return this;
	}
});


var MainTransactionListView = Backbone.View.extend({
	el: '#content',

	defaults: {
		account_id: 0
	},

	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},

	addOne: function(transaction){
		var transactionView = new TransactionView({model: transaction});
		console.log(transactionView.render().el);
		this.$el.append(transactionView.render().el);

	},

	addAll: function(){
		this.$el.html('');
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
		'/': 'index',
		'accounts/': 'showAccountList',
		'accounts/:id': 'showAccount',
		'accounts/:id/': 'showAccount'
	},

	initialize: function(){
		this.accountList = new AccountList();
	},

	start: function(){
		Backbone.history.start({ pushState: true });
	},

	index: function(){
	},

	showAccountList: function(){
		this.accountList.fetch({update: true});

		this.accountListView = new AccountListView({
			collection: this.accountList
		});
	},

	showAccount: function(id){
		this.accountList.fetch({update: true});

		this.currentAccount = this.accountList.get(id);
		this.currentTList = new TransactionList({});
		this.currentTList.url = '/api/v1/accounts/' + id + '/transactions/';

		this.currentTLView = new MainTransactionListView({
			collection: this.currentTList
		});

		this.currentTList.fetch();
	}
});

// Create and start the app
var calcApp = new CalcApp();
$(function(){
	calcApp.start();
});
