const userRepository = require('../Database/UserRepository.js');
const authServices = require('../Services/AuthServices.js');
const jwt = require('jsonwebtoken');

async function signup(request, response) { 
    const userData = {...request.body};
    const newUser = await authServices.createUser(userData);
    
    return response.status(201).json({
        message: 'User created successfully'
    });
}


async function login(request, response) {
    const userData = {...request.body};
    const user = await authServices.loginHandler(userData.email, userData.password);

    const token = jwt.sign(
        {sub: user.id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    response.json({ token });
    return response.status(200).json({
        message: 'User Loged in successfully'
    });
} 

module.exports = {
    signup,
    login
};