const express = require('express');
const cors = require('cors');
const services = require('../Services/Services');
const data = require('../Data/Classes_Data')

const app = express();
app.use(cors());
app.use(express.json());






function errorHandler(response, object) {
    switch (object.Code) {
        
        case data.ErrorCodes.SECTION_NOT_FOUND:
        case data.ErrorCodes.SECTION_KEY_NOT_FOUND:
            return response.status(404).send(object.Message);
        
        case data.ErrorCodes.KEY_NOT_FOUND:
            return response.status(400).send(object.Message);

        default:
            return response.status(400).send(`Something went wrong`);

    }
}




// ------------------------------ GET ------------------------------


function GET(request, response) {
    response.status(200).send("Welcome to the student dashboard");
}


function GETSection(request, response) {
    const SectionKey = request.params.Section;
    const Section = services.getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");

    const filteredSubSection = services.filterSubSection(request, Section, SectionKey);
    if (!filteredSubSection.Error && filteredSubSection.Code == data.ErrorCodes.PARAMETERS_NOT_FOUND) {
        return response.status(200).json(Section);
    }
    
    if (filteredSubSection.Error === true ) return errorHandler(response, filteredSubSection);

    return response.status(200).json(filteredSubSection);

}


function POSTSection(request, response) {
    const SectionKey = request.params.Section;
    const Section = services.getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");

    
    const clientData = request.body;
    const newSubSection = services.createSubSection(clientData, SectionKey, Section);
    if (newSubSection.Error === true) return errorHandler(response, newSubSection, Section);
    return response.status(201).json(newSubSection);
}



function DELETESection(request, response) {
    const SectionKey = request.params.Section;
    const Section = services.getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");
    
    
    let filteredSubSection = services.filterSubSection(request, Section, SectionKey);
    if (filteredSubSection.Error === true ) return controller.errorHandler(response, filteredSubSection);
    if (Array.isArray(filteredSubSection)) filteredSubSection = filteredSubSection[0];

    services.deleteSubSection(filteredSubSection, Section);
    return response.status(200).send(`The ${SectionKey} has been deleted`);
    
}



function PUTSection(request, response) {
    const SectionKey = request.params.Section;
    const Section = services.getSection(SectionKey);
    if (Section.Error === true) return response.status(404).send(Section.Message ?? "Not Found");

    let filteredSubSection = services.filterSubSection(request, Section, SectionKey);
    if (filteredSubSection.Error === true ) return errorHandler(response, filteredSubSection);
    if (Array.isArray(filteredSubSection)) filteredSubSection = filteredSubSection[0];

    const clientData = request.body;
    
    const newSubSection = services.putSubSection(clientData, SectionKey, Section, filteredSubSection);
    if (newSubSection.Error === true) return errorHandler(response, newSubSection);
    return response.status(200).send(`The ${SectionKey} has been successfully replaced`);
}


module.exports = { GET, GETSection, POSTSection, DELETESection, PUTSection, errorHandler };