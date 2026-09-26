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


//TODO: Use Javscript/Node.js/Express Error handler if it exists
let ErrorCodes = {
    SECTION_NOT_FOUND: 'SECTION_NOT_FOUND',
    KEY_NOT_FOUND: 'SECTION_NOT_FOUND',
    SECTION_KEY_NOT_FOUND: 'SECTION_KEY_NOT_FOUND',
    PARAMETERS_NOT_FOUND: 'PARAMETERS_NOT_FOUND'
};


function throwError(Error, Message, Code) {
    return {
        Error: Error,
        Message: Message,
        Code: Code
    };
} 


function errorHandler(response, object) {
    switch (object.Code) {
        
        case ErrorCodes.SECTION_NOT_FOUND:
        case ErrorCodes.SECTION_KEY_NOT_FOUND:
            return response.status(404).send(object.Message);
        
        case ErrorCodes.KEY_NOT_FOUND:
            return response.status(400).send(object.Message);

        default:
            return response.status(400).send(`Something went wrong`);

    }
}

// ------------------------------ GET ------------------------------



function getSection(SectionKey) {
    const Section = Sections[SectionKey];
    if (Section === undefined) return throwError(true, `There is no ${SectionKey} in the dashboard`, ErrorCodes.SECTION_NOT_FOUND);
   return Section;
}



function getFiltered(request, Section, SectionKey) {

    //FIXME: Fixed bugs, multiple filters is the only implementation left to do.

    let query = Object.assign({}, request.query);
   
    if (Object.keys(query).length === 0) return throwError(false, `There were no parameters`, ErrorCodes.PARAMETERS_NOT_FOUND);
   

    let params = Object.entries(query);
    
    let [key, value] = params[0];

    if (!Object.keys(Section[0]).includes(key)) {
        return throwError(true, `There is no ${key} in ${SectionKey}`, ErrorCodes.KEY_NOT_FOUND);
    }

    const filtered = Section.filter(fieldElement => fieldElement[key].replace(/\s+/g, '') === value.replace(/\s+/g, ''));
    return filtered.length > 0 ? filtered : throwError(true, `The ${SectionKey} doesn't exist`, ErrorCodes.SECTION_KEY_NOT_FOUND);

    
}


// -------- Main GET --------
app.get('/', (request, response) => {
    response.status(200).send("Welcome to the student dashboard");
});



app.get('/:Section', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");

    const filteredSubSection = getFiltered(request, Section, SectionKey);
    if (!filteredSubSection.Error && filteredSubSection.Code == ErrorCodes.PARAMETERS_NOT_FOUND) {
        return response.status(200).json(Section);
    }
    
    if (filteredSubSection.Error === true ) return errorHandler(response, filteredSubSection);

    return response.status(200).json(filteredSubSection);
});


// ------------------------------ POST -------------------------------

app.post('/:Section', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");

    
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
app.delete('/:Section', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");


    let filteredSubSection = getFiltered(request, Section, SectionKey);
    if (filteredSubSection.Error === true ) return errorHandler(response, filteredSubSection);
    if (Array.isArray(filteredSubSection)) filteredSubSection = filteredSubSection[0];

    const indexOfFilteredSection = Section.indexOf(filteredSubSection);
    
    Section.splice(indexOfFilteredSection, 1);
    return response.status(200).send(`The ${SectionKey} has been deleted`);
    
});


//------------------------------ PUT ------------------------------

app.put('/:Section', (request, response) => {
    const SectionKey = request.params.Section;
    const Section = getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");

    const clientData = request.body;
    
    let filteredSubSection = getFiltered(request, Section, SectionKey); //Because it returns an array with array.filter();
    if (filteredSubSection.Error === true ) return errorHandler(response, filteredSubSection);
    if (Array.isArray(filteredSubSection)) filteredSubSection = filteredSubSection[0];

    const newSubSection = {};


    for(const [key, value] of Object.entries(clientData)) {
        if (!sectionFields[SectionKey].includes(key)) return response.status(400).send(`${key} is a field that isn't found in ${SectionKey}`); 
        newSubSection[key] = value;
    }

    for (let sectionField of sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            newSubSection[sectionField] = filteredSubSection[sectionField];
        }        
    }

    Section.splice(Section.indexOf(filteredSubSection), 1, newSubSection);
    return response.status(200).send(`The ${SectionKey} has been successfully replaced`);
});



app.listen(3000, () => {
    console.log("http://localhost:3000");
});