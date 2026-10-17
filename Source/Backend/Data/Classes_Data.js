
let Classes = [
    {Class: "Calculus I", Time: "3:00 PM", Duration: "2 hours"},
    {Class: "Physics II", Time: "5:00 PM", Duration: "3 hours"}
];

let Homework = [
    {Class: "Calculus I", Due : "Tuesday"},
    {Class: "Physics II", Due : "Wednesday"}
];

let sections = {
    "Classes" : Classes,
    "Homework" : Homework,
    // "Assignment",
    // "Projects",
    // "Exams"
};

let sectionFields = {
    Classes: ['Class', 'Time', 'Duration'],
    Homework: ['Class', 'Due']
}


//TODO: Use Javscript/Node.js/Express Error handler if it exists
let ErrorCodes = {
    SECTION_NOT_FOUND:          {code: 'SECTION_NOT_FOUND',             status: 404},
    KEY_NOT_FOUND:              {code: 'KEY_NOT_FOUND',                 status: 400},
    SECTION_KEY_NOT_FOUND:      {code: 'SECTION_KEY_NOT_FOUND',         status: 400},
    PARAMETERS_NOT_FOUND:       {code: 'PARAMETERS_NOT_FOUND',          status: 404},
    SUBSECTION_NOT_FOUND:       {code: 'SUBSECTION_NOT_FOUND',          status: 404},
    CLIENT_DATA_NOT_FOUND:      {code: 'CLIENT_DATA_NOT_FOUND',         status: 404},
    CLIENT_DATA_ARE_INVALID:    {code: 'CLIENT_DATA_ARE_INVALID',       status: 400},
    FILTER_ISNT_FOUND:          {code: 'FILTER_ISNT_FOUND',             status: 404},

    USER_NOT_FOUND:             {code: 'USER_NOT_FOUND',                status: 404},
    SUBSECTION_ALREADY_EXISTS:  {code: 'SUBSECTION_ALREADY_EXISTS',     status: 400},
    SUBSECTION_CANT_BE_UPDATED: {code: 'SUBSECTION_CANT_BE_UPDATED',    status: 400},
    SUBSECTION_CANT_BE_DELETED: {code: 'SUBSECTION_CANT_BE_DELETED',    status: 400},
    REQUEST_DATA_N0T_FOUND:     {code: 'REQUEST_DATA_NOT_FOUND',        status: 400},
    SUBSECTION_CANT_BE_CREATED: {code: 'SUBSECTION_CANT_BE_CREATED',    status: 400}
};


module.exports = {Classes, Homework, sections, sectionFields, ErrorCodes};