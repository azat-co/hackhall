define([
	'libs/text!tpl/postsSub.html',
	'libs/text!tpl/postsEdit.html',
	'js/models/post-model'
	], function (
	postsSubTpl,
	postsEditTpl,
	PostModel ) {
	return PostView = Backbone.View.extend({
		tagName: "p",
		className: "post-item",
		// model: PostModel,
		template: postsSubTpl,	
		modalEl: "#edit-box",
		// modalBody: '.modal-body',
		events: {
			'click .edit-post': 'edit',
			'click .like-post': 'like',
			'click .watch-post': 'watch',
			'click .save-post': 'save',
			'click .remove': 'remove'			
		},
		initialize: function(options) {
			this.model = new PostModel (options.model);
			this.model.bind('change',this.render,this);
			this.model.bind('clean',this.clean,this);
			// console.log(this.model.url());
			// this.model.url) {return'/api/posts/'+this.model.id};
			// console.log(this.model.url);
		},
		render: function(){
			console.log('inside of render posts-sub-view')
			//hack to remove backdrop from TB modal because modal('hide') is not working due to not existence of the modal by this time
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
			this.$el.html(_.template(this.template,{attr:this.model.attributes}));
			return this;
		},
		clean: function(){
			console.log('inside of clean posts-sub-view')			
			this.$el.remove();
		},
		edit: function(){			
			var editBox = this.$el.find('.edit-box');
			editBox.html(_.template(postsEditTpl,{attr:this.model.attributes}));
			editBox.find('.modal').modal('show');
		},
		save: function() {
			// console.log(this.model);
			// console.log('before: '+this.model.id);
			// console.log('before: '+this.model.url);			
			// console.log(this.model);
			var editBox = this.$el.find('.edit-box').find('form').toObject();
			this.model.attributes.title = editBox.title;
			this.model.attributes.text = editBox.text;
			// this.model.set('text', editBox.text);
			this.model.attributes.url = editBox.url;
			// console.log(editBox.text);
			// console.log(this.model.attributes.text);
			this.model.save({},{
				success: function (model) {
					app.alertsView.success("Saved!");										
				},
				error: function(model, response){
					app.alertsView.error (response);
				}
			});
		},
		close:function(){
			$(this.modalEl).modal('hide');			
		},
		watch: function(){
			if (!this.model.attributes.watches || this.model.attributes.watches.indexOf(app.headerView.model.attributes._id)<0) {
				this.model.attributes.action = "watch";
				this.model.attributes.watch = true;
				this.model.save({			
				},{
					xhrFeilds:creds, 
					success: function(model) {	
						app.alertsView.success("You're watching the post now!");						
						model.trigger('change');
					},
					error: function(model, response){
						app.alertsView.error (response);
					}
				});
			}
			else {
				// app.alertsView.collection.add ({text: "You can't watch twice", status: "2", error:"3"});
				app.alertsView.error ("You can't watch twice");
			}
		},
		like: function(){

			if (!this.model.attributes.likes || this.model.attributes.likes.indexOf(app.headerView.model.attributes._id)<0) {
				this.model.attributes.action = "like";
				this.model.attributes.like = true;
				this.model.save({			
				},{
					xhrFeilds:creds, 
					success: function(model) {
						app.alertsView.success("You like the post now!");	
						model.trigger('change');
					},
					error: function(model, response){
						app.alertsView.error (response);
					}
				});			
			}
			else {
				app.alertsView.error ("You can't like twice");
			}
		},
		remove: function () {

			this.model.destroy({
				success: function(model,response){
					console.log(app.alertsView.collection);		
					app.alertsView.success("Deleted!");
					model.trigger('clean');					
					console.log(model)
				},
				error: function(model, response){
					console.log(model);					
					console.log(response);					
					app.alertsView.error (response);
				}
			});		
		}
	});
});