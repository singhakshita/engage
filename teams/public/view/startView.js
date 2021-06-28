import MainView from "./MainView.js";

class StartView extends MainView {
  _startLinkContainer = document.getElementById("startInput");
  _joinLinkContainer = document.getElementById("joinInput");

  btnHandler(startMeeting) {
    this._startButton.addEventListener("click", () => {
      const id = document.getElementById("startInput").textContent;
      this.setMeetingPage();
      startMeeting(id);
    });
    this._joinButton.addEventListener("click", () => {
      const id = document.getElementById("joinInput").value;
      this.setMeetingPage();
      startMeeting(id);
    });
  }

  setAudioVideoStream(setStream, emitReadyEvent) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 100, height: 100 },
      })
      .then(function (stream) {
        setStream(stream);
        document.getElementById("userVideo").srcObject = stream;
        document.getElementById("userVideo").onloadedmetadata = function (e) {
          document.getElementById("userVideo").play();
        };
        if (emitReadyEvent != null) {
          emitReadyEvent(document.getElementById("joinInput").value);
        }
      })
      .catch(function (err) {
        alert(err);
      });
  }

  setPeerStream(event) {
    document.getElementById("peerVideo").srcObject = event.streams[0];
    document.getElementById("peerVideo").onloadedmetadata = function (e) {
      document.getElementById("peerVideo").play();
    };
  }

  setuserName(name) {
    document.getElementById("userDetail").textContent = name;
  }
  setPeerName(name) {
    document.getElementById("peerDetail").textContent = name;
  }
}

export default StartView = new StartView();
