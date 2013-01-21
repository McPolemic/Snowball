window.jsTemplates = {};

window.jsTemplates['accountView/nested'] = _.template(
	'<%= name %> - <%= interest_rate %>%'
);

window.jsTemplates['transactionView/main'] = _.template(
	'<%= date %> - <%= amount %>'
);