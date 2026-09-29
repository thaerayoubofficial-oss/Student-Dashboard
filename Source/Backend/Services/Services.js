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

    //FIXME: Fixed bugs, multiple filters is the only implementation left to do.

    let query = Object.assign({}, request.query);
    let error;
   
    if (Object.keys(query).length === 0) {
        error = data.ErrorCodes.PARAMETERS_NOT_FOUND;
        return {"object": undefined, "error": error, "key": undefined, "SectionKey": SectionKey};
    }

    let params = Object.entries(query);
    
    let [key, value] = params[0];
    
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


function addUserData(clientData, SectionKey, replacement, filteredSubSection) {
    const newSubSection = {};
    let error;

    if (Array.isArray(filteredSubSection["object"])) filteredSubSection["object"] = filteredSubSection["object"][0];

    for(const [key, value] of Object.entries(clientData)) {
        if (!data.sectionFields[SectionKey].includes(key)) {
            error = data.ErrorCodes.KEY_NOT_FOUND;
            return {"object": undefined, "error": error, "key": key, "SectionKey": SectionKey};
        } 
        newSubSection[key] = value;
    }

    for (let sectionField of data.sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            if (replacement === true && filteredSubSection["object"]?.[sectionField] !== undefined) {
                newSubSection[sectionField] = filteredSubSection["object"][sectionField];
            } else {
                newSubSection[sectionField] = "Not Specified";
            } 
        }        
    }

    return {"object": newSubSection, "error": error, "key": undefined, "SectionKey": SectionKey};
;
}

function createSubSection(clientData, SectionKey, SectionObj) {
    const newSubSection = addUserData(clientData, SectionKey, SectionObj, false, undefined);
    if (newSubSection["error"] !== undefined) return;
    SectionObj.push(newSubSection["object"]);
    return {"object": newSubSection["object"], "error": undefined};
}



function deleteSubSection(filteredSubSection, SectionObj) {
    const indexOfFilteredSection = SectionObj.indexOf(filteredSubSection);
    SectionObj.splice(indexOfFilteredSection, 1);
}


function putSubSection(clientData, SectionKey, SectionObj, filteredSubSection) {
    const newSubSection = addUserData(clientData, SectionKey, true, filteredSubSection);
    if (newSubSection["error"] !== undefined) return;

    let replacementIndex = SectionObj.indexOf(filteredSubSection["object"][0]);
    SectionObj.splice(replacementIndex, 1, newSubSection["object"]);
    return {"object": newSubSection["object"], "error": undefined};
}


module.exports = {getSection, filterSubSection, createSubSection, deleteSubSection, putSubSection};