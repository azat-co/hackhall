define ([
	'libs/text!tpl/post.html',
], function (postTpl) {
	return viewPostView = Backbone.View.extend({
		el: "#content",
		events: {
			'click #comment-btn': 'comment'
		},
		initialize: function () {
			this.template = postTpl;
		},		
		render: function() {
			this.$el.html(_.template(this.template, {attr:this.model.attributes}));
		},
		load: function (id){
			this.model = new PostModel(id);
			this.model.bind('all', this.render, this);
			this.model.fetch({});
		},
		comment: function() {
			this.model.set({
				comment:$('form').toObject().comment,
				action:"comment"
			});		
			this.model.save({},{
				xhrFeilds:creds,
				success: function() {
					console.log("saved");
					app.alertsView.success("Saved!");
				},
				error: function(model,response){
					console.log('error');
					app.alertsView.error (response);
				}
			});
		}
	});	
})
	
