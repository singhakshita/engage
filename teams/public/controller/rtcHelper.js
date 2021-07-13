import * as modal from "../modal/modal.js";
import StartView from "../view/startView.js";
class RTCHelper {
  socket;
  rtcPeerConnection;
  _mediaRecorder;
  _vp9 = "video/webm; codecs=vp=9";
  vp9Options = { MimeType: this._vp9 };
  recordedChunks = [];

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
        .catch((error) => {});
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
        .catch((error) => {});
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
  joinAllSocket(data) {
    data.forEach((element) => {
      this.socket.emit("reconnect", element.roomId);
    });
  }

  startRecording = () => {
    const remoteStream = modal.state.userStream;
    if (MediaRecorder.isTypeSupported(this._vp9)) {
      this._mediaRecorder = new MediaRecorder(remoteStream, this.vp9Options);
    } else {
      this._mediaRecorder = new MediaRecorder(remoteStream);
    }
    this._mediaRecorder.ondataavailable = this.handleRecordedData;
    this._mediaRecorder.start();
  };
  handleRecordedData = (event) => {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data);
      this.downloadRecordedVideo();
    }
  };
  stopRecording() {
    this._mediaRecorder.stop();
  }
  downloadRecordedVideo() {
    const blob = new Blob(this.recordedChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export default RTCHelper = new RTCHelper();
