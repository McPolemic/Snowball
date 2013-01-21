
// The following two methods were required to make backbone.js and 
// tastypie-django work together
//
// They were written by Daniel Lindsley and publicly posted
// on Patrick Altman's blog
// http://paltman.com/2012/04/30/integration-backbonejs-tastypie/

window.TastypieModel = Backbone.Model.extend({
    base_url: function() {
      var temp_url = Backbone.Model.prototype.url.call(this);
      return (temp_url.charAt(temp_url.length - 1) == '/' ? temp_url : temp_url+'/');
    },

    url: function() {
      return this.base_url();
    }
});


window.TastypieCollection = Backbone.Collection.extend({
    parse: function(response) {
        this.recent_meta = response.meta || {};
        return response.objects || response;
    }
});


var Account = TastypieModel.extend({
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


var AccountList = TastypieCollection.extend({
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


var Transaction = TastypieModel.extend({
	urlRoot: '/api/v1/transactions',

	defaults: {
		account_id: 0,
		date: '01/01/0101',
		amount: 0.00
	}
});


var TransactionList = TastypieCollection.extend({
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


var TransactionListView = Backbone.Collection.extend({
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
