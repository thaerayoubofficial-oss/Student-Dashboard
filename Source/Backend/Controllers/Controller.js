const express = require('express');
const cors = require('cors');
const services = require('../Services/Services');
const data = require('../Data/Classes_Data')

const app = express();
app.use(cors());
app.use(express.json());


function throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
} 

function handleErrors(errorObject, next, key, SectionKey) {
    if (errorObject === undefined) {
        console.log(`${errorObject} doesn't have an error field, or there are no errors`);
    }

    switch (errorObject) {
        case data.ErrorCodes.KEY_NOT_FOUND:
            return next(throwError(`There is no ${key} in ${SectionKey}`, 404));
        case data.ErrorCodes.SECTION_NOT_FOUND:
            return next(throwError(`The ${SectionKey} doesn't exist`, 404));
    }
}

function sectionError(request, next) {
    const SectionKey = request.params.Section;
    const Section = services.getSection(SectionKey);
    if (Section["error"] !== undefined) {
        return next(throwError(`There is no ${SectionKey} is the dashboard`), 404);
    }
    return Section;
}


function subSectionError(request, next) {
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return;

    
    const filteredSubSection = services.filterSubSection(request, Section["object"], Section["SectionKey"]);
    const errorResponse = handleErrors(filteredSubSection["error"], next, filteredSubSection["key"], filteredSubSection["SectionKey"]);

    if (filteredSubSection["error"] === undefined) {
        return filteredSubSection;
    }

    return filteredSubSection["error"] === data.ErrorCodes.PARAMETERS_NOT_FOUND ? Section["object"] : errorResponse;

}


// ------------------------------ GET ------------------------------


function GET(request, response) {
    response.status(200).send("Welcome to the student dashboard");
}


function GETSection(request, response, next) {
    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return;
    return response.status(200).json(filteredSubSection);
}


function POSTSection(request, response, next) {
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return;

    
    const clientData = request.body;
    const newSubSection = services.createSubSection(clientData, Section["SectionKey"], Section["object"]);
    const errorResponse = handleErrors(newSubSection["error"], next, newSubSection["key"], newSubSection["SectionKey"]);
    return newSubSection["error"] === undefined ? response.status(201).json(newSubSection) : errorResponse;
}



function DELETESection(request, response, next) {
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return;

    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return;


    services.deleteSubSection(filteredSubSection["object"], Section["object"]);
    return response.status(200).send(`The ${Section["SectionKey"]} has been deleted`);
    
}



function PUTSection(request, response, next) {
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return;

    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return;

    const clientData = request.body;
    const newSubSection = services.putSubSection(clientData, Section["SectionKey"], Section["object"], filteredSubSection);
    
    const errorResponse = handleErrors(newSubSection["error"], next, newSubSection["key"], newSubSection["SectionKey"]);
    return newSubSection["error"] === undefined ? response.status(200).send(`The ${Section["SectionKey"]} has been successfully replaced`) : errorResponse;
}




module.exports = { GET, GETSection, POSTSection, DELETESection, PUTSection };