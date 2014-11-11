define([
    'libs/text!tpl/users.html',
    'js/views/usersSubView'
], function(usersTpl, UsersSubView) {
    return UsersView = Backbone.View.extend({
        el: "#content",
        events: {

            'click #alaphabetic-sort ': 'sortAlphabetically',

            'click #date-sort ': 'sortByDate'

        },

        template: usersTpl,

        initialize: function() {
            this.sortCount = 1;
            this.toggleDate = 1;
            this.collection = new UsersCollection;
            this.collection.bind('all', this.render, this);
            // this.collection.model.bind('update', function(){console.log('update')}, this);
            // this.collection.model.bind('change', function(){console.log('change')}, this);
        },
        load: function() {
            this.collection.fetch({
                xhrFeilds: creds,
                success: function() {},
                error: function(xhr, status, error) {
                    // console.log({text: JSON.parse(xhr.responseText).error, status: status, error:error});
                    // app.alertsView.collection.add ({text: JSON.parse(xhr.responseText).error, status: status, error:error});
                    app.navigate("#login", true);
                }
            });
        },
        render: function() {
            this.$el.html(_.template(this.template));
            var html = '';
            _.each(this.collection.models, function(model) {
                // $('#posts-box').append(new PostView({model:model}).render().$el);
                // console.log(app.headerView.model.attributes)
                $('#users-box').append(new UsersSubView({
                    model: model,
                    profile: app.headerView.model.attributes
                }).render().el);
            });
        },

        sortAlphabetically: function() {            
            if (this.sortCount === 1 || this.sortCount =='undefined') {
                this.$el.html(_.template(this.template));
                var html = '';
                var sortedCollection = _.sortBy(this.collection.models, "firstName");
                _.each(sortedCollection, function(model) {
                    $('#users-box').append(new UsersSubView({
                        model: model,
                        profile: app.headerView.model.attributes
                    }).render().el);
                });                
                this.sortCount = 0;                 

            } else {            	
                this.$el.html(_.template(this.template));
                var html = '';
                _.each(this.collection.models, function(model) {
                    // $('#posts-box').append(new PostView({model:model}).render().$el);
                    // console.log(app.headerView.model.attributes)
                    $('#users-box').append(new UsersSubView({
                        model: model,
                        profile: app.headerView.model.attributes
                    }).render().el);
                });

                this.sortCount = 1;
            }

        },

        sortByDate: function() {
            this.$el.html(_.template(this.template));
            var html = '';             
            var sorted;
            if (this.toggleDate === 0 || this.toggleDate == 'undefined') {

            sorted = _.sortBy(this.collection.models, function (model) {
                            return new Date(model.attributes.created).toLocaleDateString();
                        }); 
            this.toggleDate = 1;

            }else {
            
            sorted = _.sortBy(this.collection.models,"created"); 
            this.toggleDate = 0;
    
            }
            
            _.each(sorted, function(model) {
                $('#users-box').append(new UsersSubView({
                    model: model,
                    profile: app.headerView.model.attributes
                }).render().el);
            });
                               

        }

    });
});
