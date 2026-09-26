
let Classes = [
    {Class: "Calculus I", Time: "3:00 PM", Duration: "2 hours"},
    {Class: "Physics II", Time: "5:00 PM", Duration: "3 hours"}
];

let Homework = [
    {Class: "Calculus I", Due : "Tuesday"},
    {Class: "Physics II", Due : "Wednesday"}
];

let Sections = {
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
    SECTION_NOT_FOUND: 'SECTION_NOT_FOUND',
    KEY_NOT_FOUND: 'SECTION_NOT_FOUND',
    SECTION_KEY_NOT_FOUND: 'SECTION_KEY_NOT_FOUND',
    PARAMETERS_NOT_FOUND: 'PARAMETERS_NOT_FOUND'
};


module.exports = {Classes, Homework, Sections, sectionFields, ErrorCodes};