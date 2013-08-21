define([
	'libs/text!tpl/application.html'
], function (applicationTpl){
	return ApplicationView = Backbone.View.extend({
		el: "#content",
		template: applicationTpl,
		events: {
			'click #update': 'update'
		},
		initialize: function() {
		},
		get: function() {
			this.model = new ApplicationModel();			
			this.model.bind('change', this.render, this);			
			this.model.fetch({
				xhrFields: {
			      withCredentials: true
			   },
			success: function() {
				app.alertsView.success("You application has been submitted! Wait for approval email. You may comeback and update it at any time.");	
				console.log('s');	

			},
			error: function(response) {
				console.log('error!');
				app.alertsView.error(response);
			}			
			});
		},
		update: function(){
			// console.log(this.model);
			var updateData = this.$el.find('form').toObject();
			for (var key in updateData) {
				if (updateData[key]) {
					this.model.attributes[key] = updateData[key];
				}				
			}			
			console.log(this.model);			
			this.model.save({},{
				success: function (model) {
					app.alertsView.success("Updated!");
			},
				error: function(response){
					app.alertsView.error(response);
			}});
		},
		render: function() {					
			this.$el.html(_.template(this.template, {attr:this.model.attributes}));
		}		
	});
})