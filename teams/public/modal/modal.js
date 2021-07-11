export const state = {
  signedIn: false,
  userName: "",
  id: null,
  roomName: "",
  creator: false,
  userStream: null,
  peerName: "",
  allRooms: [],
  state: false, //call = false chat = true;
  connected: "",
};
export const getRoomId = () => {
  return modal.state.roomName;
};
export const iceServers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};
export const isConnected = (id) => {
  if (state.connected === id) {
    return true;
  } else return false;
};
export const getMeetingLink = () => {
  let id = uuidv4();
  return id;
};

export const editData = (data) => {
  data.forEach((elem) => {
    if (elem.username !== state.userName) {
      elem.peername = elem.username;
      elem.username = state.userName;
    }
  });
  return data;
};
export const editMsg = (data) => {
  data.messages.forEach((elem) => {
    if (elem[0] == state.userName) {
      elem[0] = "U";
    } else {
      elem[0] = "P";
    }
  });
  return data;
};
export const signInStatus = async function (id, password) {
  const params = new URLSearchParams({ id: id, password: password });
  const url = `http://localhost:3000/accounts?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
export const getAllRooms = async function () {
  const params = new URLSearchParams({ name: state.userName });
  const url = `http://localhost:3000/chats?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  return data;
};

export const getParticularRoomData = async function (roomName) {
  const params = new URLSearchParams({ id: roomName });
  const url = `http://localhost:3000/id?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  return data;
};
