define ([
		'libs/text!tpl/header.html'
		], function (headerTpl){
 	return Backbone.View.extend({
		el: "#header",
		template: headerTpl,
		pageName: '',
		initialize: function() {
			this.model = new ProfileModel();
			this.model.bind('login',this.load,this);
			this.model.bind('change', this.render, this);
			this.model.fetch({
				xhrFields: {
				withCredentials: true
			},
			error: function (){
				// console.log('!!')
				// app.navigate("#login", true);
			}});
		},
		load: function(){
			this.model.fetch({
				xhrFields: {
					withCredentials: true
				},
				success: function() {
					console.log('!')
					app.headerView.model.trigger('change');
				},
				error: function (){
					console.log('!')
					app.navigate("#login", true);
				}
			});
		},
		render: function() {
			this.$el.html(_.template(this.template,{attr:this.model.attributes}));
			this.menu();
		},
		menu: function (){

			if (this.pageName){
				// this.pageName = this.pageName.match(/\/page\/(.*)/)[1];
				$(".active").removeClass('active');
				var nav = $('.nav');
				nav.find('a[href="#'+this.pageName+'"]').parent().addClass('active');
				// console.log(nav);
				// console.log(this.pageName);
				// console.log(nav.find('a[href="#'+this.pageName+'"]'));
			}
		}

	});

});