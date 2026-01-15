import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

const schema = defineSchema({
  ...tables,
  // Spread the generated schema and add a custom index
  user: tables.user.searchIndex("byName",{
    searchField:"name",  
  }).searchIndex("byEmail",{
    searchField:"email",  
  }).searchIndex("byPhoneNumber",{
    searchField:"phoneNumber",  
  })
});

export default schema;