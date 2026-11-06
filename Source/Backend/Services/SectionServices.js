const sectionRepository = require('../Database/sectionRepository');
const sectionTypes = require('../Data/SectionTypes.js').SectionType;
const services = require('../Services/Services.js');
const ERROR_CODES = require('../Data/Error_Codes.js');

const SQL_ERROR_CODES = ERROR_CODES.module.SQL_ERROR_CODES;
const CREDENTIALS_ERROR_CODES = ERROR_CODES.module.CREDENTIALS_ERROR_CODES;

async function getSection(sectionType, user_id) {
    sectionTypeValidator(sectionType);

    if (user_id == null || user_id === '') services.throwError(`The user_id is undefined`, CREDENTIALS_ERROR_CODES.INVALID_ID);
    if (typeof user_id !== 'number') services.throwError(`The user_id must be a number`, CREDENTIALS_ERROR_CODES.INVALID_ID);

    return await sectionRepository.getSection(sectionType, user_id);
}

async function getSubSectionById(sectionType, id, user_id, class_id) {
    sectionTypeValidator(sectionType);
    idsValidator(id, user_id, class_id);
    const subSection = await sectionRepository.getSubSectionById(sectionType, id, user_id, class_id);
    return subSection[0];
}

async function getSubSectionByProperities(sectionType, properities) {
    await properityValidator(sectionType, properities);
    return await sectionRepository.getSubSectionByProperities(sectionType, properities);
}

async function createSubSection(sectionType, sectionProperities) {
    await properityValidator(sectionType, sectionProperities);
    const subSectionId = await sectionRepository.createSubSection(sectionType, sectionProperities);
    const subSection = await sectionRepository.getSubSectionByProperities(sectionType, { id: subSectionId });
    return subSection[0];
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
    sectionTypeValidator(sectionType);
    idsValidator(id, user_id, class_id);
    await sectionRepository.deleteSubSection(sectionType, id, user_id, class_id);
}

async function validateForEditPatch(sectionType, id, user_id, class_id, properities) {
    idsValidator(id, user_id, class_id);
    await properityValidator(sectionType, properities);
}

function idsValidator(id, user_id, class_id) {
    const ids = { id, user_id, class_id };

    for (const id_name of Object.keys(ids)) idValidator(ids[id_name], id_name);
}

function idValidator(id, id_name) {
    if (id_name == null || id_name === '') console.warn('CAREFUL! logs are going to be weird since the Id_name is undfined or empty');

    // class_id is optional (CLASSES doesn't have one)
    if (id == null && id_name === 'class_id') return;

    if (id == null) services.throwError(`The ${id_name} is undefined`, CREDENTIALS_ERROR_CODES.INVALID_ID);
    if (typeof id !== 'number') services.throwError(`The ${id_name} must be a number`, CREDENTIALS_ERROR_CODES.INVALID_ID);
}

function sectionTypeValidator(sectionType) {
    if (sectionType == null || sectionType === '' || !Object.values(sectionTypes).includes(sectionType)) {
        services.throwError(`${sectionType} Isn't found in the database`, SQL_ERROR_CODES.SECTION_TYPE_NOT_FOUND_IN_DATABASE);
    }
}

async function properityValidator(sectionType, properities) {
    sectionTypeValidator(sectionType);

    const allowedKeys = await sectionRepository.getSectionFields(sectionType);
    const properityKeys = Object.keys(properities);

    for (const key of properityKeys) {
        if (!allowedKeys.includes(key) && key !== '') {
            services.throwError(`${key} isn't found in ${sectionType}`, SQL_ERROR_CODES.KEY_NOT_FOUND_IN_DATABASE);
        }
    }
}


//--------------------------- Functions for the controller ----------------------------

async function getSubSectionFilter(request) {
    //website/sectionType?params=values
    const sectionType = request.params.sectionType;
    const query = {...request.query};
    await properityValidator(sectionType, query);
    return query;
}



module.exports = {
    createSubSection,
    getSection,
    getSubSectionById,
    patchSubSection,
    editSubSection,
    deleteSubSection,
    getSubSectionByProperities,
    sectionTypeValidator
}