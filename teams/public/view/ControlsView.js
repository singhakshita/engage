import MainView from "./MainView.js";

class ControlsView extends MainView {
  _videoButton = document.querySelector(".video__video");
  _leaveButton = document.querySelector(".video__connect");
  _audioButton = document.querySelector(".video__audio");
  _infoButton = document.querySelector(".video__info");
  _recordButton = document.querySelector(".video__record");

  _audioFlag = true;
  _videoFlag = true;
  _recording = false;

  controlAudio(handler) {
    this._audioButton.addEventListener("click", () => {
      this._audioFlag = !this._audioFlag;
      handler(this._audioFlag);
      if (this._audioFlag) {
        this._audioButton.style.backgroundImage = "url('../assets/unmute.png')";
      } else {
        this._audioButton.style.backgroundImage = "url('../assets/mute.png')";
      }
    });
  }

  controlVideo(handler) {
    this._videoButton.addEventListener("click", () => {
      this._videoFlag = !this._videoFlag;
      handler(this._videoFlag);
      if (this._videoFlag) {
        this._videoButton.style.backgroundImage =
          "url('../assets/videoOn.png')";
      } else {
        this._videoButton.style.backgroundImage =
          "url('../assets/videoOff.png')";
      }
    });
  }
  controlRecording(handler) {
    this._recordButton.addEventListener("click", () => {
      this._recording = !this._recording;
      handler(this._recording);
      if (this._recording) {
        this._recordButton.style.backgroundImage = "url('../assets/stop.png')";
      } else {
        this._videoButton.style.backgroundImage = "url('../assets/start.png')";
      }
    });
  }
  // displays meeting information
  infoDisplay(handler) {
    this._infoButton.addEventListener("click", () => {
      const id = handler();
      this.showModal(`Meeting id is : ${id}`);
    });
  }

  userDisconnectHandler(handler) {
    this._leaveButton.addEventListener("click", () => {
      this.addClass(this._meetingPage, "hidden");
      this.removeClass(this._header, "hidden");
      this.removeClass(this._start, "hidden");
      this.addClass(this._mainHeader, "active");
      handler();
    });
  }
  onPeerDisconnect(name) {
    const peerVideo = document.getElementById("peerVideo");
    peerVideo.srcObject.getTracks()[0].stop();
    peerVideo.srcObject.getTracks()[1].stop();
    this.showModal(`Meeting ended by ${name}`);
  }
}

export default ControlsView = new ControlsView();
