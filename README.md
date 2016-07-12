# MeteorChat

MeteorChat is a full fledged chat application built exclusively with Meteor.js. Here are some features of the app:

  - Private realtime chats with emojis(thanks to [emoji-picker.js](https://github.com/OneSignal/emoji-picker))
  - Register and login with Facebook
  - Notification badge on chats for new messages
  - Read scripts when messages are read
  - (kindof) Optimized for mobile, ready to be deployed as Android or iOS app
  - Profile picture is pulled from Gravatar(or Facebook if logged in with Facebook)
  - Whole UI built with [Semantic UI](https://github.com/Semantic-Org/Semantic-UI)

It started of as a chatroom app for the capstone project for a Meteor course. But then I decided to make a proper app out of it just for the heck of it. I don't really expect anyone to use it, but it's a great resource for beginners in Meteor.js.

### Tech Used

MeteorChat uses a number of open source projects to work properly:

* [Meteor](https://github.com/meteor/meteor) -the JavaScript App Platform
* [Semantic UI](https://github.com/Semantic-Org/Semantic-UI) - great UI boilerplate for modern web apps
* [Iron Router](https://github.com/iron-meteor/iron-router) - A client and server side router designed specifically for Meteor
* [Font Awesome](https://github.com/FortAwesome/Font-Awesome) - the iconic font and CSS toolkit
* [Moment.js](https://github.com/moment/moment/) - library for parsing, validating, manipulating, and formatting dates
* [Meteor Accounts UI for Semantic with Select Input](https://github.com/nisargkolhe/accounts-ui-semantic-ui-select) - custom version included, forked from [accounts-ui-semantic-ui](https://github.com/SharpenedSpoon/accounts-ui-semantic-ui)
* [jQuery](https://github.com/jquery/jquery) - duh
* and some more!

### Installation

MeteorChat requires [Meteor](https://github.com/meteor/meteor) v1.3+ to run.

To run on a local server:

```sh
$ cd meteorchat
$ meteor
```

Follow Meteor's documentation for deployment on Android or iOS.

### Todos
 - Add screenshots, forreal
 - Deploy it somewhere for demo
 - Add functionality for group chats
 - Make users private and searchable via username
 - Rework the UI
 - Make the chats encrypted

License
----

MIT


