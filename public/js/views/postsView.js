define([
	'libs/text!tpl/posts.html', 
	'js/collections/postsCollection',
	'js/views/postsSubView'
], function (postsTpl,PostsCollection, PostsSubView){
	return PostsView = Backbone.View.extend({
		el: "#content",

		events: {
			'click #alaphabetic-sort ': 'sortAlphabetically',		
			'click #date-sort': 'sortByDate',
		},

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
		},

		sortAlphabetically: function() {
			this.$el.html(_.template(this.template,{limit:this.collection.limit, skip:this.collection.skip}));
			var html = '';			
			var sortedCollection = _.sortBy(this.collection.models, "title");
			sortedCollection.skip = this.collection.skip;
			sortedCollection.total = this.collection.total;
			_.each(sortedCollection,function(model){				
				$('#posts-box').append(new PostsSubView({model:model}).render().el);
			});
			if (((Number(sortedCollection.length)+Number(sortedCollection.skip)) < Number(sortedCollection.total))) {
				$('.pagination').show();
			}
			else {
				$('.pagination').hide();
			}
			
		},

		sortByDate: function() {
			var html ='';


		}
	});
})