const data = require('../Data/Classes_Data');


function throwError(message, errorInfo) {
    const error = new Error(message);
    error.code = errorInfo.code;
    error.status = errorInfo.status;
    throw error;
}

function getSection(sectionKey) {

    const section = data.sections[sectionKey];

    if (section === undefined) {    
        throwError(`${sectionKey} isn't found`, data.ErrorCodes.SECTION_NOT_FOUND);
    }

    return section;
}



function filterSubSection(request) {

    //TODO: Fixed bugs, multiple filters is the only implementation left to do.
    const sectionKey = request.params.Section;
    const section = getSection(sectionKey);


    let query = Object.assign({}, request.query);
   
    if (Object.keys(query).length === 0) {
        throwError(`This can't be filtered`, data.ErrorCodes.PARAMETERS_NOT_FOUND);
    }

    let params = Object.entries(query);
    
    let [key, value] = params[0];
    
    if (!Object.keys(section[0]).includes(key)) {
        throwError(`${key} isn't found in ${sectionKey}`, data.ErrorCodes.KEY_NOT_FOUND);
    }
    
    const filtered = section.find(fieldElement => {
        if (typeof fieldElement[key] === 'string') {
            return fieldElement[key].replace(/\s+/g, '').toLowerCase() === value.replace(/\s+/g, '').toLowerCase();
        } else {
            return fieldElement[key] === value;
        }
    });
    
    if (filtered === undefined) {
        throwError(`${key} = ${value} couldn't be filtered`, data.ErrorCodes.SUBSECTION_NOT_FOUND); 
    }

    return filtered;    
}


function addClientData(clientData, sectionKey) {
    const newSubSection = {};

    if (clientData === null) {
        throwError(`The Client's Data are undefined`, data.ErrorCodes.CLIENT_DATA_NOT_FOUND);
    }


    for(const [key, value] of Object.entries(clientData)) {
        if (!data.sectionFields[sectionKey].includes(key)) {
            throwError(`${key} isn't found in ${sectionKey}`, data.ErrorCodes.KEY_NOT_FOUND);
        } 
        newSubSection[key] = value;
    }

    return newSubSection;

}

function manageClientData(clientData, sectionKey, replacement, filteredSubSection) {
    
    const newSubSection = addClientData(clientData, sectionKey);

    if (Object.keys(newSubSection).length === 0) {
        throwError(`The Sub-Section couldn't because it is empty`, data.ErrorCodes.SUBSECTION_CANT_BE_CREATED);
    }

    for (let sectionField of data.sectionFields[sectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            if (replacement === true && filteredSubSection?.[sectionField] !== undefined) {
                newSubSection[sectionField] = filteredSubSection[sectionField];
            } else {
                newSubSection[sectionField] = "Not Specified";
            } 
        }        
    }

    return newSubSection;
}

function createSubSection(clientData, sectionKey) {
    const section = getSection(sectionKey);
    const newSubSection = addClientData(clientData, sectionKey);
    
    section.push(newSubSection);
    return newSubSection;
}



function deleteSubSection(filteredSubSection, sectionKey) {
    const section = getSection(sectionKey);
    const indexOfFilteredSection = section.indexOf(filteredSubSection);
    
    if (indexOfFilteredSection === -1) {
        throwError(`${sectionKey} isn't found`, data.ErrorCodes.SUBSECTION_NOT_FOUND);
    }
    section.splice(indexOfFilteredSection, 1);
}


function putSubSection(clientData, sectionKey, filteredSubSection) {
    const section = getSection(sectionKey);
    const newSubSection = manageClientData(clientData, sectionKey, false);
    let replacementIndex = section.indexOf(filteredSubSection); 
    
    
    if (replacementIndex === -1) {
        throwError(`${sectionKey} isn't found`, data.ErrorCodes.SECTION_NOT_FOUND);
    }
    section.splice(replacementIndex, 1, newSubSection);
    
    return newSubSection;
}


function patchSubSection(clientData, sectionKey, filteredSubSection) {
    const section = getSection(sectionKey);
    const newSubSection = manageClientData(clientData, sectionKey, true, filteredSubSection);
    let replacementIndex = section.indexOf(filteredSubSection); 
    
    
    if (replacementIndex === -1) {
        throwError(`${sectionKey} isn't found`, data.ErrorCodes.SECTION_NOT_FOUND);
    }

    section.splice(replacementIndex, 1, newSubSection);
    return newSubSection;

    
}



module.exports = {getSection, filterSubSection, createSubSection, deleteSubSection, putSubSection, patchSubSection};  