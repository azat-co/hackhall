define([
	'libs/text!tpl/posts.html', 
	'js/collections/postsCollection',
	'js/views/postsSubView'
], function (postsTpl,PostsCollection, PostsSubView){
	return PostsView = Backbone.View.extend({
		el: "#content",
		template: postsTpl,
		initialize: function() {
			this.collection = new PostsCollection;
			this.collection.bind('all',this.render, this);
			this.collection.model.bind('change', function(){console.log('change')}, this);
		},
		load: function(skip) {
			this.collection.url = '/api/posts/'+'?skip='+skip;
			this.collection.fetch({xhrFeilds:creds, 
				success: function(model) {
					console.log(model.length)
				},
				error: function(response){
					app.alertsView.error(response);
				}
			});	
		},
		render: function() {
			this.$el.html(_.template(this.template,{limit:this.collection.limit, skip:this.collection.skip}));
			var html ='';
			_.each(this.collection.models,function(model){
				$('#posts-box').append(new PostsSubView({model:model}).render().el);
			});
			if (((Number(this.collection.length)+Number(this.collection.skip)) < Number(this.collection.total))) {
				$('.pagination').show();
			}
			else {
				$('.pagination').hide();
			}
		}
	});
})