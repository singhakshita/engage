class MessageView {
  _chatBox = document.querySelector(".chat");
  _inputMsgBox = document.querySelector(".chat__input-box");
  _sendBtn = document.querySelector(".chat__send");

  sendMsg(handler) {
    this._sendBtn.addEventListener("click", () => {
      const msg = document.querySelector(".chat__input-box").value;
      if (msg === "") return;
      handler(msg);
      document.querySelector(".chat__input-box").value = "";
      const html = `<div class="user__msg">${msg}</div>`;
      document.querySelector(".chat").insertAdjacentHTML("beforeend", html);
    });
  }
  showPeerMsg(message) {
    const html = `<div class="peer__msg">${message}</div>`;
    document.querySelector(".chat").insertAdjacentHTML("beforeend", html);
  }
}
export default MessageView = new MessageView();
