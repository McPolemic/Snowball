window.jsTemplates = {};

window.jsTemplates['accountView/main'] = _.template(
	'<a href="/accounts/<%= id %>" class=\'calc\'><%= name %></a>'
);

window.jsTemplates['transactionView/main'] = _.template(
	'<%= date %> - <%= amount %>'
);

window.jsTemplates['accountDetailView/base'] = _.template(
	'<div id="accountDetails"></div><div id="transactions"></div>'
);

window.jsTemplates['accountDetailView/accountDetails'] = _.template(
	'<h1><%= name %></h1><br><p>Initial Balance:  <%= initial_balance %></p>'
);

window.jsTemplates['accountDetailView/transactions'] = _.template(
	'<%= date %> - <%= amount %>'
);
