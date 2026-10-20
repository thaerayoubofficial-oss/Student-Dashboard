const userRepository = require('../Database/UserRepository.js');

async function signup(request, response) { 
    const newUser = await userRepository.createUser(userData);
    
    return response.status(201).json({
        message: 'User created successfully',
        user: newUser,
    });
}


async function login(request, response) {
    const userData = {...request.body};
    const user = userRepository.getUser("email", userData.email);
    for (const [key, value] of Object.entries(userData)) {
        
    }
} 

module.exports = {
    signup,
    login
};