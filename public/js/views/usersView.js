define([
    'libs/text!tpl/users.html',
    'js/views/usersSubView'
], function(usersTpl, UsersSubView) {
    return UsersView = Backbone.View.extend({
        el: "#content",
        events: {

            'click #alaphabetic-sort ': 'sortAlphabetically',

        },

        template: usersTpl,

        initialize: function() {
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
            var sortCount = 0;
            if (this.sortCount === 0) {
                this.$el.html(_.template(this.template));
                var html = '';
                var sortedCollection = _.sortBy(this.collection.models, "firstName");
                _.each(sortedCollection, function(model) {
                    $('#users-box').append(new UsersSubView({
                        model: model,
                        profile: app.headerView.model.attributes
                    }).render().el);
                });
                this.sortCount = 1;                 

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

                this.sortCount = 0;
            }

        }

    });
});
