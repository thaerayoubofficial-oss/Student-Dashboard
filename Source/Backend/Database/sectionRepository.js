const databaseServices = require('./DatabaseServices.js');
const sectionTypes = require('../Data/SectionTypes.js').SectionType;
const services = require('../Services/Services.js');

async function createSection(sectionType, parentID, sectionProperties) {
    let fields = '';

    switch (sectionType) {
        case sectionTypes.CLASSES:
            fields = `(user_id, class_name, duration, from_time, to_time, frequency)`;
            break;

        default:
            fields = `(class_id, ${sectionType.slice(0, -1)}_name, description, due_date, completed)`;
            break;
    }

    const fieldsToInsert = fields
        .replace('(', '')
        .replace(')', '')
        .split(',')
        .map(field => field.trim());

        
        
    const valuesToInsert = fieldsToInsert.map(
        field => sectionProperties[field]
    );
        
    const valuesNotationSQL = fieldsToInsert
        .map(() => '?')
        .join(', ');


    const [result] = await databaseServices.query(
        `
        INSERT INTO ${sectionType}
        ${fields}
        VALUES (${valuesNotationSQL})
        `,
        valuesToInsert
    );

    return result.insertId;
}