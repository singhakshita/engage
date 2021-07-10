const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      "mongodb+srv://AkshitaSingh:94@Akshita@cluster0.jq1rn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then((client) => {
      _db = client.db();
      console.log("connected!!");
      callback();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) return _db;
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
