define ([
	'libs/text!tpl/usersSub.html'
], function (usersSubTpl){
	return Backbone.View.extend({
		tagName: "div",
		className: "item span3",
		// model: PostModel,
		template: usersSubTpl,
		events: {
			'click .promote': 'promote',
			'click .demote': 'demote',
			'click .approve': 'approve',
			'click .ban': 'ban',
			'click .delete': 'delete'

		},
		initialize: function(options) {
			this.model = options.model;
			this.model.profile = options.profile;
			this.model.id = this.model.attributes._id;
			this.model.bind('change',this.render,this);

		},
		render: function(){
			// console.log('rendering item')
			this.$el.html(_.template(this.template,{model:this.model}));
			return this;
		},
		promote: function(){
			console.log('promote'+this.model.id);
			this.model.attributes.admin = true;
			this.model.save({},{
				xhrFeilds:creds,
				success: function(model, response) {
					app.alertsView.success("Promoted!");
				},
				error: function(model,response){
					app.alertsView.error (response);
				}
			});
		},
		demote: function () {
			console.log('demote'+this.model.id);
			this.model.attributes.admin = false;
			this.model.save({},{
				xhrFeilds:creds,
				success: function(model, response) {
					app.alertsView.success("Demoted!");
				},
				error: function(model,response){
					app.alertsView.error (response);
				}
			});
		},
		delete: function () {
			console.log('delete'+this.model.id);
			this.model.destroy({
				success: function(model,response){
					console.log(app.alertsView.collection);
					app.alertsView.success("Deleted!");
				},
				error: function(model, response){
					console.log(response);
					app.alertsView.error (response);
				}
			});

		},
		approve: function(){
			console.log('approve'+this.model.id)
			this.model.attributes.approved = true;
			this.model.attributes.approvedNow = true; //this flag is needed to differentiate between approval update and all others
			// this.model.attributes.watch = true;
			this.model.save({},{
				xhrFeilds:creds,
				success: function(model, response) {
					app.alertsView.success("Approved!");
				},
				error: function(model,response){
					app.alertsView.error (response);
				}
			});
		},
		ban: function(){
			console.log('ban'+this.model.id)
			this.model.attributes.banned = true;
			this.model.save({},{
				xhrFeilds:creds,
				success: function(model, response) {
					app.alertsView.success("Banned!");
				},
				error: function(model,response){
					app.alertsView.error (response);
				}
			});
		}

	});
});