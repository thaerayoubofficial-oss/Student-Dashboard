const databaseServices = require('../Database/DatabaseServices.js');



async function findUser(filter, filterValue) {

    const [result] = await databaseServices.query(`
        SELECT * FROM users WHERE ${filter} = ?`, 
        [filterValue]
    );

    return result[0];
}


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
  
  return result.insertId;
}


async function editUser(filter, filterValue, updatedData, previousUserData) { 
    
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

    return result.affectedRows;
}

async function deleteUser(filter, filterValue) {
    const [result] = await databaseServices.query(
        `DELETE FROM users WHERE ${filter} = ?`,
        [filterValue]
    );

    return result.affectedRows;
}


async function patchUserData(filter, filterValue, column, value) {

    const [result] = await databaseServices.query(`
        UPDATE users SET ${column} = ? WHERE ${filter} = ?`,
        [value, filterValue]
    );

    return result.affectedRows;
}


module.exports = {
    createUser,
    editUser,
    deleteUser,
    patchUserData,
    findUser
};