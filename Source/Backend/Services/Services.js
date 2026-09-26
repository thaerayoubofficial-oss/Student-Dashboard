const data = require('../Data/Classes_Data');

function throwError(Error, Message, Code) {
    return {
        Error: Error,
        Message: Message,
        Code: Code
    };
} 

function getSection(SectionKey) {
    const Section = data.Sections[SectionKey];
    if (Section === undefined) return throwError(true, `There is no ${SectionKey} in the dashboard`, data.ErrorCodes.SECTION_NOT_FOUND);
   return Section;
}



function filterSubSection(request, Section, SectionKey) {

    //FIXME: Fixed bugs, multiple filters is the only implementation left to do.

    let query = Object.assign({}, request.query);
   
    if (Object.keys(query).length === 0) return throwError(false, `There were no parameters`, data.ErrorCodes.PARAMETERS_NOT_FOUND);
   

    let params = Object.entries(query);
    
    let [key, value] = params[0];

    if (!Object.keys(Section[0]).includes(key)) {
        return throwError(true, `There is no ${key} in ${SectionKey}`, data.ErrorCodes.KEY_NOT_FOUND);
    }

    const filtered = Section.filter(fieldElement => fieldElement[key].replace(/\s+/g, '') === value.replace(/\s+/g, ''));
    return filtered.length > 0 ? filtered : throwError(true, `The ${SectionKey} doesn't exist`, data.ErrorCodes.SECTION_KEY_NOT_FOUND);

    
}



function createSubSection(clientData, SectionKey, Section) {
    const newSubSection = {};

    for(const [key, value] of Object.entries(clientData)) {
        if (!data.sectionFields[SectionKey].includes(key)) return throwError(true, `${key} is a field that isn't found in ${SectionKey}`, data.ErrorCodes.KEY_NOT_FOUND); 
        newSubSection[key] = value;
    }

    for (let sectionField of data.sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            newSubSection[sectionField] = "Not Specified";
        }        
    }

    Section.push(newSubSection);
    return newSubSection;
}



function deleteSubSection(filteredSubSection, Section) {
    
   
    const indexOfFilteredSection = Section.indexOf(filteredSubSection);
    
    Section.splice(indexOfFilteredSection, 1);
}


function putSubSection(clientData, SectionKey, Section, filteredSubSection) {
    const newSubSection = {};


    for(const [key, value] of Object.entries(clientData)) {
        if (!data.sectionFields[SectionKey].includes(key)) return throwError(true, `${key} is a field that isn't found in ${SectionKey}`, data.ErrorCodes.KEY_NOT_FOUND); 
        newSubSection[key] = value;
    }

    for (let sectionField of data.sectionFields[SectionKey]) {
        if(newSubSection[sectionField] === undefined) {
            newSubSection[sectionField] = filteredSubSection[sectionField];
        }        
    }

    Section.splice(Section.indexOf(filteredSubSection), 1, newSubSection);
    return newSubSection;
}


module.exports = {getSection, filterSubSection, createSubSection, deleteSubSection, putSubSection};