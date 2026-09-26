const express = require('express');
const app = express();

app.use(express.json());

const sectionRoute = require(`./Routes/Routes`);
//TODO: Error handling here
if (sectionRoute === undefined) return;
app.use(`/`, sectionRoute);


app.listen(3000, () => console.log("http://localhost:3000"));