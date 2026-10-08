const express = require('express');
const cors = require('cors');
const services = require('../Services/Services');
const data = require('../Data/Classes_Data');

const app = express();

app.use(cors());
app.use(express.json());


// ------------------------------ HELPERS ------------------------------

function sectionHandler(request) {
    const sectionKey = request.params.Section;

    return services.getSection(sectionKey);
}


function subSectionHandler(request) {
    return services.filterSubSection(request);
}


// ------------------------------ GET ------------------------------

function GET(request, response) {
    return response
        .status(200)
        .send("Welcome to the student dashboard");
}


function GETSection(request, response) {

    const section = sectionHandler(request);

    try {

        const filteredSubSection = subSectionHandler(request);

        return response
            .status(200)
            .json(filteredSubSection);

    } catch (error) {

        if (error.code === data.ErrorCodes.PARAMETERS_NOT_FOUND.code) {

            return response
                .status(200)
                .json(section);
        }

        throw error;
    }
}


// ------------------------------ POST ------------------------------

function POSTSection(request, response) {

    const sectionKey = request.params.Section;
    const clientData = request.body;

    const newSubSection = services.createSubSection(
        clientData,
        sectionKey
    );

    return response
        .status(201)
        .json(newSubSection);
}


// ------------------------------ DELETE ------------------------------

function DELETESection(request, response) {

    const sectionKey = request.params.Section;
    const filteredSubSection = subSectionHandler(request);

    services.deleteSubSection(
        filteredSubSection,
        sectionKey
    );

    return response
        .status(200)
        .send(`The ${sectionKey} has been deleted`);
}


// ------------------------------ PUT ------------------------------

function PUTSection(request, response) {

    const sectionKey = request.params.Section;
    const filteredSubSection = subSectionHandler(request);
    const clientData = request.body;

    services.putSubSection(
        clientData,
        sectionKey,
        filteredSubSection
    );

    return response
        .status(200)
        .send(`The ${sectionKey} has been successfully replaced`);
}


// ------------------------------ PATCH ------------------------------

function PATCHSection(request, response) {

    const sectionKey = request.params.Section;
    const filteredSubSection = subSectionHandler(request);
    const clientData = request.body;

    services.patchSubSection(
        clientData,
        sectionKey,
        filteredSubSection
    );

    return response
        .status(200)
        .send(`The ${sectionKey} has been successfully edited`);
}


module.exports = {
    GET,
    GETSection,
    POSTSection,
    DELETESection,
    PUTSection,
    PATCHSection
};