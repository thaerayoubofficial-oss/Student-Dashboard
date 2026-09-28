const data = require('../Data/Classes_Data');


function getSection(SectionKey) {
    const Section = data.Sections[SectionKey];
    let error;
    if (Section === undefined) {
        error = data.ErrorCodes.SECTION_NOT_FOUND;
        return {"error": error, "Section": undefined};
    }
   return {"object" : Section, "error": error, "SectionKey": SectionKey};
}



function filterSubSection(request, Section, SectionKey) {

    //FIXME: Fixed bugs, multiple filters is the only implementation left to do.

    let query = Object.assign({}, request.query);
    let error;
   
    if (Object.keys(query).length === 0) {
        error = data.ErrorCodes.PARAMETERS_NOT_FOUND;
        return {"error": error};
    }

    let params = Object.entries(query);
    
    let [key, value] = params[0];
    
    if (!Object.keys(Section[0]).includes(key)) {
        error = data.ErrorCodes.KEY_NOT_FOUND;
        return {"key": key, "SectionKey": SectionKey, "error": error};
    }
    
    const filtered = Section.filter(fieldElement => fieldElement[key].replace(/\s+/g, '') === value.replace(/\s+/g, ''));
    
    if (filtered.length === 0) {
        error = data.ErrorCodes.SECTION_KEY_NOT_FOUND;
        return {"key": key, "SectionKey": SectionKey, "error": error};
    }
    
    return {"object": filtered, "error": undefined};
    
}


function addUserData(clientData, SectionKey, replacement, filteredSubSection) {
    const newSubSection = {};
    let error;

    for(const [key, value] of Object.entries(clientData)) {
        if (!data.sectionFields[SectionKey].includes(key)) {
            error = data.ErrorCodes.KEY_NOT_FOUND;
            return {"error": error, "SectionKey": SectionKey, "key": key};
        } 
        newSubSection[key] = value;
    }

    for (let sectionField of data.sectionFields[SectionKey]) {
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

function createSubSection(clientData, SectionKey, SectionObj) {
    const newSubSection = addUserData(clientData, SectionKey, SectionObj, false, undefined);
    if (newSubSection["error"] !== undefined) return newSubSection;
    SectionObj.push(newSubSection);
    return {"object": newSubSection, "error": undefined};
}



function deleteSubSection(filteredSubSection, SectionObj) {
    const indexOfFilteredSection = SectionObj.indexOf(filteredSubSection);
    SectionObj.splice(indexOfFilteredSection, 1);
}


function putSubSection(clientData, SectionKey, SectionObj, filteredSubSection) {
    const newSubSection = addUserData(clientData, SectionKey, true, filteredSubSection);
    if (newSubSection["error"] !== undefined) return;

    let replacementIndex = SectionObj.indexOf(filteredSubSection["object"][0]);
    SectionObj.splice(replacementIndex, 1, newSubSection);
    return {"object": newSubSection, "error": undefined};
}


module.exports = {getSection, filterSubSection, createSubSection, deleteSubSection, putSubSection};