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