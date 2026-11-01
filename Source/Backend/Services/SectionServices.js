const sectionRepository = require('../Database/sectionRepository');
const sectionTypes = require('../Data/SectionTypes.js').SectionType;
const services = require('../Services/Services.js');
const SQL_ERROR_CODES = require('../Data/Error_Codes.js').SQL_ERROR_CODES;
const databaseServices = require('../Database/DatabaseServices.js');



async function createSection(sectionType, sectionProperities) {
    const [rows, fields] = await databaseServices.query(`SELECT * FROM ${sectionType}`);
    const keys = fields.map(field => field.name);    
    
    sectionTypeValidator(sectionType);


    //TODO: Validate the sectionProperities before inserting into the database
}


function sectionTypeValidator(sectionType) {
    if (!sectionType in sectionTypes) {
        services.throwError(`${sectionType} Isn't found in the database`, SQL_ERROR_CODES.SECTION_TYPE_NOT_FOUND_IN_DATABASE);
    }
}
