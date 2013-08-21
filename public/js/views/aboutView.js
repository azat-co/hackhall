define([
	'libs/text!tpl/about.html'
], function (aboutTpl){
	return AboutView = Backbone.View.extend({
		el: "#content",
		template: aboutTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	});
});
	