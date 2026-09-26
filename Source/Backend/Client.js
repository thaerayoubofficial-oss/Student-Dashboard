const axios = require('axios');
const { response } = require('express');

// axios.post('http://localhost:3000/Classes', {
//     Class:"" //etc    
// }).then((response) => {console.log(response.data);});


axios.put('http://localhost:3000/Classes?Class=Calculus I', {
    Class: "Physics III"
}).then(
    (response) => {
        console.log(response.data);
    }
)


// axios.delete('http://localhost:3000/Classes?Class=Calculus I').then(
//     (response) => {
//         console.log(response.data);
//     }
// )
