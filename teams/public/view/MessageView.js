import MainView from "./MainView.js";

class MessageView extends MainView {
  _chatBox = document.querySelector(".chat");
  _inputMsgBox = document.querySelector(".chat__input-box");
  _sendBtn = document.querySelector(".chat__send");

  _chatItems = document.querySelector(".chat__items");
  _chatList = document.querySelector(".chat__items");
  _channelSend = document.querySelector(".chat__channel-btn");

  _joinCall = document.querySelector(".joincall");
  _StartCall = document.querySelector(".startcall");

  chatHeaderHandler(setPageHandler) {
    this._chatHeader.addEventListener("click", () => {
      setPageHandler(2);
      this.activeClass();
      this.addClass(this._chatHeader, "active");
    });
  }

  displayChatCard(data) {
    if (data.length == 0) return;
    this._chatItems.innerHTML = "";
    data.forEach((elem) => {
      let msg = elem.messages[elem.messages.length - 1];
      if (!msg) msg = "no message yet";
      else msg = msg[1];

      const html = `<div class="chat__item-card" data-idx=${elem.roomId}>
      <div class="chat__item-card-id">${elem.roomId}</div>
      <div class="chat__item-title">
        <div class="chat__item-card-dp"></div>
        <div class="chat__item-detail">
          <div class="chat__item-card-name">${elem.peername}</div>
          <div class="chat__item-card-status">
            <span class="chat__item-card-msg">${msg}</span>
            <div class="chat__item-card-newMsg"></div>
          </div>
        </div>
      </div>
    </div>`;
      this._chatItems.insertAdjacentHTML("beforeend", html);
    });
    this.displayEachChat(data[data.length - 1]);
  }
  chatCardListner(getDataHandler) {
    this._chatList.addEventListener("click", (event) => {
      const targetElem = event.target.closest(".chat__item-card");
      if (targetElem) {
        getDataHandler(targetElem.dataset.idx);
      }
    });
  }
  displayEachChat(data) {
    document.querySelector(".channelId").textContent = data.roomId;
    document.querySelector(".peername").textContent = data.peername;
    const container = document.querySelector(".chat__item-msg");
    this.insertMessages(container, data);
  }
  meetingDisplayChat(data) {
    const container = document.querySelector(".chat__msgBox");
    this.insertMessages(container, data);
  }
  insertMessages(container, data) {
    container.innerHTML = "";
    data.messages.forEach((elem) => {
      let html;
      if (elem[0] == "U") {
        html = this.getUserHtml(elem[1]);
      } else {
        html = this.getPeerHtml(elem[1]);
      }
      container.insertAdjacentHTML("beforeend", html);
    });
  }

  sendMsgViaChannel(handler) {
    this._channelSend.addEventListener("click", () => {
      const inputNode = document.querySelector(".chat__channel-input");
      const msg = inputNode.value;
      if (msg === "") return;
      const id = document.querySelector(".channelId").textContent;
      handler(msg, id);
      document.querySelector(".chat__channel-input").value = "";
      const html = this.getUserHtml(msg);
      document
        .querySelector(".chat__item-msg")
        .insertAdjacentHTML("beforeend", html);
    });
  }

  receiveMsgViaChannel(msg, roomName) {
    if (document.querySelector(".channelId").textContent === roomName) {
      const html = this.getPeerHtml(msg);
      document
        .querySelector(".chat__item-msg")
        .insertAdjacentHTML("beforeend", html);
    }
  }

  sendMsg(handler) {
    this._sendBtn.addEventListener("click", () => {
      const msg = document.querySelector(".chat__input-box").value;
      if (msg === "") return;
      handler(msg, "");
      document.querySelector(".chat__input-box").value = "";
      const html = this.getUserHtml(msg);
      document
        .querySelector(".chat__msgBox")
        .insertAdjacentHTML("beforeend", html);
    });
  }

  showPeerMsg(message) {
    const html = this.getPeerHtml(message);
    document
      .querySelector(".chat__msgBox")
      .insertAdjacentHTML("beforeend", html);
  }

  getPeerHtml(msg) {
    return `<div class="peer__msg">${msg}</div>`;
  }
  getUserHtml(msg) {
    return `<div class="user__msg">${msg}</div>`;
  }

  CallBtnListner(callHandler) {
    this._StartCall.addEventListener("click", () => {
      const id = document.querySelector(".channelId").textContent;
      this.setMeetingPage();
      callHandler(id, 0);
    });
    this._joinCall.addEventListener("click", () => {
      const id = document.querySelector(".channelId").textContent;
      this.setMeetingPage();
      callHandler(id, 1);
    });
  }
}
export default MessageView = new MessageView();
