
// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
 if(Meteor.user()){
  Router.go('/chats')
 }
  this.render("login"); 

});

Router.route('/register', function () {
 if(Meteor.user()){
  Router.go('/chats')
 }
  this.render("register", {to:"main"}); 
});

Router.route('/reset', function () {
 if(Meteor.user()){
  Router.go('/chats')
 }
  this.render("passwordRecovery", {to:"main"}); 
});

Router.route('/chats', function () {
  if(!Meteor.user()){
   //Router.go('/')
 }
  this.render("navbar", {to:"header"});
  this.render("lobby_page", {to:"main"}); 

});

// route for p2p chats
Router.route('/chat/:_id', function () {
  if(!Meteor.user()){
    this.render("navbar", {to:"header"});
    this.render("lobby_page", {to:"main"});
    Router.go('/');
    $('.ui.basic.modal')
    .modal({
      closable  : false,
      onApprove : function() {
        $('#login-dropdown').click();
      }
    });
    $('.ui.basic.modal').modal('show');

  }
  else{
  var otherUserId = this.params._id;

  var filter = {$or:[
              {user1Id:Meteor.userId(), user2Id:otherUserId}, 
              {user2Id:Meteor.userId(), user1Id:otherUserId}
              ]};
  var chat = Chats.findOne(filter);
  if (!chat){
      // no chat matching the filter - need to insert a new one
      chatId = Meteor.call("createChat",Meteor.userId(),otherUserId);
  }
  else {
    chatId = chat._id;
  }
  if (chatId){
    //save the id to the session
    Session.set("chatId",chatId);
  }
  Meteor.call("updateChat",chatId,chat);
  this.render("navbar", {to:"header"});
  this.render("chat_page", {to:"main"});  
  }
});

Meteor.subscribe("chats");
Meteor.subscribe("users");


///Accounts UI Config
if (Accounts._resetPasswordToken) {
  Session.set('resetPassword', Accounts._resetPasswordToken);
} 

var avatar_data = [];
for (var i=1;i<13;i++){
  avatar_data.push({
    id:i,
    label: i,
    value: "/ava"+i+".jpg"
  });
}
Accounts.ui.config({
  extraSignupFields: [
      
      {
          fieldName: 'username',
          fieldLabel: 'Username',
          inputType: 'text',
          visible: true,
          saveToProfile: true
      },
      {
          fieldName: 'avatar',
          fieldLabel: 'Avatar',
          visible: true,
          inputType: 'select',
          showFieldLabel: true,
          empty: 'Avatar',
          data: avatar_data,
          validate: function(value, errorFunction) {
            if (!value) {
              errorFunction("Please select an Avatar.");
              return false;
            } else {
              return true;
            }
          },
          saveToProfile: true,
          useJS: true

      }
      ]
});



///
// helpers and events 
/// 
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        console.log("loging in");
        Meteor.loginWithPassword(emailVar, passwordVar, function(error){
          $('.ui.error.message').text(error.reason);
          $('.ui.error.message').fadeIn('fast');
        });
    },
    'click .facebook':function(event){
        event.preventDefault();
        Meteor.loginWithFacebook(function(error){
            if(!err) {
              $('.ui.error.message').text(error.reason);
              $('.ui.error.message').fadeIn('fast');
            }
        });
    }
});

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = event.target.loginEmail.value;
        var username = event.target.loginUsername.value;
        var password = event.target.loginPassword.value;
        var normalizedEmail = Email.normalize(email);
        var avatar = Gravatar.imageUrl(normalizedEmail, {
            size: 250
        });

        var user = {'email':email,password:password,profile:{username:username, avatar:avatar}};
        console.log("registering");

        Accounts.createUser(user, function(error){
          $('.ui.error.message').text(error.reason);
          $('.ui.error.message').fadeIn('fast');
            
        });
        
    }
});

Template.passwordRecovery.helpers({
  resetPassword : function(t) {
    return Session.get('resetPassword');
  }
});

Template.passwordRecovery.events({
  'submit .js-recovery': function(event){
      event.preventDefault();
      var email = event.target.recoveryEmail.value;
      if(email){
        Session.set('loading', true);
        Accounts.forgotPassword({email: email}, function(error){
          if (error) {
            $('.ui.error.message').text(error.reason);
            $('.ui.error.message').fadeIn('fast');
          }
          else {
            $('.ui.positive.message').text(error.reason);
            $('.ui.positive.message').fadeIn('fast');
          }
          Session.set('loading', false);
        });
      }
      return false;
  }
});

