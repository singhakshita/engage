let users = [];
let accounts = [{ id: "microsoft", password: "teams" }];
const userExists = (id, name) => {
  let index;
  const data = users.find((elem, idx) => {
    if (elem.roomId === id) {
      index = idx;
    }
    return elem.roomId === id;
  });
  if (data) {
    data.peername = name;
  }
  return data;
};
const editUser = (name, id) => {
  const data = userExists(id, name);

  if (!data) {
    const user = {
      username: name,
      peername: "Nobody has joined the channel yet",
      roomId: id,
      messages: [],
    };
    users.push(user);
  }
};

const pushMessages = (msg, id, name) => {
  const data = users.find((elem) => {
    return elem.roomId === id;
  });
  if (data) {
    data.messages.push([name, msg]);
  }
};
const getdata = (name) => {
  const fetchedData = users.filter(
    (elem) => elem.username === name || elem.peername === name
  );
  return fetchedData;
};
const getdataById = (id) => {
  const fetchedData = users.filter((elem) => elem.roomId === id);
  return fetchedData;
};

const addAccounts = (id, password) => {
  const data = accounts.find((elem) => {
    return elem.id === id;
  });
  if (data) {
    if (data.password === password) {
      const response = { name: data.id, status: true, err: "Signed In" };
      return response;
    } else {
      return { name: "", status: false, err: "Password Incorrect" };
    }
  } else {
    accounts.push({ id: id, password: password });
    return { name: id, status: true, err: "Account Created Successfully" };
  }
};

exports.editUser = editUser;
exports.pushMessages = pushMessages;
exports.getdata = getdata;
exports.getdataById = getdataById;
exports.addAccounts = addAccounts;
