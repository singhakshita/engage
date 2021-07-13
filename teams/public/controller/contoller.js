import * as modal from "../modal/modal.js";

import rtcHelper from "./rtcHelper.js";

import HeaderView from "../view/headerView.js";
import startView from "../view/startView.js";
import StartView from "../view/startView.js";
import ControlsView from "../view/ControlsView.js";
import MessageView from "../view/MessageView.js";
import headerView from "../view/headerView.js";

let socket;
socket = rtcHelper.getSocket();

// after socket conncetion is created
// state = true = chat channel : name is emitted
// state = false = video channel
socket.on("created", () => {
  if (!modal.state.state) {
    modal.state.creator = true;
    StartView.setAudioVideoStream(rtcHelper.setUserStream, null);
  }
  socket.emit("name", modal.state.roomName, modal.state.userName);
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

socket.on("invite", (username, roomName) => {
  HeaderView.showInvite(`${username} has requested you to join the call`);
  modal.state.inviteRoomname = roomName;
});
socket.on("decline", (username) => {
  headerView.showModal(`${username} declined your call`);
});
// peer on ready , the creator's name is emitted
socket.on("ready", () => {
  rtcHelper.socketOnReady();
  console.log("onready");
  socket.emit("name", modal.state.roomName, modal.state.userName);
});

socket.on("name", (peerName) => {
  modal.state.peerName = peerName;
  StartView.setPeerName(peerName);
});
// ICE candidates are shared
socket.on("candidate", (candidate) => {
  rtcHelper.socketOnCandidate(candidate);
  console.log("on candidate");
});
socket.on("offer", (offer) => {
  rtcHelper.socketOnOffer(offer);
  console.log("on offer");
});
socket.on("answer", (answer) => {
  rtcHelper.socketOnAnswer(answer);
  console.log("on answer");
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
const declineHandler = () => {
  socket.emit("decline", modal.state.inviteRoomname, modal.state.userName);
};

const disconnectHandler = () => {
  socket.emit("leave", modal.state.roomName);
  modal.state.state = false;
};
//status : 0 : the person starts the call || 1: if person joins the call
const callHandler = (id, status) => {
  modal.state.state = false;
  modal.state.roomName = id;

  getParticularData(id); // gets previous chats and render it in the view
  if (status === 0) {
    modal.state.creator = true;
    socket.emit("invite", id, modal.state.userName);
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
const recordingHandler = (start) => {
  if (start) {
    rtcHelper.startRecording();
  } else {
    rtcHelper.stopRecording();
  }
};
const acceptHandler = () => {
  modal.state.creator = false;
  modal.state.roomName = modal.state.inviteRoomname;
  callHandler(modal.state.inviteRoomname, 1);
};
// start or join channel or call handler
const startHandler = (id, isChat) => {
  modal.state.roomName = id;
  modal.state.state = isChat;
  modal.state.connected = id;
  socket.emit("join", modal.state.roomName);
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
  rtcHelper.joinAllSocket(data);
  data = modal.editData(data);
  console.log(data);
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
  ControlsView.controlRecording(recordingHandler);
  MessageView.sendMsg(broadcastMessage);
  ControlsView.userDisconnectHandler(disconnectHandler);
  MessageView.chatHeaderHandler(getSignedInStatus);
  MessageView.chatCardListner(getParticularData);
  MessageView.sendMsgViaChannel(broadcastMessage);
  MessageView.CallBtnListner(callHandler);
  MessageView.acceptBtnListner(acceptHandler);
  MessageView.declineBtnListner(declineHandler);
};
init();
