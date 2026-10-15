const services = require('../Services/Services');
const data = require('../Data/Classes_Data');



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
    const requestData = request.body;

    const newSubSection = services.createSubSection(
        requestData,
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
    const requestData = request.body;

    services.putSubSection(
        requestData,
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
    const requestData = request.body;

    services.patchSubSection(
        requestData,
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