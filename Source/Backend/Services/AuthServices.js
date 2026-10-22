const argon2 = require('argon2');
const services = require('./Services.js');
const userRepositry = require('../Database/UserRepository.js')
const data = require('../Data/Classes_Data.js');


const allowedFilters = ["email", "id"];
const editableColumns = ["first_name", "last_name", "university", "email"];



async function hashPassword(password) {
  return await argon2.hash(password);
}

async function verifyPassword(hash, password) {
  return await argon2.verify(hash, password);
}

function validateEmail(email) {
  if (email == null || email == '') services.throwError(`Email is Undefined`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

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

  if (password == null) services.throwError(`The Password is undefined`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

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
  if (password == null) services.throwError(`The Password is undefined`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);
  if (confirmPassword == null) services.throwError(`The Confirmation Password is undefined`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

  if (confirmPassword !== password) {
    services.throwError(
      `The Client's Data are Invalid, The Confirmed Password does not match the password`,
      data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
    );
  }
}



async function userDataValidator(clientData) {

  let userData = { ...clientData };
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

async function loginHandler(email, password) {
  validateEmail(email);
  validatePassword(password);
  const user = await findUser("email", email);

  if (user == null) {
    services.throwError(
      "Invalid email or password.",
      data.ErrorCodes.INVALID_CREDENTIALS
    );
  }

  const passwordMatches = await verifyPassword(
    user.password_hash,
    password
  );

  if (!passwordMatches) {
    services.throwError(
      "Invalid email or password.",
      data.ErrorCodes.INVALID_CREDENTIALS
    );
  }

  return user;
}


// -------------------- CRUDS User ----------------------

function checkFilter(filter, filterValue) {
  if (!allowedFilters.includes(filter)) services.throwError(`This filter doesn't exist`, data.ErrorCodes.FILTER_ISNT_FOUND);
  if (filterValue == null) services.throwError(`User ${filter} is invalid`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

  switch (filter) {
    case "email":
      validateEmail(filterValue);
      break;

    case "id":
      if (typeof filterValue !== "number") services.throwError(`ID must be a number.`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);
      break;
  }
}


async function findUser(filter, filterValue) {
  checkFilter(filter, filterValue);
  const user = await userRepositry.findUser(filter, filterValue);
  if (user == null) return null;
  return user;
}

async function getUser(filter, filterValue) {
  const user = await findUser(filter, filterValue);
  if (user == null) {
    services.throwError(
      `No user found with ${filter} ${filterValue}`,
      data.ErrorCodes.USER_NOT_FOUND,
    );
  }

  return user;
}

async function createUser(userData) {
  userData = await userDataValidator(userData);
  const userId = await userRepositry.createUser(userData);
  const user = await getUser("id", userId);
  return user;
}


async function editUser(filter, filterValue, updatedData) {
  checkFilter(filter, filterValue);

  const previousUserData = await getUser(filter, filterValue);

  const affectedRows = await userRepositry.editUser(filter, filterValue, updatedData, previousUserData);

  for (const key in updatedData) {
    if (updatedData[key] == null || updatedData[key] === '') {
      console.log(`The ${key} is missing in the updated data`); // TODO: use the middleware for this if needed.
    }
  }

  if (affectedRows === 0) {
    services.throwError(
      `No user found with ${filter} ${filterValue} to update`,
      data.ErrorCodes.USER_NOT_FOUND,
    );
  }
}


async function deleteUser(filter, filterValue) {
  checkFilter(filter, filterValue);
  const affectedRows = await userRepositry.deleteUser(filter, filterValue);
  if (affectedRows === 0) {
    services.throwError(
      `No user found with ${filter} ${filterValue} to delete`,
      data.ErrorCodes.USER_NOT_FOUND,
    );
  }

}


async function patchUserData(filter, filterValue, column, value) {
  checkFilter(filter, filterValue);
  if (!editableColumns.includes(column)) services.throwError(`You can't edit ${column}.`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

  const affectedRows = await userRepositry.patchUserData(filter, filterValue, column, value);
  if (affectedRows === 0) {
    services.throwError(
      `No user found with ${filter} ${filterValue} to delete`,
      data.ErrorCodes.USER_NOT_FOUND,
    );
  }
}
module.exports = { userDataValidator, validateEmail, loginHandler, findUser, getUser, editUser, deleteUser, patchUserData };
