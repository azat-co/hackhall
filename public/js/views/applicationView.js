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
		successErrorOps: {
			success: function (model) {
				app.alertsView.success("Updated!");
			},
			error: function(response){
				app.alertsView.error(response);
		}},
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
				app.navigate('#login', true);
			}
			});
		},
		update: function(){
			applicationView = this
			// console.log(this.model);
			var updateData = this.$el.find('form').toObject();
			for (var key in updateData) {
				if (updateData[key]) {
					this.model.attributes[key] = updateData[key];
				}
			}
			console.log(this.model);
			this.model.save({}, applicationView.successErrorOps);
		},
		render: function() {
			var applicationView = this
			this.$el.html(_.template(this.template, {attr:this.model.attributes}));
			var handler = StripeCheckout.configure({
			   key: this.model.get('stripePub'),
			   image: '/img/webapplog-logo.png',

		    token: function(token) {

		      applicationView.model.set('stripeToken', token).save({}, applicationView.successErrorOps);
		      applicationView.model.set('isStripeToken', true)
		      // move this to hide/show and templates
					$('.stripe-button').fadeOut().after('<span> Credit/debit card is on file.</span>').after('<i class="icon-ok"></i>')
		    }
		  });

		  $('.stripe-button').on('click', function(e) {
		    // Open Checkout with further options
		    handler.open({
			    src: 'https://checkout.stripe.com/checkout.js',
			    class: 'stripe-button',
			    type: 'text/javascript',
			    currency: 'USD',
			    amount: '299',
			    name: 'Membership',
			    description: 'Membership fee is $2.99 per month to cover hosting and maintenance expenses.',
			    email: applicationView.model.get('email')
		    });
		    e.preventDefault();
		  });

		  // Close Checkout on page navigation
		  $(window).on('popstate', function() {
		    handler.close();
		  });

		}
	});
})