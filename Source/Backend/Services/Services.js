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
  
  // UHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  let filteredResults = [...section];

  for (const [key, value] of Object.entries(query)) {

    if (!Object.keys(section[0]).includes(key)) {
      throwError(
        `${key} isn't found in ${sectionKey}`,
        data.ErrorCodes.KEY_NOT_FOUND,
      );
    }

    filteredResults = filteredResults.filter((fieldElement) => {
      const fieldVal = fieldElement[key];

      if (typeof fieldVal === "string" && typeof value === "string") {
        return (
          fieldVal.replace(/\s+/g, "").toLowerCase() ===
          value.replace(/\s+/g, "").toLowerCase()
        );
      } else {
        return fieldVal === value;
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

module.exports = {
  throwError,
  getSection,
  filterSubSection,
  createSubSection,
  deleteSubSection,
  putSubSection,
  patchSubSection
};
