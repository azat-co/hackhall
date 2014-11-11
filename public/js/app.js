requirejs.config({
	// urlArgs: "bust=" +  (new Date()).getTime() 
	//REMOVE in PROD	
    //By default load any module IDs from js/lib
    // baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    // paths: {
        // app: '../app'
    // }
 	// creds: {
		// withCredentials: true
	// }
});
var creds ={
	withCredentials: true
};
// 
// var opt = {
// 	xhrFields: {
// 		withCredentials: true
// 	},
// 	error: function (){		
// 		app.navigate("#login", true);
// 	}
// };
require([
	'libs/text!tpl/home.html', 
	'libs/text!tpl/signup.html', 
	'libs/text!tpl/thankyou.html', 
	'libs/text!tpl/login.html', 
	'libs/text!tpl/profile.html', 
	
	'js/views/headerView',
	'js/views/alertsView',
	'js/views/footerView',
	'js/views/aboutView',
	'js/views/postsView',
	'js/views/postsSubView',
	'js/views/postView',
	'js/views/postAddView',
	'js/views/usersView',
	'js/views/userView',
	'js/views/applicationView',
	
	'js/models/post-model'
], 
	function (
		homeTpl, 
		signupTpl, 
		thankyouTpl,
		loginTpl, 
		profileTpl, 
		
		HeaderView,
		AlertsView,
		FooterView,
		AboutView,
		PostsView,
		PostsSubView,
		PostView,
		PostAddView,
		UsersView,
		UserView,
		ApplicationView,
		
		PostModel
		
	) {
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "login",
			"about": "about",
			"apply": "signup",
			"login": "login",
			"profile": "profile",
			"logout": "logout",
			"posts": "posts",
			"posts/new": "addPost",
			"posts/?skip=:skip": "posts",
			"posts/:id": "viewPost",
			"people": "people",
			"people/:id": "viewUser",
			"thankyou": "thankyou",
			"application":"application",
			"*actions": "login"
		},
		initialize: function() {
			this.headerView = new HeaderView();		
			this.headerView.render();
			this.alertsView = new AlertsView();
			this.footerView = new FooterView();
			this.footerView.render();
			this.aboutView = new AboutView();
			this.signupView = new SignupView();
			this.loginView = new LoginView();
			this.profileView = new ProfileView();
			this.postsView = new PostsView();
			this.postView = new PostView();
			this.usersView = new UsersView();
			this.userView = new UserView();
			this.postAddView = new PostAddView();	
			this.applicationView = new ApplicationView();		
			this.bind('all', this.menu, this);
		},
		home: function() {			
			this.homeView = new HomeView();
			this.homeView.render();
		},
		about: function() {
			this.aboutView.render();
		},
		signup: function() {
			this.signupView.render();
		},
		thankyou: function(){
			this.signupView.renderThankYou();
		},
		login: function() {
			this.loginView.render();
		},
		profile: function() {
			this.profileView.load();
		},
		posts: function(skip){
			var s = skip || 0;
			this.postsView.load(s);
		},
		addPost: function (){
			this.postAddView.render();
		},
		viewPost: function(id){
			this.postView.load(id);
		},
		people: function() {
			this.usersView.load();
		},		
		viewUser: function(id) {
			this.userView.load(id);			
		},
		application: function(){
			this.applicationView.get();
		},
		logout: function() {
			$.post("/api/logout",
			"",
			function(data, status, xhr){
				if (data.msg=="Logged out") {
					app.headerView.model.clear();		
					app.profileView.model.clear();
					app.navigate('#home', true);
				}
			}, "json");
			
		},
		menu: function() {
			// console.log('!')
			//navigation thru menu by clicking
			if (this.headerView.pageName!='' && this.headerView.pageName!=Backbone.history.fragment) { 
				this.headerView.pageName=Backbone.history.fragment;
				this.headerView.menu();

			}
			else { //in case of force refresh
				this.headerView.pageName=Backbone.history.fragment;
			}
			// console.log(app.alertsView.collection)
			app.alertsView.renderState();
			// app.alertsView.collection.remove(app.alertsView.collection.models,{silent:false});
			// $(".active").removeClass('active');
			// var nav = $('.nav');
			// nav.find('a[href="#'+Backbone.history.fragment+'"]').parent().addClass('active');
			// console.log(nav)
			// console.log(nav.find('a[href="#'+Backbone.history.fragment+'"]'))
			// console.log('a[href="#'+Backbone.history.fragment+'"]');

			// console.log(nav)
			// console.log(nav.find('a[href="#'+Backbone.history.fragment+'"]'))
			// console.log('a[href="#'+Backbone.history.fragment+'"]');
		}						
	});

	HomeView = Backbone.View.extend({
		el: "#content",
		template: homeTpl,
		initialize: function() {

		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});

	SignupView = Backbone.View.extend({
		el: "#content",
		template: signupTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		},
		renderThankYou: function() {
			this.$el.html(_.template(thankyouTpl));
		}
	});
	LoginView = Backbone.View.extend({
		el: "#content",
		template: loginTpl,
		events: {
			'click #login': 'login'
		},
		login: function() {
			var email = $("input[name=email]").val();
			var password = $("input[name=password]").val();
			// console.log('!')
			$.ajax({
				url: "/api/login/",
				type: "post",
				data: {
					email: email,
					password: password
				},
				success: function (data,status,xhr) {
					console.log (data)
					if (data.msg=="Authorized") {
						app.headerView.model.trigger('login');
						app.navigate('#posts', true);
					}

				},
				error: function (xhr, status, error) {
					console.log(error);
					console.log(xhr);
					app.alertsView.collection.add ({text: JSON.parse(xhr.responseText).error, status: status, error:error});
					
				}
			})
		},
		render: function() {
			this.$el.html(_.template(this.template));
			this.$el.find('form input').keydown(function(e) {
			    if (e.keyCode == 13) {
		            $(this).blur();
		            $('#login').focus().click();
			    }
			});			
		}
	});		
	ProfileView = Backbone.View.extend({
		el: "#content",
		template: profileTpl,
		events: {
			'click #delete': 'destroy'
		},
		initialize: function() {
			this.model = new ProfileModel;			
			this.model.bind('change', this.render, this);
		},
		destroy: function() {
				console.log('s');
			console.log(this.model.url)
			this.model.id = this.model.attributes._id;
			this.model.destroy({
				success: function() {
					// app.profileView.render();
					app.alertsView.success("Deleted!");					
					$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();						
					app.navigate("#login",true);
				},
				error: function(response) {
					// console.log('error!');
					// app.navigate('#login',true);
					app.alertsView.error (response);					
				}				
			});			
		},
		load: function(id) {
			this.model.fetch({
				xhrFields: {
			      withCredentials: true
			   },
				success: function() {
					console.log('s');	
					app.profileView.render();	
				},
				error: function() {
					console.log('error!');
					app.navigate('#login',true);
					app.alertsView.error (response);					
				}
			// 401: function (){
			// 	app.navigate("#login", true);
			// }		
			});
		},
		render: function() {
			// console.log(this.model.attributes.posts)				
			if (this.model.attributes.posts){
				this.model.attributes.own = true;
				this.$el.html(_.template(this.template, {attr:this.model.attributes, profile:this.model.attributes}));
			}			
		}
	});	

	ProfileModel = Backbone.Model.extend({
		url: "/api/profile"		
	});
	UserModel = Backbone.Model.extend({
		url: "/api/users/",
		idAttribute: "_id",
		initialize: function(id){
			// console.log(id)
			if (id) {
				this.id= id;
				this.url=this.url+this.id;
				// console.log(this.url)				
			}
		}	
	});
	UsersCollection = Backbone.Collection.extend({
		url: "/api/users",
		comparator: function(m) {
			var temp = new Date(m.get('created')).toLocaleDateString();			
        	m.set('created',temp);        	
    	}		
	});	
	HeaderModel = Backbone.Model.extend({		

	});
	ApplicationModel = Backbone.Model.extend({
		url: 'api/application',
		idAttribute: "_id"
	});


	ViewUserView = Backbone.View.extend({
		el:"#content",
		// model: new UserModel,
		template: profileTpl,
		initialize: function(){

		},
		load: function(id){
			// this.model.id = id;
			// this.model.set({id:id});
			// console.log(id)
			this.model = new UserModel(id);
			this.model.bind('all', this.render, this);
			this.model.fetch();
			// console.log('loading is done')
		},
		render: function() {
			this.$el.html(_.template(this.template, {attr:this.model.attributes}));
			// console.log('rendering is done')
		}
	});

	app = new ApplicationRouter();
	Backbone.history.start();	
});


