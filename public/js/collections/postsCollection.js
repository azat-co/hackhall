define([
	'js/models/post-model'
	], function (PostModel) { 
	return PostsCollection = Backbone.Collection.extend({
	url: "/api/posts",
	// model: PostModel,
	parse:  function(response){
		this.limit = response.limit;
		this.total = response.total;
		this.skip = response.skip;
		return response.posts;
	}		
}); });