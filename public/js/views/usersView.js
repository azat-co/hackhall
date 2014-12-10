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
            this.sortCount = 0;
            this.toggleDate = 0;
            this.collection = new UsersCollection;
            this.collection.bind('all', this.render, this);
        },
        load: function() {
            this.$el.html(_.template(this.template));
            this.$el.find('#users-box').append('<img src="/img/loader.gif"/>');
            this.collection.fetch({
                xhrFeilds: creds,
                success: function() {},
                error: function(xhr, status, error) {
                    app.navigate("#login", true);
                }
            });
        },
        render: function() {
            var usersView = this
            usersView.$el.find('#users-box').empty()
            this.collection.each(function(model) {
                usersView.$el.find('#users-box').append(new UsersSubView({
                    model: model,
                    profile: app.headerView.model.attributes
                }).render().el);
            });
        },

        sortAlphabetically: function() {
            this.sortCount = this.sortCount || 0
            if (this.sortCount === 0) {
                this.collection.comparator = function( model ) {
                    return model.get('firstName');
                }
                this.sortCount = 1;
                this.toggleDate = 0;
                this.collection.sort();
            } else {
                this.collection.models.reverse();
                this.sortCount = 0;
            }

            this.render();

        },

        sortByDate: function() {
            this.toggleDate = this.toggleDate || 0
            if (this.toggleDate === 0) {
                this.toggleDate = 1;
                this.sortCount = 0;
                this.collection.comparator = function(model){
                    return (new Date(model.get('created'))).getTime()
                }
            } else {
                this.toggleDate = 0;
                this.collection.comparator = function(model){
                    return -(new Date(model.get('created'))).getTime()
                }
            }
            this.collection.sort()
            this.render()
        }

    });
});
