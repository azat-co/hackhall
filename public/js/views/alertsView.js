define([
	'libs/text!tpl/alerts.html',
	'js/collections/alertsCollection'
	], function (alertsTpl,AlertsCollection) {
		return Backbone.View.extend({
			el:"#alerts-box",
			template: alertsTpl,
			initialize: function() {
				this.collection = new AlertsCollection;
				this.collection.bind('add', this.renderAlert, this);
				this.collection.bind('destroy',this.renderState, this)
			},
			renderState: function(model){
				// console.log('renderstate')
				this.$el.html(_.template(alertsTpl, {models: this.collection.models}));
			},
			renderAlert: function(model){
				// console.log(model)
				// console.log(this.collection);
				// console.log(this.$el)
				this.$el.html(_.template(alertsTpl, {models: this.collection.models}));
				this.collection.remove(this.collection.models,{silent:true});
			},
			error: function(response){
				if (typeof response ==="string") {
					app.alertsView.collection.add ({
						text: response, 
						status: '', 
						error:'', 
						type:"error"
					});										
				}
				else {
					try {
						app.alertsView.collection.add ({
							text: JSON.parse(response.responseText).error, 
							status: response.status, 
							error:response.statusText,
							type:"error"
						});					
					}
					catch (e) {
						app.alertsView.collection.add ({
							text: response.responseText, 
							status: response.status, 
							error:response.statusText,
							type:"error"
						});											
					}
				}
			},
			success: function(response){
				if (typeof response ==="string") {
					app.alertsView.collection.add ({
						text: response, 
						status: '', 
						error:'', 
						type:"success"
					});										
				}
				else {
					try {
						app.alertsView.collection.add ({
							text: JSON.parse(response.responseText).error, 
							status: response.status, 
							error:response.statusText, 
							type:"success"
						});					
					}
					catch (e) {
						app.alertsView.collection.add ({
							text: response.responseText, 
							status: response.status, 
							error:response.statusText, 
							type:"success"
						});											
					}	
				}			
			}
		});
	})