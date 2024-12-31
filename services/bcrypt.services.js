const bcrypt = require("bcrypt");

const encrypt = async (data) => {
  const encrypted = await bcrypt.hash(data, 12);
  return encrypted;
};

const decrypt = async (encryptedData, hashedData) => {
  const match = await bcrypt.compare(encryptedData, hashedData);
  return match;
};

module.exports = { encrypt, decrypt };
