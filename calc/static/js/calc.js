var Account = Backbone.Tastypie.Model.extend({
	initialize: function(){},
});


var AccountList = Backbone.Tastypie.Collection.extend({
	model: Account,

	initialize: function(){
		this.on('remove', this.hideModel, this);
	},

	hideModel: function(model){
		model.trigger('hide');
	}
});


var AccountDetailView = Backbone.View.extend({
	template: jsTemplates['accountDetailView/accountDetails'],

	initialize: function(){
		this.ready = false;

		this.model.on('change', this.triggerReady, this);
		this.model.on('ready', this.readyAndRender, this);
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
	},

	renderWhenReady: function(){
		if (this.ready == true)
		{
			this.render();
		}
		{
			this.model.fetch({update: true, success: this.triggerReady});
		}
	},

	readyAndRender: function(){
		this.ready = true;
		this.render();
	},

	triggerReady: function(model){
		model.trigger('ready');
	}
});



var AccountView = Backbone.View.extend({
	template: jsTemplates['accountView/main'],

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
		calcApp.router.navigate(url_ref, {trigger: true});
	}
});


var AccountListView = Backbone.View.extend({
	className: 'accountList',

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
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},

	addOne: function(transaction){
		var transactionView = new TransactionView({model: transaction});
		this.$el.append(transactionView.render().el);
		console.log('rendering addOne');
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
var CalcRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'/': 'index',
		'accounts/': 'showAccountList',
		'accounts/:id': 'showAccount',
		'accounts/:id/': 'showAccount'
	},

	initialize: function(){
	},

	start: function(){
		Backbone.history.start({ pushState: true });
	},

	index: function(){
	},

	showAccountList: function(){
		calcApp.showAccountList();
	},

	showAccount: function(id){
		calcApp.showAccountDetails(id);
	}
});


// Create calcApp singleton
var calcApp = {
	currentSet: {},

	run: function(){
		// Set base_url for models and views to pull data
		this.base_api_url = '/api/v1'

		// Initialze base account collection
		this.accountList = new AccountList();
		this.accountList.url = this.base_api_url + '/accounts'

		// Start the Backbone router
		this.router = new CalcRouter();
		this.router.start();
	},

	showAccountList: function(){
		// If we have already created the accountListView,
		// don't create it again, just re-render it.
		if( this.accountListView == undefined )
		{
			this.accountListView = new AccountListView({
				collection: this.accountList
			});	
		}

		$('#content').html(this.accountListView.render().el);

		// After we've rendered the "current" data, pull
		// the data again to ensure we are actually current.
		// This way, there isn't a delay after a user navigates
		// to the page before content shows up.
		this.accountList.fetch({update: true});
	},

	showAccountDetails: function(id){
		// Set up the container
		baseTemplate = jsTemplates['accountDetailView/base'],
		$('#content').html(baseTemplate);

		// Render the account details
		this.currentSet.account = this.accountList.get(id);

		if (this.currentSet.account == undefined)
		{
			this.currentSet.account = new Account({id: id});
		};

		this.currentSet.account.urlRoot = this.base_api_url + '/accounts/';

		this.currentSet.accountDetailView = new AccountDetailView({model: this.currentSet.account});
		this.currentSet.accountDetailView.setElement($('#accountDetails'));
		this.currentSet.accountDetailView.renderWhenReady();

		this.currentSet.account.fetch({update: true});

		// Now render the transactions
		var url = this.currentSet.account.urlRoot + id + '/transactions/';
		this.currentSet.transactions = new TransactionList({url: url});
		this.currentSet.transactions.url = url;

		this.currentSet.transactionListView = new TransactionListView({
			collection: this.currentSet.transactions
		});
		this.currentSet.transactionListView.setElement('#transactions');

		this.currentSet.transactions.fetch();
	}

}

// Once document is loaded, start the app
$(function(){
	calcApp.run();
});
