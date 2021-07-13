const modal = require("./modal");

const accountsHandler = async function (req, res, next) {
  try {
    const id = req.query.id;
    const password = req.query.password;
    const response = await modal.addAccounts(id, password);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};
const fetchedById = async function (req, res, next) {
  try {
    const id = req.query.id;
    const data = await modal.fetchUserById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};
const fetchByName = async function (req, res, next) {
  try {
    const name = req.query.name;
    const data = await modal.fetchUserByName(name);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};
exports.accountsHandler = accountsHandler;
exports.fetchUserById = fetchedById;
exports.fetchByName = fetchByName;
