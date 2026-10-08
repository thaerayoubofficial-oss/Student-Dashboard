const express = require('express');
const cors = require('cors');
const services = require('../Services/Services');
const data = require('../Data/Classes_Data')

const app = express();
app.use(cors());
app.use(express.json());



function sectionHandler(request, next) {
    const sectionKey = request.params.Section;
    const section = services.getSection(sectionKey);
    try {
        return section;
    } catch (error) {
        return next(error);
    }
}


function subSectionError(request, next) {
    const section = sectionHandler(request, next);    
    const filteredSubSection = services.filterSubSection(request);
    try {
        return filteredSubSection;
    } catch (error) {
        if (error.code === data.ErrorCodes.PARAMETERS_NOT_FOUND) return section;
        return next(error);
    }
}


// ------------------------------ GET ------------------------------


function GET(request, response) {
    response.status(200).send("Welcome to the student dashboard");
}


function GETSection(request, response, next) {
    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return filteredSubSection;
    return response.status(200).json(filteredSubSection);
}


function POSTSection(request, response, next) {
    const Section = sectionHandler(request, next);
    if (Section["error"] !== undefined) return Section;

    
    const clientData = request.body;
    const newSubSection = services.createSubSection(clientData, Section["SectionKey"], Section["object"]);
    const errorResponse = handleErrors(newSubSection["error"], next, newSubSection["key"], newSubSection["SectionKey"]);
    
    return newSubSection["error"] === undefined ? response.status(201).json(newSubSection) : errorResponse;
}



function DELETESection(request, response, next) {
    const Section = sectionHandler(request, next);
    if (Section["error"] !== undefined) return Section;

    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return filteredSubSection;


    const deletion = services.deleteSubSection(filteredSubSection["object"], Section["object"]);
    
    const errorResponse = handleErrors(deletion["error"], next, undefined, Section["SectionKey"]);
    if (deletion["error"] !== undefined) return errorResponse;

    return response.status(200).send(`The ${Section["SectionKey"]} has been deleted`);
    
}



function PUTSection(request, response, next) {
    const Section = sectionHandler(request, next);
    if (Section["error"] !== undefined) return Section;

    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return filteredSubSection;

    const clientData = request.body;
    const newSubSection = services.putSubSection(clientData, Section["SectionKey"], Section["object"], filteredSubSection);
    const errorResponse = handleErrors(newSubSection["error"], next, newSubSection["key"], newSubSection["SectionKey"]);

    if (newSubSection["error"] !== undefined) return errorResponse;

    return response.status(200).send(`The ${Section["SectionKey"]} has been successfully replaced`);
}


function PATCHSection(request, response, next) {
    const Section = sectionHandler(request, next);
    if (Section["error"] !== undefined) return Section;

    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return filteredSubSection;

    const clientData = request.body;
    const newSubSection = services.patchSubSection(clientData, Section["SectionKey"], Section["object"], filteredSubSection);
    const errorResponse = handleErrors(newSubSection["error"], next, newSubSection["key"], newSubSection["SectionKey"]);
    
    if (newSubSection["error"] !== undefined) return errorResponse;
    
    return response.status(200).send(`The ${Section["SectionKey"]} has been successfully edited`);

}


module.exports = { GET, GETSection, POSTSection, DELETESection, PUTSection, PATCHSection };