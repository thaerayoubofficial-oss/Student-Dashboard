const databaseServices = require('./DatabaseServices.js');
const sectionTypes = require('../Data/SectionTypes.js').SectionType;

async function createSubSection(sectionType, sectionProperties) {
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

async function getSection(sectionType) {
    const [row, field] = await databaseServices.query(`
        SELECT * FROM ${sectionType}
    `);
    return {row, field};
}

async function getSubSectionById(sectionType, id) {

    const [result] = await databaseServices.query(
        `
        SELECT * FROM ${sectionType} WHERE id = ?
        `,
        [id]
    );

    return result;
}

async function getSubSectionByProperities(sectionType, properties) {
    const fieldMap = Object.entries(properties);
    for(const [key, value] of fieldMap) {
        if (value == null || value === '') { 
            delete properties[key];''
        }
    }
    const fields = Object.keys(properties);
    const where = fields.map(field => `\`${field}\` = ?`).join(' AND ');
    const values = fields.map(field => properties[field]);

    const [result] = await databaseServices.query(
        `SELECT * FROM \`${sectionType}\` WHERE ${where}`,
        values
    );
    return result;
}


async function editSubSection(sectionType, id, user_id, class_id, properities) {
    
    const where = subSectionSQLWHERE(sectionType, id, user_id, class_id);


    const properitiesKeys = Object.keys(properities);
    const properitiesValues = properitiesKeys.map(properityKey => properities[properityKey]);
        
    const set = properitiesKeys.map(properityKey => `\`${properityKey}\` = ?`).join(', ');

    
    const values = [...properitiesValues, ...where.Values];
    const [result] = await databaseServices.query(`
        UPDATE ${sectionType} SET ${set} WHERE ${where.SQLNotation}`,
        values
    )

    return result;
}


async function patchSubSection(sectionType, id, user_id, class_id, properity) {
    const where = subSectionSQLWHERE(sectionType, id, user_id, class_id);

    const properityKey = Object.keys(properity);

    const set = properityKey.map(properityKey => `\`${properityKey}\` = ?`).join(',');
    const properityValues = properityKey.map(properityKey => properity[properityKey]);

    const values = [...properityValues, ...where.Values];
    const [result] = await databaseServices.query(`
        UPDATE ${sectionType} SET ${set} WHERE ${where.SQLNotation}`,
        values
    )

    return result;

}

function deleteSubSection(sectionType, id, user_id, class_id) {
    const where = subSectionSQLWHERE(sectionType, id, user_id, class_id);

    return databaseServices.query(`
        DELETE FROM ${sectionType} WHERE ${where.SQLNotation}
    `, where.Values);

}

function subSectionSQLWHERE(sectionType, id, user_id, class_id) {
    if (sectionType == sectionTypes.CLASSES) {
        return {SQLNotation: '`id` = ? AND `user_id` = ?', Values: [id, user_id]};
    }

    // only classes has user_id, so ownership is checked through the parent class
    let WHERE = '`id` = ? AND `class_id` IN (SELECT `id` FROM `classes` WHERE `user_id` = ?)';
    let Values = [id, user_id];

    if (class_id != null && class_id != '') {
        WHERE += ' AND `class_id` = ?';
        Values.push(class_id);
    }

    return {SQLNotation: WHERE, Values: Values};
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