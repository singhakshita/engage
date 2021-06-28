import * as modal from "../modal/modal.js";

import HeaderView from "../view/headerView.js";
import startView from "../view/startView.js";
import StartView from "../view/startView.js";
import ControlsView from "../view/ControlsView.js";
import MessageView from "../view/MessageView.js";

const socket = io("/");
let rtcPeerConnection;

const onIceCandidateFunc = (event) => {
  if (event.candidate) {
    socket.emit("candidate", event.candidate, modal.state.roomName);
  }
};
const socketOnReady = () => {
  if (modal.state.creator) {
    rtcPeerConnection = new RTCPeerConnection(modal.iceServers);
    rtcPeerConnection.onicecandidate = onIceCandidateFunc;
    rtcPeerConnection.ontrack = StartView.setPeerStream;
    rtcPeerConnection.addTrack(
      modal.state.userStream.getTracks()[0],
      modal.state.userStream
    );
    rtcPeerConnection.addTrack(
      modal.state.userStream.getTracks()[1],
      modal.state.userStream
    );
    rtcPeerConnection
      .createOffer()
      .then((offer) => {
        rtcPeerConnection.setLocalDescription(offer);
        socket.emit("offer", offer, modal.state.roomName);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
const socketOnCandidate = (candidate) => {
  let icecandidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(icecandidate);
};
const socketOnOffer = (offer) => {
  if (!modal.state.creator) {
    rtcPeerConnection = new RTCPeerConnection(modal.iceServers);
    rtcPeerConnection.onicecandidate = onIceCandidateFunc;
    rtcPeerConnection.ontrack = StartView.setPeerStream;
    rtcPeerConnection.addTrack(
      modal.state.userStream.getTracks()[0],
      modal.state.userStream
    );
    rtcPeerConnection.addTrack(
      modal.state.userStream.getTracks()[1],
      modal.state.userStream
    );
    rtcPeerConnection.setRemoteDescription(offer);
    rtcPeerConnection
      .createAnswer()
      .then((answer) => {
        rtcPeerConnection.setLocalDescription(answer);
        socket.emit("answer", answer, modal.state.roomName);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
const socketOnAnswer = (answer) => {
  rtcPeerConnection.setRemoteDescription(answer);
};
const setUserStream = (stream) => {
  modal.state.userStream = stream;
};
const emitReadyEvent = (id) => {
  socket.emit("ready", id);
};

socket.on("created", () => {
  modal.state.creator = true;
  StartView.setAudioVideoStream(setUserStream, null);
});
socket.on("joined", () => {
  modal.state.creator = false;
  startView.setAudioVideoStream(setUserStream, emitReadyEvent);
  socket.emit("name", modal.state.roomName, modal.state.userName);
});

socket.on("ready", () => {
  socketOnReady();
  socket.emit("name", modal.state.roomName, modal.state.userName);
});

socket.on("name", (peerName) => {
  modal.state.peerName = peerName;
  StartView.setPeerName(peerName);
});
socket.on("candidate", (candidate) => {
  socketOnCandidate(candidate);
});

socket.on("offer", (offer) => {
  socketOnOffer(offer);
});

socket.on("answer", (answer) => {
  socketOnAnswer(answer);
});

const audioHandler = (isAudio) => {
  let audioMode = modal.state.userStream.getTracks()[0];
  audioMode.enabled = isAudio;
};
const videoHandler = (isVideo) => {
  let videoMode = modal.state.userStream.getTracks()[1];
  videoMode.enabled = isVideo;
};
const startHandler = (id) => {
  modal.state.roomName = id;
  socket.emit("join", modal.state.roomName);
  StartView.setuserName(modal.state.userName);
};

const headerViewHandler = (data) => {
  if (data != null) {
    modal.state.signedIn = true;
    modal.state.userName = data.name;
    modal.state.password = data.password;
  }
  if (modal.state.signedIn) {
    modal.state.userName = data.name;
    const startId = modal.getMeetingLink();
    HeaderView.setStartPage(startId);
  }
};
const getSignedInStatus = (btn) => {
  if (modal.state.signedIn) {
    if (btn == 0) {
      HeaderView.setStartPage(modal.getMeetingLink());
    } else {
      HeaderView.setJoinPage();
    }
  } else {
    HeaderView.setErrorPage();
  }
};
socket.on("message", (msg) => {
  MessageView.showPeerMsg(msg);
  console.log("recieved message", msg);
});

const broadcastMessage = (msg) => {
  socket.emit("message", msg, modal.state.roomName);
  console.log("emitting", msg);
};

socket.on("leave", () => {
  ControlsView.onPeerDisconnect(modal.state.peerName);
});
const disconnectHandler = () => {
  socket.emit("leave", modal.state.roomName);
};

const init = () => {
  HeaderView.signInlistner(headerViewHandler);
  HeaderView.copyHandler();
  HeaderView.headerListner(getSignedInStatus);
  HeaderView.errorBtn();
  StartView.btnHandler(startHandler);
  ControlsView.controlAudio(audioHandler);
  ControlsView.controlVideo(videoHandler);
  MessageView.sendMsg(broadcastMessage);
  ControlsView.userDisconnectHandler(disconnectHandler);
};
init();
