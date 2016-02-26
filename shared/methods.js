Meteor.methods({
	updateChat:function(chatid,chat){
		if(chat){
			if(!this.userId){
				console.log("not logged in");
				return false;
			}
			else{
				if(chat.user1Id==this.userId || chat.user2Id==this.userId ){
					Chats.update({_id:chatid}, chat);
					//console.log(chat);
					return true;
				}
				else{
					console.log("check fail");
					return false;
				}
			}
		}
		console.log("empty chat");
		return false;
	},
	createChat: function(user1Id,user2Id){
		if(this.userId){
			var filter = {$or:[
                {user1Id:user1Id, user2Id:user2Id}, 
                {user2Id:user1Id, user1Id:user2Id}
                ]};
    		var exchat = Chats.findOne(filter);
    		if(exchat){
    			//console.log("found ex chat");
    			return exchat;
    		}
			else if(user1Id==this.userId || user2Id==this.userId ){
				chat = Chats.insert({user1Id:user1Id, user2Id:user2Id});
				//console.log(chat);
				return chat;
			}
			else{
				//console.log("check fail");
				return false;
				
			}
		}
		//console.log("not logged in");
		return false;
	}
});