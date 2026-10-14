const data = require("../Data/Classes_Data");

function throwError(message, errorInfo) {
  const error = new Error(message);
  error.code = errorInfo.code;
  error.status = errorInfo.status;
  throw error;
}


function getSection(sectionKey) {
  const section = data.sections[sectionKey];

  if (section === undefined) {
    throwError(`${sectionKey} isn't found`, data.ErrorCodes.SECTION_NOT_FOUND);
  }

  return section;
}


function filterSubSection(request) {
  const sectionKey = request.params.Section;
  const section = getSection(sectionKey);

  let query = Object.assign({}, request.query);

  if (Object.keys(query).length === 0) {
    throwError(`This can't be filtered`, data.ErrorCodes.PARAMETERS_NOT_FOUND);
  }

  if (!section || section.length === 0) {
    throwError(`Section is empty`, data.ErrorCodes.SUBSECTION_NOT_FOUND);
  }

  // Start with the full section array
  let filteredResults = [...section];

  // Loop through each key-value pair in the query
  for (const [key, value] of Object.entries(query)) {

    // Check if the key exists in the data structure
    if (!Object.keys(section[0]).includes(key)) {
      throwError(
        `${key} isn't found in ${sectionKey}`,
        data.ErrorCodes.KEY_NOT_FOUND,
      );
    }

    // Progressively filter the results array
    filteredResults = filteredResults.filter((fieldElement) => {
      const fieldVal = fieldElement[key];

      if (typeof fieldVal === "string" && typeof value === "string") {
        return (
          fieldVal.replace(/\s+/g, "").toLowerCase() ===
          value.replace(/\s+/g, "").toLowerCase()
        );
      } else {
        return fieldVal == value;
      }
    });
  }

  // Check if anything matched all combined filters
  if (filteredResults.length === 0) {
    throwError(
      `No records found matching the provided filters`,
      data.ErrorCodes.SUBSECTION_NOT_FOUND,
    );
  }

  // Return the filtered array (or filteredResults[0] if you only expect one unique match)
  return filteredResults;
}

function addRequestData(requestData, sectionKey) {

  const newSubSection = {};

  if (requestData === null) {
    throwError(
      `The Request's Data are undefined`,
      data.ErrorCodes.REQUEST_DATA_N0T_FOUND,
    );
  }

  for (const [key, value] of Object.entries(requestData)) {
    if (!data.sectionFields[sectionKey].includes(key)) {
      throwError(
        `${key} isn't found in ${sectionKey}`,
        data.ErrorCodes.KEY_NOT_FOUND,
      );
    }
    newSubSection[key] = value;
  }

  return newSubSection;
}

function manageRequestData(
  requestData,
  sectionKey,
  replacement,
  filteredSubSection,
) {
  const newSubSection = addRequestData(requestData, sectionKey);

  if (Object.keys(newSubSection).length === 0) {
    throwError(
      `The Sub-Section couldn't because it is empty`,
      data.ErrorCodes.SUBSECTION_CANT_BE_CREATED,
    );
  }

  for (let sectionField of data.sectionFields[sectionKey]) {
    if (newSubSection[sectionField] === undefined) {
      if (
        replacement === true &&
        filteredSubSection?.[sectionField] !== undefined
      ) {
        newSubSection[sectionField] = filteredSubSection[sectionField];
      } else {
        newSubSection[sectionField] = "Not Specified";
      }
    }
  }

  return newSubSection;
}

function createSubSection(requestData, sectionKey) {
  const section = getSection(sectionKey);
  const newSubSection = addRequestData(requestData, sectionKey);

  section.push(newSubSection);
  return newSubSection;
}

function deleteSubSection(filteredSubSection, sectionKey) {
  const section = getSection(sectionKey);
  const indexOfFilteredSection = section.indexOf(filteredSubSection);

  if (indexOfFilteredSection === -1) {
    throwError(
      `${sectionKey} isn't found`,
      data.ErrorCodes.SUBSECTION_NOT_FOUND,
    );
  }
  section.splice(indexOfFilteredSection, 1);
}

function putSubSection(requestData, sectionKey, filteredSubSection) {
  const section = getSection(sectionKey);
  const newSubSection = manageRequestData(requestData, sectionKey, false);
  let replacementIndex = section.indexOf(filteredSubSection);

  if (replacementIndex === -1) {
    throwError(`${sectionKey} isn't found`, data.ErrorCodes.SECTION_NOT_FOUND);
  }
  section.splice(replacementIndex, 1, newSubSection);

  return newSubSection;
}

function patchSubSection(requestData, sectionKey, filteredSubSection) {
  const section = getSection(sectionKey);
  const newSubSection = manageRequestData(
    requestData,
    sectionKey,
    true,
    filteredSubSection,
  );
  let replacementIndex = section.indexOf(filteredSubSection);

  if (replacementIndex === -1) {
    throwError(`${sectionKey} isn't found`, data.ErrorCodes.SECTION_NOT_FOUND);
  }

  section.splice(replacementIndex, 1, newSubSection);
  return newSubSection;
}


function clientDataHandler(request) {
  const clientData = request.body;

  if (clientData === null) {
    throwError(
      `The Client's Data are undefined`,
      data.ErrorCodes.CLIENT_DATA_NOT_FOUND,
    );
  }

  for (const [key, value] of Object.entries(clientData)) {
    if (value === null || value === '') {
      throwError(
        `The Client's Data are Incomplete, The ${key} is missing`,
        data.ErrorCodes.CLIENT_DATA_NOT_FOUND,
      );
    }


    // ----------- Email validation ------------

    if (key === 'email') {
      if (!value.includes('@')) {
        throwError(
          `The Client's Data are Invalid, The ${key} is not a valid email`,
          data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
        );
      }

      emailDomain = value.split('@')[1];
      if (!emailDomain.includes('.')) {
        throwError(
          `The Client's Data are Invalid, The ${key} is not a valid email`,
          data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
        );
      }


    }



    // ----------- Password validation ------------

    if (key === 'password') {
      let hasCapital = /[A-Z]/.test(value);
      let hasLower = /[a-z]/.test(value);
      let hasNumber = /[0-9]/.test(value);
      let hasMinimumLength = value.length >= 8;

      if (!hasCapital || !hasLower || !hasNumber || !hasMinimumLength) {
        throwError(
          `The Client's Data are Invalid, The ${key} is not a valid password`,
          data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
        );
      }
    }


    if (key === 'confirmPassword') {
      if (value !== clientData.password) {
        throwError(
          `The Client's Data are Invalid, The ${key} does not match the password`,
          data.ErrorCodes.CLIENT_DATA_ARE_INVALID,
        );
      }
    }
  }

  return clientData;
}


module.exports = {
  getSection,
  filterSubSection,
  createSubSection,
  deleteSubSection,
  putSubSection,
  patchSubSection,
  clientDataHandler
};
