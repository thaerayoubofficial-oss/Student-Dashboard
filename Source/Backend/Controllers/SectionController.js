const services = require("../Services/Services");
const sectionServices = require("../Services/SectionServices");

//-------------- CRUDs ----------------

async function GETSection(request, response) {
  // await sectionServices();
  const sectionType = request.params.sectionType;
  sectionServices.sectionTypeValidator(sectionType);

  
  
}
