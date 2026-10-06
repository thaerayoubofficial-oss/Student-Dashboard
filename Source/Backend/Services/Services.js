const data = require('../Data/Classes_Data');


function getSection(SectionKey) {
    const Section = data.Sections[SectionKey];
    let error;
    if (Section === undefined) {
        error = data.ErrorCodes.SECTION_NOT_FOUND;
        return {"object": undefined, "error": error, "SectionKey": SectionKey};
    }
   return {"object" : Section, "error": error, "SectionKey": SectionKey};
}



function filterSubSection(request, Section, SectionKey) {

    //TODO: Fixed bugs, multiple filters is the only implementation left to do.

    let query = Object.assign({}, request.query);
    let error;
   
    if (Object.keys(query).length === 0) {
        error = data.ErrorCodes.PARAMETERS_NOT_FOUND;
        return {"object": undefined, "error": error, "key": undefined, "SectionKey": SectionKey};
    }

    let params = Object.entries(query);
    
    let [key, value] = params[0];
    

    if (Section === undefined) return getSection(SectionKey);

    if (!Object.keys(Section[0]).includes(key)) {
        error = data.ErrorCodes.KEY_NOT_FOUND;
        return {"object": undefined, "error": error, "key": key, "SectionKey": SectionKey};
    }
    
    const filtered = Section.filter(fieldElement => fieldElement[key].replace(/\s+/g, '') === value.replace(/\s+/g, ''));
    
    if (filtered.length === 0) {
        error = data.ErrorCodes.SUBSECTION_NOT_FOUND;
        return {"object": undefined, "error": error, "key": key, "SectionKey": SectionKey};
    }
    
    return {"object": filtered, "error": undefined, "key": key, "SectionKey": SectionKey};
    
}


function addClientData(clientData, SectionKey) {
    const newSubSection = {};
    let error;

    if (clientData === undefined) {
        error = data.ErrorCodes.CLIENT_DATA_NOT_FOUND;
        return {"object": undefined, "error": error, "key": undefined, "SectionKey": SectionKey};
    }


    for(const [key, value] of Object.entries(clientData)) {
        if (!data.sectionFields[SectionKey].includes(key)) {
            error = data.ErrorCodes.KEY_NOT_FOUND;
            return {"object": undefined, "error": error, "key": key, "SectionKey": SectionKey};
        } 
        newSubSection[key] = value;
    }

    return {"object": newSubSection, "error": error, "key": undefined, "SectionKey": SectionKey};

}

function manageClientData(clientData, SectionKey, replacement, filteredSubSection) {
    
    if (Array.isArray(filteredSubSection["object"])) filteredSubSection["object"] = filteredSubSection["object"][0];
    
    const newSubSection = addClientData(clientData, SectionKey);
    if (newSubSection["error"] !== undefined) return newSubSection;

    for (let sectionField of data.sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            if (replacement === true && filteredSubSection["object"]?.[sectionField] !== undefined) {
                newSubSection[sectionField] = filteredSubSection["object"][sectionField];
            } else {
                newSubSection[sectionField] = "Not Specified";
            } 
        }        
    }

    return {"object": newSubSection, "error": undefined, "key": undefined, "SectionKey": SectionKey};
}

function createSubSection(clientData, SectionKey, SectionObj) {
    const newSubSection = addClientData(clientData, SectionKey);
    if (newSubSection["error"] !== undefined) return newSubSection;
    
    SectionObj.push(newSubSection["object"]);
    return {"object": newSubSection["object"], "error": undefined};
}



function deleteSubSection(filteredSubSectionObj, SectionObj) {
    const indexOfFilteredSection = SectionObj.indexOf(filteredSubSectionObj);
    let error;
    if (indexOfFilteredSection === -1) {
        error = data.ErrorCodes.SECTION_NOT_FOUND;
        return {"error": error};
    }
    SectionObj.splice(indexOfFilteredSection, 1);

    return {"error": undefined};
}


function putSubSection(clientData, SectionKey, SectionObj, filteredSubSection) {
    const newSubSection = manageClientData(clientData, SectionKey, false);
    let error;
    if (newSubSection["error"] !== undefined) return newSubSection;

    let replacementIndex = SectionObj.indexOf(filteredSubSection["object"][0]); 
    
    if (replacementIndex === -1) {
        error = data.ErrorCodes.SECTION_NOT_FOUND;
        return {"object": newSubSection["object"], "error": error}
    }
    
    SectionObj.splice(replacementIndex, 1, newSubSection["object"]);
    return {"object": newSubSection["object"], "error": undefined};
}


function patchSubSection(clientData, SectionKey, SectionObj, filteredSubSection) {
    const newSubSection = manageClientData(clientData, SectionKey, true, filteredSubSection);
    if (newSubSection["error"] !== undefined) return newSubSection;
    
    let replacementIndex = SectionObj.indexOf(filteredSubSection["object"][0]);
    
    if (replacementIndex === -1) {
        error = data.ErrorCodes.SECTION_NOT_FOUND;
        return {"object": newSubSection["object"], "error": error}
    }

    SectionObj.splice(replacementIndex, 1, newSubSection["object"]);
    return {"object": newSubSection["object"], "error": undefined};

}



module.exports = {getSection, filterSubSection, createSubSection, deleteSubSection, putSubSection, patchSubSection};  