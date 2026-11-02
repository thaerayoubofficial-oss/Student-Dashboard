const sectionRepository = require('../Database/sectionRepository');
const sectionTypes = require('../Data/SectionTypes.js').SectionType;
const services = require('../Services/Services.js');
const ERROR_CODES = require('../Data/Error_Codes.js');
const databaseServices = require('../Database/DatabaseServices.js');

async function getSection(sectionType) {
    sectionTypeValidator(sectionType);
    return await sectionRepository.getSection(sectionType);
}

async function getSubSectionById(sectionType, id, user_id, class_id) {
    sectionTypeValidator(sectionType);
    idValidator(id, 'id');
    const subSection = await sectionRepository.getSubSectionById(sectionType, id);
    return subSection[0];
}

async function getSubSectionByProperities(sectionType, properities) {
    await properityValidator(sectionType, properities);
    return await sectionRepository.getSubSectionByProperities(sectionType, properities);
}

async function createSubSection(sectionType, sectionProperities) {
    await properityValidator(sectionType, sectionProperities);
    const subSectionId = await sectionRepository.createSubSection(sectionType, sectionProperities);
    const subSection = await getSubSectionById(sectionType, subSectionId);
    return subSection;
}

async function editSubSection(sectionType, id, user_id, class_id, properities) {
    await validateForEditPatch(sectionType, id, user_id, class_id, properities);
    return await sectionRepository.editSubSection(sectionType, id, user_id, class_id, properities);
}

async function patchSubSection(sectionType, id, user_id, class_id, properity) {
    await validateForEditPatch(sectionType, id, user_id, class_id, properity);
    return await sectionRepository.patchSubSection(sectionType, id, user_id, class_id, properity);
}

async function deleteSubSection(sectionType, id, user_id, class_id) {
    for(const id_element of ids) idValidator(id_element, ['id', 'user_id', 'class_id'][ids.indexOf(id_element)]);
    sectionTypeValidator(sectionType);
    await sectionRepository.deleteSubSection(sectionType, id, user_id, class_id);
}

async function validateForEditPatch(sectionType, id, user_id, class_id, properities) { 
    const ids = [id, user_id, class_id];
    for(const id_element of ids) idValidator(id_element, ['id', 'user_id', 'class_id'][ids.indexOf(id_element)]);
    await properityValidator(sectionType, properities);
}

function idValidator(id, id_name) {
    if (id == null && id_name !== 'class_id') services.throwError(`The ${id_name} is undefined`, ERROR_CODES.module.CREDENTIALS_ERROR_CODES.INVALID_ID);
    if (typeof id !== 'number') services.throwError(`The ${id_name} must be a number`, ERROR_CODES.module.CREDENTIALS_ERROR_CODES.INVALID_ID); 
    if(id == null && id_name === 'class_id') console.warn('CAREFUL! if your sectionType === CLASSES it is gonna crash');
    if(id_name == null || id_name === '') console.warn('CAREFUL! logs are going to be weird since the Id_name is undfined or empty');
}

function sectionTypeValidator(sectionType) {
    if (!sectionType in sectionTypes || sectionType == null || sectionType === '') {
        services.throwError(`${sectionType} Isn't found in the database`, SQL_ERROR_CODES.SECTION_TYPE_NOT_FOUND_IN_DATABASE);
    }
}
 
async function properityValidator(sectionType, properities) { 
    
    sectionTypeValidator(sectionType);

    const [rows, fields] = await getSection(sectionType);
    const allowedKeys = fields.map(field => field.name);

    const sectionProperityKeys = Object.keys(sectionProperities);

    for (const key of sectionProperityKeys) { 
        if(!allowedKeys.includes(key) && key !== '') {
            services.throwError(`${key} isn't found in ${sectionType}`, SQL_ERROR_CODES.KEY_NOT_FOUND_IN_DATABASE);
        }
    }

}

exports.module = {
    createSubSection,
    getSection,
    getSubSectionById,
    patchSubSection,
    editSubSection,
    deleteSubSection,
    getSubSectionByProperities
}