import MainView from "./MainView.js";
class HeaderView extends MainView {
  _copyButton = document.querySelector(".link__copy-icon");

  signInlistner(handler) {
    this._signInButton.addEventListener("click", () => {
      const data = {
        name: this._username.value,
        password: this._password.value,
      };
      handler(data);
    });
  }

  copyHandler() {
    this._copyButton.addEventListener("click", () => {
      const id = this._startLinkContainer.textContent;
      navigator.clipboard.writeText(id);
    });
  }
  headerListner(statusHandler) {
    this._startHeader.addEventListener("click", () => {
      statusHandler(0);
    });
    this._joinHeader.addEventListener("click", () => {
      statusHandler(1);
    });
  }

  errorBtn() {
    this._errorBtn.addEventListener("click", () => {
      this.clearContiner();
      this.activeClass();
      this.addClass(this._mainHeader, "active");
      this.removeClass(this._login, "hidden");
    });
  }

  setStartPage(meetingId) {
    this.clearContiner();
    this.activeClass();

    this.addClass(this._startHeader, "active");
    this.removeClass(this._start, "hidden");

    this._startLinkContainer.textContent = meetingId;
  }

  setJoinPage() {
    this.clearContiner();
    this.activeClass();

    this.addClass(this._joinHeader, "active");
    this.removeClass(this._join, "hidden");
  }
}

export default HeaderView = new HeaderView();
