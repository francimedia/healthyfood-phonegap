var View     = require('./view')
  , template = require('./templates/venueitem')
  , VenueItemModel = require('../models/venueItem')

module.exports = View.extend({
    id: '', 
    tagName: 'li',
    template: template,

    initialize: function() {
        this.model = new VenueItemModel(this.options.model);
    },

    render: function(){
        this.id = this.options.model.id;
        this.$el.attr('data-id', this.id);
        // this.$el.html(this.options.model.name)
        this.$el.html(this.template(this.options))
        this.afterRender()
        return this

    }

})
