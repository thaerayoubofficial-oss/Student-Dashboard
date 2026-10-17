const databaseServices = require('../Database/DatabaseServices.js');
const services = require('./Services.js');
const data = require('../Data/Classes_Data.js');


async function createUser(userData) { 
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


async function getUserById(id) {
    const [filteredUser] = await databaseServices.query(`
        SELECT * FROM users WHERE id = ?`, 
        [id]
    )[0];

    if (filteredUser == null) { 
        services.throwError(
            `No user found with ID ${id}`,
            data.ErrorCodes.USER_NOT_FOUND,
        );
    }
    return filteredUser;
}

async function getUserByEmail(email) {
    const [filteredUser] = await databaseServices.query(`
        SELECT * FROM users WHERE email = ?`, 
        [email]
    )[0];

    if (filteredUser == null) {
        services.throwError(
            `No user found with the Email ${email}`,
            data.ErrorCodes.USER_NOT_FOUND,
        );
    }
    return filteredUser;
}

async function editUser(id, updatedData) { 
    const previousUserData = await getUserById(id); 
    const [result] = await databaseServices.query(
        `UPDATE users SET first_name = ?, last_name = ?, university = ?, email = ? WHERE id = ?`,
        [
            (updatedData.first_name == null || updatedData.first_name === '') ? previousUserData.first_name : updatedData.first_name,
            (updatedData.last_name == null || updatedData.last_name === '') ? previousUserData.last_name : updatedData.last_name,
            (updatedData.university == null || updatedData.university === '') ? previousUserData.university : updatedData.university,
            (updatedData.email == null || updatedData.email === '') ? previousUserData.email : updatedData.email,
            id
        ]
    );

    for (const key in updatedData) {
        if (updatedData[key] == null || updatedData[key] === '') { 
            console.log(`The ${key} is missing in the updated data`); //TODO: use the middleware for this if needed.
        }
    }

    if (result.affectedRows === 0) { 
        services.throwError(
            `No user found with ID ${id} to update`,
            data.ErrorCodes.USER_NOT_FOUND,
        );
    }

    console.log(`User with ID ${id} updated successfully`);
    return result.affectedRows;
}

async function deleteUserById(id) {
    const [result] = await databaseServices.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
    );

    console.log(`User with the ID ${id} deleted successfully`);
}


async function deleteUserByEmail(email) {
    const [result] = await databaseServices.query(
        `DELETE FROM users WHERE email = ?`,
        [email]
    );

    console.log(`User with the email ${email} deleted successfully`);
}


async function patchUserDataById(id, property, value) {
    let user = await getUserById(id);
    if (property == 'id' || property == 'password_hash')
        services.throwError(`You can't edit ${property}.`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);


    if (user?.[property] === undefined) 
        services.throwError(`Property ${property} not found in user data`, data.ErrorCodes.CLIENT_DATA_ARE_INVALID);

    const [result] = await databaseServices.query(`
        UPDATE users SET ${property} = ? WHERE id  = ?`,
    [value, id]);

}

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    editUser,
    deleteUserById,
    deleteUserByEmail,
    patchUserDataById
};