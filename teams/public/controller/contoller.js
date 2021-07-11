import * as modal from "../modal/modal.js";

import rtcHelper from "./rtcHelper.js";

import HeaderView from "../view/headerView.js";
import startView from "../view/startView.js";
import StartView from "../view/startView.js";
import ControlsView from "../view/ControlsView.js";
import MessageView from "../view/MessageView.js";

let socket;
socket = rtcHelper.getSocket();

// after socket conncetion is created
socket.on("created", () => {
  // a
  if (modal.state.state) {
    // state = true = chat channel : name is emitted
    socket.emit("name", modal.state.roomName, modal.state.userName);
  } else {
    modal.state.creator = true; //state = false = video channel
    StartView.setAudioVideoStream(rtcHelper.setUserStream, null);
  }
});
//when someone joins the same room
socket.on("joined", () => {
  if (!modal.state.state) {
    modal.state.creator = false;
    startView.setAudioVideoStream(
      rtcHelper.setUserStream,
      rtcHelper.emitReadyEvent
    );
  }
  socket.emit("name", modal.state.roomName, modal.state.userName);
});
// peer on ready
socket.on("ready", () => {
  rtcHelper.socketOnReady();
  socket.emit("name", modal.state.roomName, modal.state.userName); // the creator's name is emitted
});

socket.on("name", (peerName) => {
  modal.state.peerName = peerName;
  StartView.setPeerName(peerName);
});
// ICE candidates are shared
socket.on("candidate", (candidate) => {
  rtcHelper.socketOnCandidate(candidate);
});

socket.on("offer", (offer) => {
  rtcHelper.socketOnOffer(offer);
});

socket.on("answer", (answer) => {
  rtcHelper.socketOnAnswer(answer);
});
socket.on("message", (msg, roomId) => {
  if (modal.state.state) {
    MessageView.receiveMsgViaChannel(msg, roomId);
  } else {
    MessageView.showPeerMsg(msg);
  }
});
socket.on("leave", () => {
  ControlsView.onPeerDisconnect(modal.state.peerName);
});

const broadcastMessage = (msg, roomId) => {
  if (roomId === "") {
    roomId = modal.state.roomName;
  }
  socket.emit("message", msg, roomId, modal.state.userName);
};

const disconnectHandler = () => {
  socket.emit("leave", modal.state.roomName);
  modal.state.state = false;
};
const callHandler = (id, status) => {
  //status : 0 : the person starts the call || 1: if person joins the call
  modal.state.state = false;
  modal.state.roomName = id;
  if (!modal.isConnected(id)) {
    //if the socket is not already  connected
    socket.emit("join", id);
    getParticularData(id);
    return;
  }
  getParticularData(id); // gets previous chats and render it in the view
  if (status === 0) {
    modal.state.creator = true;
    StartView.setAudioVideoStream(rtcHelper.setUserStream, null);
    StartView.setuserName(modal.state.userName);
  } else {
    modal.state.creator = false;
    startView.setAudioVideoStream(
      rtcHelper.setUserStream,
      rtcHelper.emitReadyEvent
    );
    socket.emit("name", modal.state.roomName, modal.state.userName);
  }
};
// audio mute unmute
const audioHandler = (isAudio) => {
  let audioMode = modal.state.userStream.getTracks()[0];
  audioMode.enabled = isAudio;
};
//video on and off
const videoHandler = (isVideo) => {
  let videoMode = modal.state.userStream.getTracks()[1];
  videoMode.enabled = isVideo;
};
// start or join channel or call handler
const startHandler = (id, isChat) => {
  modal.state.roomName = id;
  modal.state.state = isChat;
  modal.state.connected = id;
  socket.emit("join", modal.state.roomName);
  console.log("emitting join");
  StartView.setuserName(modal.state.userName);
};

// handles authentication
const setSignedInStatus = (data) => {
  if (data != null) {
    modal.signInStatus(data.name, data.password).then((data) => {
      if (data.status) {
        modal.state.signedIn = true;
        modal.state.userName = data.name;
        const startId = modal.getMeetingLink();
        StartView.setAccountHolder(data.name);
        HeaderView.setStartPage(startId);
      }
      HeaderView.showModal(data.err);
    });
  }
};

// handles UI based on authentication
const getSignedInStatus = (btn) => {
  if (modal.state.signedIn) {
    if (btn == 0) {
      HeaderView.setStartPage(modal.getMeetingLink());
      modal.state.state = false;
    } else if (btn == 2) {
      MessageView.setChatPage(setChatPage);
      modal.state.state = true;
    } else {
      HeaderView.setJoinPage();
      modal.state.state = false;
    }
  } else {
    HeaderView.setErrorPage();
    modal.state.state = false;
  }
};

// sets chat Page UI
const setChatPage = async function () {
  modal.state.state = true;
  let data = await modal.getAllRooms();
  data = modal.editData(data);
  modal.editMsg(data[data.length - 1]);
  MessageView.displayChatCard(data);
};
//gets all chat info of particular room
const getParticularData = async function (id) {
  let data = await modal.getParticularRoomData(id);
  data = modal.editData(data);
  data = modal.editMsg(data[0]);
  if (!modal.state.state) MessageView.meetingDisplayChat(data);
  else MessageView.displayEachChat(data);
};
const init = () => {
  // setting event listners  : following subscriber listner pattern
  HeaderView.signInlistner(setSignedInStatus);
  HeaderView.copyHandler();
  HeaderView.headerListner(getSignedInStatus);
  HeaderView.errorBtn();
  StartView.btnHandler(startHandler, setChatPage);
  ControlsView.controlAudio(audioHandler);
  ControlsView.controlVideo(videoHandler);
  ControlsView.infoDisplay(modal.getRoomId);
  MessageView.sendMsg(broadcastMessage);
  ControlsView.userDisconnectHandler(disconnectHandler);
  MessageView.chatHeaderHandler(getSignedInStatus);
  MessageView.chatCardListner(getParticularData);
  MessageView.sendMsgViaChannel(broadcastMessage);
  MessageView.CallBtnListner(callHandler);
};
init();
