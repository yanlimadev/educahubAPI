const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const close = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = {
  connect,
  close,
};
