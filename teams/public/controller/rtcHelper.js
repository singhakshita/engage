import * as modal from "../modal/modal.js";
import StartView from "../view/startView.js";
class RTCHelper {
  socket;
  rtcPeerConnection;

  getSocket() {
    this.socket = io("/");
    if (this.socket) {
      return this.socket;
    }
  }
  onIceCandidateFunc = (event) => {
    if (event.candidate) {
      this.socket.emit("candidate", event.candidate, modal.state.roomName);
    }
  };
  socketOnReady = () => {
    if (modal.state.creator) {
      this.rtcPeerConnection = new RTCPeerConnection(modal.iceServers);
      this.rtcPeerConnection.onicecandidate = this.onIceCandidateFunc;
      this.rtcPeerConnection.ontrack = StartView.setPeerStream;
      this.rtcPeerConnection.addTrack(
        modal.state.userStream.getTracks()[0],
        modal.state.userStream
      );
      this.rtcPeerConnection.addTrack(
        modal.state.userStream.getTracks()[1],
        modal.state.userStream
      );
      this.rtcPeerConnection
        .createOffer()
        .then((offer) => {
          this.rtcPeerConnection.setLocalDescription(offer);
          this.socket.emit("offer", offer, modal.state.roomName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  socketOnCandidate = (candidate) => {
    let icecandidate = new RTCIceCandidate(candidate);
    this.rtcPeerConnection.addIceCandidate(icecandidate);
  };
  socketOnOffer = (offer) => {
    if (!modal.state.creator) {
      this.rtcPeerConnection = new RTCPeerConnection(modal.iceServers);
      this.rtcPeerConnection.onicecandidate = this.onIceCandidateFunc;
      this.rtcPeerConnection.ontrack = StartView.setPeerStream;
      this.rtcPeerConnection.addTrack(
        modal.state.userStream.getTracks()[0],
        modal.state.userStream
      );
      this.rtcPeerConnection.addTrack(
        modal.state.userStream.getTracks()[1],
        modal.state.userStream
      );
      this.rtcPeerConnection.setRemoteDescription(offer);
      this.rtcPeerConnection
        .createAnswer()
        .then((answer) => {
          this.rtcPeerConnection.setLocalDescription(answer);
          this.socket.emit("answer", answer, modal.state.roomName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  socketOnAnswer = (answer) => {
    this.rtcPeerConnection.setRemoteDescription(answer);
  };
  setUserStream = (stream) => {
    modal.state.userStream = stream;
  };
  emitReadyEvent = (id) => {
    if (!id) {
      id = modal.state.roomName;
    }
    this.socket.emit("ready", id);
  };
}

export default RTCHelper = new RTCHelper();
