import MainView from "./MainView.js";

class ControlsView extends MainView {
  _videoButton = document.querySelector(".video__video");
  _leaveButton = document.querySelector(".video__connect");
  _audioButton = document.querySelector(".video__audio");

  _audioFlag = true;
  _videoFlag = true;

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

  userDisconnectHandler(handler) {
    this._leaveButton.addEventListener("click", () => {
      this.addClass(this._meetingPage, "hidden");
      this.removeClass(this._header, "hidden");
      this.removeClass(this._login, "hidden");
      this.addClass(this._mainHeader, "active");
      handler();
    });
  }
  onPeerDisconnect(name) {
    const peerVideo = document.getElementById("peerVideo");
    peerVideo.srcObject.getTracks()[0].stop();
    peerVideo.srcObject.getTracks()[1].stop();

    this.removeClass(this._modal, "hidden");
    this._modal.textContent = `Meeting Ended By ${name}`;

    setTimeout(() => {
      this.addClass(this._modal, "hidden");
    }, 5000);
  }
}

export default ControlsView = new ControlsView();
