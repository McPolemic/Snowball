window.jsTemplates = {};

window.jsTemplates['accountView/nested'] = _.template(
	'<a href="/accounts/<%= id %>" class=\'calc\'><%= name %></a>'
);

window.jsTemplates['transactionView/main'] = _.template(
	'<%= date %> - <%= amount %>'
);