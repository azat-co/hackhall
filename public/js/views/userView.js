define([
	'libs/text!tpl/profile.html'
], function (profileTpl){
	return UserView = Backbone.View.extend({
		el: "#content",
		template: profileTpl,
		initialize: function() {

		},
		events: {
			'change .roles': 'updateRole'
		},
		updateRole: function(obj){
			console.log(obj);
			$('.roles').hide();
			$('.roles-loader').show();
			this.model.attributes.role = obj.currentTarget.value;
			// this.model.attributes.watch = true;
			this.model.save({},{
				xhrFeilds:creds, 
				success: function(model, response) {
					app.alertsView.success("Changed!");						
					$('.roles').show();
					$('.roles-loader').hide();					
				},
				error: function(model,response){
					app.alertsView.error (response);					
					$('.roles').show();
					$('.roles-loader').hide();
				}
			});			
		},
		load: function(id) {
			this.model = new UserModel(id);			
			this.model.bind('change', this.render, this);			
			this.model.fetch({
				xhrFields: {
			      withCredentials: true
			   },
			success: function() {
				console.log('s');	
				// app.profileView.render();	
			},
			error: function() {
				console.log('error!');
				// app.navigate('#signup',true);
			}			
			});
		},
		render: function() {					
			this.$el.html(_.template(this.template, {attr:this.model.attributes,profile:app.headerView.model.attributes}));
		}		
	});
})