Template.available_user_list.helpers({
  users:function(){
        return Meteor.users.find({},{sort:{"profile.username": 1}});
  }
})
Template.available_user.helpers({
  getUsername:function(userId){
    user = Meteor.users.findOne({_id:userId});
    return user.profile.username;
  }, 
  isMyUser:function(userId){
    if (userId == Meteor.userId()){
      return true;
    }
    else {
      return false;
    }
  },
  getRead:function(userId){
    if(Meteor.user()){
      var otherUserId = this._id;
      // find a chat that has two users that match current user id
      // and the requested user id
      var filter = {$or:[
                  {user1Id:Meteor.userId(), user2Id:otherUserId}, 
                  {user2Id:Meteor.userId(), user1Id:otherUserId}
                  ]};
      var chat = Chats.findOne(filter);
      var unread = 0;
      if(!chat){
        return false;
      }
      if(!chat.messages){
        return false;
      }
      for(message of chat.messages){
        if(message.read==false && message.user==otherUserId){
          unread++;
        }  
      }
      if(unread>0){
        return unread;
      }
      return false;
    }
    return false;
  }
})

Template.chat_message.helpers({
  getAvatar:function(userId){
    user = Meteor.users.findOne({_id:userId});
    return user.profile.avatar;
  }, 
  getUsername:function(userId){
    user = Meteor.users.findOne({_id:userId});
    return user.profile.username;
  },
  checkUser:function(userId){
      if(userId==Meteor.userId()){
        return false;
      }
      else{
        return true;
      }
  }
});

Template.chat_page.helpers({
  messages:function(){
    var chat = Chats.findOne({_id:Session.get("chatId")});
    var msgs = chat.messages;
    if (msgs){
      var change = false;
      for(message of msgs){
        message.time = moment(message.time).calendar(null, {
          lastDay : '[Yesterday]',
          sameDay : 'LT',
          lastWeek : 'dddd',
          sameElse : 'DD/MM/YY'
        });
      }
      return msgs;   
    }
    return chat.messages;
  }, 
  other_user:function(){
    var chat = Chats.findOne({_id:Session.get("chatId")});
    var otherUserId;
    if(chat.user1Id==Meteor.userId()){
      otherUserId =  chat.user2Id;
    }
    else{
      otherUserId = chat.user1Id;
    }
    return Meteor.users.findOne({_id:otherUserId});
  }, 

})
Template.chat_page.events({
// this event fires when the user sends a message on the chat page
  'submit .js-send-chat, keyup .emoji-wysiwyg-editor':function(event){
    event.preventDefault();
    console.log(event.which);
    var msg = $('.emoji-wysiwyg-editor').text().toString();
    if(msg){
      if ((event.type === 'submit') || (event.type === 'keyup' && event.which === 13) ) {
        var chat = Chats.findOne({_id:Session.get("chatId")});
        if (chat){
          var msgs = chat.messages;
          if (!msgs){// no messages yet, create a new array
            msgs = [];
          }
          var now = moment().format('MMMM Do YYYY, h:mm:ss a');
          var newId = Random.id();
          Session.set("msgId", newId);
          msgs.push({text: msg, user: Meteor.userId(), time: moment().format(), read: false, _id: newId});
          // reset the form
          $('.emoji-wysiwyg-editor').text("");
          chat.messages = msgs;
          // update the chat object in the database.
          Meteor.call("updateChat",chat._id,chat);
          console.log(newId);
          console.log($("#"+newId));
          //$('.chatWindow').scrollTop($("#"+newId).offset().top);
          //$('.chatWindow').scrollTop($('.chatWindow')[0].scrollHeight);
        }
      }
    }
  },
  //got focus
  'focus .js-send-chat':function(event){
      var chat = Chats.findOne({_id:Session.get("chatId")});
      
      if (chat){
        var msgs = chat.messages;
        var otherUserId;
        if(chat.user1Id==Meteor.userId()){
          otherUserId =  chat.user2Id;
        }
        else{
          otherUserId = chat.user1Id;
        }
        if (msgs){
          var change = false;
          for(message of msgs){
            if(message.read==false && message.user==otherUserId){
              message.read=true;
              if(!change){
                change = true;
              }
            }  
          }
          if(change){
          chat.messages = msgs;
          Meteor.call("updateChat",chat._id,chat);
          }
          
        }
    }
  }  

});

Tracker.afterFlush(function () { 
    console.log("tracked");
      if(Session.get("msgId")){
          var msgId = Session.get("msgId");
          //console.log("tracked msg");
          $('.chatWindow').scrollTop($(msgId).offset().top); 
      }
  });