const express = require('express');
const ErrorHandler = require('./Middleware/ErrorHandler');


const app = express();

app.use(express.json());

const sectionRoute = require(`./Routes/Routes`);
//TODO: Error handling here
if (sectionRoute === undefined) return;
app.use(`/`, sectionRoute);
app.use(ErrorHandler.errorHandler);


app.listen(3000, () => console.log("http://localhost:3000"));