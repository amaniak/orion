orion.attributes.registerAttribute('createdBy', {
  columnTemplate: 'createdByColumn',
  getSchema: function(options) {
    return {
      type: String,
      autoform: {
        omit: true
      },
      optional: true,
      autoValue: function() {
        if (this.isInsert) {
          return this.userId;
        } else if (this.isUpsert) {
          return { $setOnInsert: this.userId };
        } else {
          this.unset();
        }
      }
    };
  }
});

if (Meteor.isServer) {
  Meteor.publish('userProfileForCreatedByAttributeColumn', function(userId) {
    check(userId, String);
    return Meteor.users.find({ _id: userId }, { fields: { profile: 1 } });
  });
}
if (Meteor.isClient) {
  ReactiveTemplates.onRendered('attributeColumn.createdBy', function() {
    this.subscribe('userProfileForCreatedByAttributeColumn', this.data.value)
  });
  ReactiveTemplates.helpers('attributeColumn.createdBy', {
    name: function() {
      var user = Meteor.users.findOne(this.value)
      return user && user.profile.name;
    }
  });
}