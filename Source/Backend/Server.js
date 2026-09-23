const express = require('express');
const cors = require('cors');

const app = express();


app.use(cors()); 
app.use(express.json());


/*
  ------------------------------ API For College ------------------------------

  Implementing: 
  GET
  PUT
  POST
  DELETE
  PATCH

*/




let Classes = [
    {Class: "Calculus I", Time: "3:00 PM", Duration: "2 hours"},
    {Class: "Physics II", Time: "5:00 PM", Duration: "3 hours"}
];

let Homework = [
    {Class: "Calculus I", Due : "Tuesday"},
    {Class: "Physics II", Due : "Wednesday"}
];

let Sections = {
    "Classes" : Classes,
    "Homework" : Homework,
    // "Assignment",
    // "Projects",
    // "Exams"
};

let sectionFields = {
    Classes: ['Class', 'Time', 'Duration'],
    Homework: ['Class', 'Due']
}


function getSection(request, response, SectionKey) {
    const Section = Sections[SectionKey];
    if (Section === undefined) return response.status(404).send(`There is no ${SectionKey} in the dashboard`);
   return Section;
}


// ------------------------------ GET ------------------------------


function getFiltered(request, response, Section, SectionKey) {
    const parameter = request.params.value;
    const parts = parameter.split("=");
    let key = parts[0];
    let value = parts[1];
    
 
    if (Section.length === 0) return response.status(404).send(`There is no ${SectionKey}`);

    if (!Object.keys(Section[0]).includes(key)) {
        return response.status(400).send(`There is no ${key} in ${SectionKey}`);
    } 

    const filtered = Section.filter(fieldElement => fieldElement[key] === value);
    return filtered.length > 0 ? filtered : response.status(404).send(`This ${SectionKey} doesn't exist`);
}


// -------- Main GET --------
app.get('/', (request, response) => {
    response.status(200).send("Welcome to the student dashboard");
});



app.get('/:Section', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(request, response, SectionKey);
    return response.status(200).json(Section);

});


app.get('/:Section/:value', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(request, response, SectionKey);

    const filteredSubSection = getFiltered(request, response, Section, SectionKey);

    return response.status(200).json(filteredSubSection);
});



// ------------------------------ POST -------------------------------

app.post('/:Section', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(request, response, SectionKey);
    
    const clientData = request.body;
    
    const newSubSection = {};

    for(const [key, value] of Object.entries(clientData)) {
        if (!sectionFields[SectionKey].includes(key)) return response.status(400).send(`${key} is a field that isn't found in ${SectionKey}`); 
        newSubSection[key] = value;
    }

    for (let sectionField of sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            newSubSection[sectionField] = "Not Specified";
        }        
    }

    Section.push(newSubSection);
    return response.status(201).json(newSubSection);

});


//------------------------------ DELETE -------------------------------
app.delete('/:Section/:value', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(request, response, SectionKey);

    const filteredSubSection = getFiltered(request, response, Section, SectionKey)[0];
    const indexOfFilteredSection = Section.indexOf(filteredSubSection);
    
    Section.splice(indexOfFilteredSection, 1);
    return response.status(204).send(`The ${SectionKey} has been deleted`);
    
});


//------------------------------ PUT ------------------------------

app.put('/:Section/:value', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(request, response, SectionKey);
    const clientData = request.body;

    const filteredSubSection = getFiltered(request, response, Section, SectionKey)[0]; //Because it returns an array with array.filter();

    const newSubSection = {};


    for(const [key, value] of Object.entries(clientData)) {
        if (!sectionFields[SectionKey].includes(key)) return response.status(400).send(`${key} is a field that isn't found in ${SectionKey}`); 
        newSubSection[key] = value;
    }

    //TODO: instead of "Not Specified" we use the old data.

    for (let sectionField of sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            newSubSection[sectionField] = "Not Specified";
        }        
    }

    Section.splice(Section.indexOf(filteredSubSection), 1, newSubSection);
    return response.status(200).send(`The ${SectionKey} has been successfully replaced`);
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});