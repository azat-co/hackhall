define([
	'libs/text!tpl/postAdd.html', 
], function (postAddTpl){
	return addPostView = Backbone.View.extend({
		el: "#content",

		events: {
			'click #add-post-btn': 'addPost'
		},
		initialize: function () {

			this.template = postAddTpl;
		},		
		render: function() {
			this.$el.html(_.template(this.template));
		},
		addPost: function() {
			this.model= new PostModel();
			// console.log(JSON.stringify($('form').serializeArray()));
			console.log($('form').toObject());			
			var formAdd = $('form').toObject();
			this.model.set('title',formAdd.title || '');
			this.model.set('text',formAdd.text);
			this.model.set('url',formAdd.url);
			this.model.save({},{
				xhrFeilds:creds,
				success: function() {
					console.log("added!");
					app.navigate('#posts', true);
				},
				error : function (model, response) {
					app.alertsView.error(response);
				}				
			});
		}
	});
})