export default class MainView {
  _header = document.querySelector(".header");

  _signInButton = document.querySelector(".sign-in");
  _username = document.getElementById("username");
  _password = document.getElementById("password");
  _login = document.querySelector(".login");

  _start = document.querySelector(".start__link");
  _startLinkContainer = document.getElementById("startInput");
  _joinLinkContainer = document.getElementById("joinInput");
  _join = document.querySelector(".join__link");

  _mainHeader = document.querySelector(".header__main");
  _startHeader = document.querySelector(".start");
  _joinHeader = document.querySelector(".join");

  _startButton = document.querySelector(".btn-start");
  _joinButton = document.querySelector(".btn-join");

  _errorBox = document.querySelector(".error");
  _errorBtn = document.querySelector(".btn-error");

  _meetingPage = document.querySelector(".meeting__page");

  _userVideo = document.getElementById("userVideo");
  _peerVideo = document.getElementById("peerVideo");

  _modal = document.querySelector(".modal");

  removeClass(elem, className) {
    if (elem.classList.contains(className)) {
      elem.classList.remove(className);
    }
  }
  addClass(elem, className) {
    if (!elem.classList.contains(className)) {
      elem.classList.add(className);
    }
  }
  clearContiner() {
    this.addClass(this._login, "hidden");
    this.addClass(this._start, "hidden");
    this.addClass(this._join, "hidden");
    this.addClass(this._errorBox, "hidden");
    this.addClass(this._meetingPage, "hidden");
  }
  activeClass() {
    this.removeClass(this._mainHeader, "active");
    this.removeClass(this._startHeader, "active");
    this.removeClass(this._joinHeader, "active");
  }

  setMeetingPage() {
    this.clearContiner();
    this.addClass(this._header, "hidden");
    this.removeClass(this._meetingPage, "hidden");
  }
}
