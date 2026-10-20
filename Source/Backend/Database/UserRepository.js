const databaseServices = require('../Database/DatabaseServices.js');
const authServices = require('../Services/AuthServices.js');
const services = require('./Services.js');
const data = require('../Data/Classes_Data.js');


const allowedFilters = ["email", "id"];
const editableColumns = ["first_name", "last_name", "university", "email"];

function checkFilter(filter, filterValue) {
    if (!allowedFilters.includes(filter)) services.throwError(`This filter doesn't exist`, data.ErrorCodes.FILTER_ISNT_FOUND);
    if (filterValue == null) services.throwError(`User ${filter} is invalid`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

    switch (filter) {
        case "email":
            authServices.validateEmail(filterValue);
            break;

        case "id":
            if (typeof filterValue !== "number") services.throwError(`ID must be a number.`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);
    }
}

async function createUser(userData) {
    
    userData = await authServices.userDataValidator(userData);
   
    const [result] = await databaseServices.query(
    `INSERT INTO users
     (first_name, last_name, university, email, password_hash)
     VALUES (?, ?, ?, ?, ?)`,
    [
        userData.first_name,
        userData.last_name,
        userData.university,
        userData.email,
        userData.password_hash
    ]
  );
  console.log(`User created with ID: ${result.insertId}`);
  return result.insertId;
}


async function getUser(filter, filterValue) {

    checkFilter(filter, filterValue);

    const [result] = await databaseServices.query(`
        SELECT * FROM users WHERE ${filter} = ?`, 
        [filterValue]
    );

    const filteredUser = result[0];

    if (filteredUser == null) { 
        services.throwError(
            `No user found with ${filter} ${filterValue}`,
            data.ErrorCodes.USER_NOT_FOUND,
        );
    }
    return filteredUser;
}

async function editUser(filter, filterValue, updatedData) { 
    
    checkFilter(filter, filterValue);

    const previousUserData = await getUser(filter, filterValue); 
    const [result] = await databaseServices.query(
        `UPDATE users SET first_name = ?, last_name = ?, university = ?, email = ? WHERE ${filter} = ?`,
        [
            (updatedData.first_name == null || updatedData.first_name === '') ? previousUserData.first_name : updatedData.first_name,
            (updatedData.last_name == null || updatedData.last_name === '') ? previousUserData.last_name : updatedData.last_name,
            (updatedData.university == null || updatedData.university === '') ? previousUserData.university : updatedData.university,
            (updatedData.email == null || updatedData.email === '') ? previousUserData.email : updatedData.email,
            filterValue
        ]
    );

    for (const key in updatedData) {
        if (updatedData[key] == null || updatedData[key] === '') { 
            console.log(`The ${key} is missing in the updated data`); // TODO: use the middleware for this if needed.
        }
    }

    if (result.affectedRows === 0) { 
        services.throwError(
            `No user found with ${filter} ${filterValue} to update`,
            data.ErrorCodes.USER_NOT_FOUND,
        );
    }

    console.log(`User with ${filter} ${filterValue} updated successfully`);
    return result.affectedRows;
}

async function deleteUser(filter, filterValue) {
    checkFilter(filter, filterValue);

    const [result] = await databaseServices.query(
        `DELETE FROM users WHERE ${filter} = ?`,
        [filterValue]
    );


    if (result.affectedRows === 0) { 
        services.throwError(
            `No user found with ${filter} ${filterValue} to delete`,
            data.ErrorCodes.USER_NOT_FOUND,
        );
    }

    console.log(`User with the ${filter} ${filterValue} deleted successfully`);
}


async function patchUserData(filter, filterValue, column, value) {
    checkFilter(filter, filterValue);
        
    if (!editableColumns.includes(column))
        services.throwError(`You can't edit ${column}.`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

    const [result] = await databaseServices.query(`
        UPDATE users SET ${column} = ? WHERE ${filter} = ?`,
        [value, filterValue]
    );

    console.log(`The user's data has been successfully updated.`);
}

module.exports = {
    createUser,
    getUser,
    editUser,
    deleteUser,
    patchUserData,
};