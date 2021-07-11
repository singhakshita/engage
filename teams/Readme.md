#About Me
Hi :wave: I am Akshita Singh
Prefinal Year Student of **Indira Gandhi Delhi Technical University For Women** persuing **B.Tech** in **Electrical and Communication Engineering** interesting in **\*Web Development\***

#The Project: Microsoft Teams Clone

1. The mandatory functionality
   - creating an application where atleast two people can have FaceTime.
2. The adapt phase
   - Chat feature that should extend before and after the call

#Features I Implemented

1. Authentication

   - when you enter a username that doesnt match with the database ,a new account is created ,if your account has already been created then the password should match to be able to log in.

2. Creating chat channel or a video call
   \_ you get the link (uuid4 genrated unique channel id) you can either start a channel or start a video meet.

- Joining the channel or the video call
  \_ the person who created the channel can share the link and peer can join the channel.

3. chat channel

- the chat tab stores all your previous channel logs , you can text or video call any of the previous channel .All your previous chats are available there.

4. Mute audio feature
5. camera on and off feature
6. Meeting info option
7. Meeting disconnect feature

##packages and Librararies used:

1. Node and express for creating server
2. webRTC for sharing audio video
3. uuid4 for generating links
4. socket.io and socket.io.client for establishing countinuious connection.
5. mongodb for database
6. heroku cli for hosting

##The Project structure :
Database : Mongodb
frontend : JavaScript
backend : Node and express.js

-code structure :
-client side:
following the MVC pattern : Modal Controller views to organise files and folder
Modal : gets and refines data from server (modal.js)
Controller : all client socket connections , gets data from modal and commands views to render it (controller.js)
\_ (rtcHelper.js) stores all functions related to webRTC.
Views: renders all views

-server side :
-index.js : holds the server code.
-modalServer : is the modal folder for the server , reacts with mongodb and feteches data.
