
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
	urlRoot: '/api/accounts',

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
	url: '/api/accounts'
});

var Transaction = TastypieModel.extend({
	defaults: {
		account_id: 0,
		date: '01/01/0101',
		amount: 0.00
	}
});

var TransactionList = Backbone.Collection.extend({
	url: '/transactions'
});


var AccountView = Backbone.View.extend({
	template: _.template('<li><%= name %> - <%= interest_rate %>%</li>'),

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var AccountListView = Backbone.View.extend({
	el: '#accountList',

	template: _.template('<li>test item</li>'),

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

var calcApp = new CalcApp();

$(function(){
	calcApp.start();
});
