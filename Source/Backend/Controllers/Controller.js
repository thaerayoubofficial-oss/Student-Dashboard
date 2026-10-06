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
    switch (errorObject) {
        case data.ErrorCodes.KEY_NOT_FOUND:
            if (key !== undefined) {
                return next(
                    throwError(`There is no ${key} in ${SectionKey}`, 404)
                );
            }

            return next(
                throwError(`The Key that was inputted is undefined`, 400)
            );

        case data.ErrorCodes.SECTION_NOT_FOUND:
            if (SectionKey !== undefined && SectionKey !== '') {
                return next(
                    throwError(`The ${SectionKey} doesn't exist`, 404)
                );
            }

            return next(
                throwError(`The Section doesn't exist`, 404)
            );

        case data.ErrorCodes.SUBSECTION_NOT_FOUND:
            return next(
                throwError(`Not Found`, 404)
            );

        default:
            return next(
                throwError('Something went wrong', 400)
            );
    }
}

function sectionError(request, next) {
    const SectionKey = request.params.Section;
    const Section = services.getSection(SectionKey);
    const errorResponse = handleErrors(Section["error"], next, undefined, SectionKey);
    if (Section["error"] !== undefined) {
        return errorResponse;
    }
    return Section;
}


function subSectionError(request, next) {
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return Section;

    
    const filteredSubSection = services.filterSubSection(request, Section["object"], Section["SectionKey"]);
    const errorResponse = handleErrors(filteredSubSection["error"], next, filteredSubSection["key"], filteredSubSection["SectionKey"]);

    if (filteredSubSection["error"] === undefined) return filteredSubSection;

    return filteredSubSection["error"] === data.ErrorCodes.PARAMETERS_NOT_FOUND ? Section["object"] : errorResponse;

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
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return Section;

    
    const clientData = request.body;
    const newSubSection = services.createSubSection(clientData, Section["SectionKey"], Section["object"]);
    const errorResponse = handleErrors(newSubSection["error"], next, newSubSection["key"], newSubSection["SectionKey"]);
    
    return newSubSection["error"] === undefined ? response.status(201).json(newSubSection) : errorResponse;
}



function DELETESection(request, response, next) {
    const Section = sectionError(request, next);
    if (Section["error"] !== undefined) return Section;

    const filteredSubSection = subSectionError(request, next);
    if (filteredSubSection["error"] !== undefined) return filteredSubSection;


    const deletion = services.deleteSubSection(filteredSubSection["object"], Section["object"]);
    
    const errorResponse = handleErrors(deletion["error"], next, undefined, Section["SectionKey"]);
    if (deletion["error"] !== undefined) return errorResponse;

    return response.status(200).send(`The ${Section["SectionKey"]} has been deleted`);
    
}



function PUTSection(request, response, next) {
    const Section = sectionError(request, next);
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
    const Section = sectionError(request, next);
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