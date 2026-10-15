const databaseServices = require('../Database/DatabaseServices.js');

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
  console.log(result);
}
 

async function getUserByID(id) {
    const [userFiltered] = await databaseServices.query(`
        SELECT * FROM users WHERE id = ?`, 
        [id]
    );
}



module.exports = {
    createUser,
    getUserByID
};