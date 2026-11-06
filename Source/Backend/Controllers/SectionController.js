const sectionServices = require("../Services/SectionServices");

//-------------- Helpers ----------------

function getSectionType(request) {
  const { sectionType } = request.params;
  sectionServices.sectionTypeValidator(sectionType);
  return sectionType;
}

async function getSubSectionIds(sectionType, properties) {
  const [subSection] = await sectionServices.getSubSectionByProperities(sectionType, properties);
  return { subSectionId: subSection?.id, class_id: subSection?.class_id };
}

//-------------- CRUDs ----------------

async function GETSection(request, response) {
  const sectionType = getSectionType(request);
  const user_id = request.user.id;

  const section = await sectionServices.getSection(sectionType, user_id);
  return response.status(200).json(section);
}

async function GETSubSection(request, response) {
  const sectionType = getSectionType(request);
  const properties = sectionServices.getSubSectionFilter(request);

  const subSection = await sectionServices.getSubSectionByProperities(sectionType, properties);
  return response.status(200).json(subSection);
}

async function POSTSubSection(request, response) {
  const sectionType = getSectionType(request);
  const properties = sectionServices.getSubSectionFilter(request);

  const newSubSection = await sectionServices.createSubSection(sectionType, properties);
  return response.status(201).json(newSubSection);
}

async function PUTSubSection(request, response) {
  const sectionType = getSectionType(request);
  const user_id = request.user.id;
  const properties = sectionServices.getSubSectionFilter(request);
  const { subSectionId, class_id } = await getSubSectionIds(sectionType, properties);

  const editedSubSection = await sectionServices.editSubSection(
    sectionType, subSectionId, user_id, class_id, properties
  );
  return response.status(200).json(editedSubSection);
}

async function PATCHSubSection(request, response) {
  const sectionType = getSectionType(request);
  const user_id = request.user.id;
  const properties = sectionServices.getSubSectionFilter(request);
  const { subSectionId, class_id } = await getSubSectionIds(sectionType, properties);

  const patchedSubSection = await sectionServices.patchSubSection(
    sectionType, subSectionId, user_id, class_id, properties
  );
  return response.status(200).json(patchedSubSection);
}

async function DELETESubSection(request, response) {
  const sectionType = getSectionType(request);
  const user_id = request.user.id;
  const properties = sectionServices.getSubSectionFilter(request);
  const { subSectionId, class_id } = await getSubSectionIds(sectionType, properties);

  await sectionServices.deleteSubSection(sectionType, subSectionId, user_id, class_id);
  return response.status(200).send("The Deletion was succesful");
}

module.exports = {
  GETSection,
  GETSubSection,
  POSTSubSection,
  PUTSubSection,
  PATCHSubSection,
  DELETESubSection,
};