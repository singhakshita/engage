export const state = {
  signedIn: false,
  userName: "",
  password: "",

  id: null,
  roomName: "",
  creator: false,
  userStream: null,
  peerName: "",
};

export const iceServers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export const getMeetingLink = () => {
  let id = uuidv4();
  return id;
};
