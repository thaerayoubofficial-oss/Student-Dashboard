const argon2 = require('argon2');
const services = require('./Services.js');
const data = require('../Data/Classes_Data.js');  

async function hashPassword(password) {
    return await argon2.hash(password);
}

async function verifyPassword(hash, password) { 
    return await argon2.verify(hash, password);
}

function validateEmail(email) {
  if (!email.includes('@')) {
      services.throwError(
        `The Client's Data are Invalid, The ${email} is not a valid email`,
        data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
      );
    }

    const emailDomain = email.split('@')[1];
    if (!emailDomain.includes('.')) {
      services.throwError(
        `The Client's Data are Invalid, The ${email} is not a valid email`,
        data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
      );
  }
}


function validatePassword(password) {
    let hasCapital = /[A-Z]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasNumber = /[0-9]/.test(password);
    let hasMinimumLength = password.length >= 8;

    if (!hasCapital || !hasLower || !hasNumber || !hasMinimumLength) {
      services.throwError(
        `The Client's Data are Invalid, The Password is not valid`,
        data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
      );
    }
}

function validateConfirmPassword(confirmPassword, password) {
  if (confirmPassword !== password) {
    services.throwError(
      `The Client's Data are Invalid, The Confirmed Password does not match the password`,
      data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
    );
  }
}



async function userDataValidator(clientData) {
  
  let userData = {...clientData}; 
  if (userData == null) {
    services.throwError(
      `The Client's Data are undefined`,
      data.ErrorCodes.CLIENT_DATA_NOT_FOUND,
    );
  }

  for (const [key, value] of Object.entries(userData)) {
    if (value === null || value === '') {
      services.throwError(
        `The Client's Data are Incomplete, The ${key} is missing`,
        data.ErrorCodes.CLIENT_DATA_NOT_FOUND,
      );
    }

    // ----------- Email validation ------------

    if (key === 'email') {
      validateEmail(value);
    }

    // ----------- Password validation ------------

    if (key === 'password') {
      validatePassword(value);
    }

    if (key === 'confirmPassword') {
      validateConfirmPassword(value, userData.password);
    }
  }

  userData.password_hash = await hashPassword(userData.password);
  delete userData.password;
  delete userData.confirmPassword;

  return userData;
}


module.exports = {userDataValidator};
