import Ajv from "ajv";
import fs from "fs-extra";

const ajv = new Ajv();
const schema = await fs.readJson("./cleaned_sales_schema.s=schema");
const data = await fs.readJson("./cleaned_sales_data.json ");

const validate = ajv.compile(schema);
const valid = validate(data);

if (valid) {
  console.log("JSON matches schema!");
} else {
  console.error("Schema validation errors:");
  console.error(validate.errors);
}
