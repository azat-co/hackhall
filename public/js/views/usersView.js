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
            this.$el.html(_.template(this.template));
            this.$el.find('#users-box').append('<img src="/img/loader.gif"/>');
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
            var usersView = this
            usersView.$el.find('#users-box').empty()
            this.collection.each(function(model) {
                // $('#posts-box').append(new PostView({model:model}).render().$el);
                // console.log(app.headerView.model.attributes)
                usersView.$el.find('#users-box').append(new UsersSubView({
                    model: model,
                    profile: app.headerView.model.attributes
                }).render().el);
            });
        },

        sortAlphabetically: function() {
            if (this.sortCount === 1 || this.sortCount =='undefined') {
                this.$el.html(_.template(this.template));
                var html = '';
                this.collection.comparator = function( model ) {
                  return model.get( 'firstName' );
                }
                this.collection.sort();
                this.render();
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

            // if (this.toggleDate === 0 || this.toggleDate == 'undefined') {

            // sorted = _.sortBy(this.collection.models, function (model) {
            //                 return new Date(model.attributes.created).toLocaleDateString();
            //             });
            // this.toggleDate = 1;

            // }else {
            this.toggleDate = this.toggleDate || 0
            this.collection.comparator = function(model){
                // return model.get('created')
                if (this.toggleDate === 0) {
                    this.toggleDate = 1;
                    return -(new Date(model.get('created'))).getTime()
                    // return -Date.parse(model.get('created'))
                } else {
                    this.toggleDate = 0;
                    return (new Date(model.get('created'))).getTime()
                    // return Date.parse(model.get('created'))
                }

            }
            this.collection.sort()
            this.render()
            // sorted = _.sortBy(this.collection.models,"created");


            // }

            // _.each(sorted, function(model) {
                // $('#users-box').append(new UsersSubView({
                    // model: model,
                    // profile: app.headerView.model.attributes
                // }).render().el);
            // });


        }

    });
});
