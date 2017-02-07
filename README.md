# Video-Surfer
Video-Uploader-Streamer(MEAN stack)

“Video Surfer” is a mini project to develop a video streaming site like Youtube, where a user can upload , search, and watch their favourite videos

Video Surfer can be regarded as mashup project with following main modules and features.
 1. Single Sign-on(Facebook/Google/Linkedin): Increases usability among users as they don’t have to create a new username and password to login to this app, instead can easily login using their facebook/google/linkedin credentials. Single sign-on module is implemented using OAuth, which comes along with monitoring tool for administrators to monitor different user logins, It also provides secured access to the app as it works on https protocol.
 2. Video Recording(WebRTC & RecordRTC): Provides web based video capturing and recording. WebRTC supports all major web browsers and multiple platforms. It supports secure RTP protocol(SRTP) for encryption of both voice and video. 
 3. Video uploading and streaming (Binary.Js): Videos are uploaded and streamed using Binary.js which is light framework that uses websockets to stream videos bidirectionally between client browser and server. It supports multiple data streams over a single realtime websocket connection facilitating in high performance.

Technology Used
Frontend : HTML, CSS, Bootstrap, Javascript
Backend  : Node.js , Binary.js
Database :MongoDB
