const getDb = require("./mongo").getDb;

const insertDataIntoAccounts = (data) => {
  const db = getDb();
  db.collection("accounts")
    .insertOne(data)
    .then((res) => console.log())
    .catch((err) => console.log(err));
};
const insertDataIntoUsers = (data) => {
  const db = getDb();
  db.collection("users")
    .insertOne(data)
    .then((res) => console.log())
    .catch((err) => console.log(err));
};
const addAccounts = (id, password) => {
  const db = getDb();
  return db
    .collection("accounts")
    .find({ id: id })
    .toArray()
    .then((arr) => {
      const response = accountHandler(arr, id, password);
      return response;
    })
    .catch((err) => console.log(err));
};
const accountHandler = (arr, id, password) => {
  if (arr.length == 0) {
    const data = { id: id, password: password };
    insertDataIntoAccounts(data);
    return { name: id, status: true, err: "Account Created Successfully" };
  } else {
    if (arr[0].password === password)
      return { name: arr[0].id, status: true, err: "Signed In" };
    else {
      return {
        name: "",
        status: false,
        err: "Password Incorrect or Username Already Taken",
      };
    }
  }
};
const userHandler = (arr, id, name) => {
  if (arr.length == 0) {
    const data = {
      roomId: id,
      username: name,
      peername: "Nobody has joined the channel yet",
      messages: [],
    };
    insertDataIntoUsers(data);
  } else {
    const db = getDb();
    db.collection("users")
      .updateOne(
        { roomId: id, peername: "Nobody has joined the channel yet" },
        { $set: { peername: name } }
      )
      .then((res) => console.log())
      .catch((err) => console.log(err));
  }
};
const addUser = (name, id) => {
  const db = getDb();
  db.collection("users")
    .find({ roomId: id })
    .toArray()
    .then((arr) => {
      userHandler(arr, id, name);
    })
    .catch((err) => console.log(err));
};
const pushMsg = (id, name, msg) => {
  const db = getDb();
  db.collection("users")
    .updateOne({ roomId: id }, { $push: { messages: [name, msg] } })
    .then((res) => console.log())
    .catch((err) => console.log(err));
};
const fetchUserById = (id) => {
  const db = getDb();
  return db
    .collection("users")
    .find({ roomId: id })
    .toArray()
    .then((arr) => {
      return arr;
    })
    .catch((err) => console.log(err));
};
const fetchUserByName = (name) => {
  const db = getDb();
  return db
    .collection("users")
    .find({ $or: [{ username: name }, { peername: name }] })
    .toArray()
    .then((arr) => {
      return arr;
    })
    .catch((err) => console.log(err));
};
exports.addAccounts = addAccounts;
exports.addUser = addUser;
exports.pushMsg = pushMsg;
exports.fetchUserById = fetchUserById;
exports.fetchUserByName = fetchUserByName;
