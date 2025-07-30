const axios = require("axios");

module.exports = async function(token){
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );
  return data.success;
};
