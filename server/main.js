Meteor.publish("users", function(){
	return Meteor.users.find();
});

Meteor.publish("chats",function(){
	var filter = {$or:[
	            {user1Id:this.userId}, 
	            {user2Id:this.userId}
	            ]};
	var chat = Chats.find(filter);
	return chat;
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile && user.services.facebook) {
        options.profile.avatar = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        options.profile.username = user.services.facebook.first_name + user.services.facebook.last_name;
        user.profile = options.profile;
    }
    return user;
});