const fs = require("fs-extra");
const csv = require ("csvtojson");
const { Parser } = require ("json2csv");
const dayjs = require ("dayjs");


// --- Step 1: Read raw CSV ---
const rawPath = "./raw_sales_data.csv";




async function cleanData() {
  console.log("Reading raw CSV...");
  let data = await csv().fromFile(rawPath);




  console.log("Preview of raw data:");
  console.table(data.slice(0, 3));




  // --- Step 2: Clean and standardize ---
  data = data.map((row) => {
    // Normalize keys
    return {
      customer_id:row.CustomerID?.trim(),
      product: row.Product?.trim().toLowerCase(),
      price: cleanPrice(row.Price),
      date: cleanDate(row.Date),
      city: row.City?.trim(),
    };
  });



  // --- Step 3: Export cleaned data ---
  await exportCleanData(data);



  // --- Step 4: Log changes ---
 await fs.writeFile(
"./cleaning_log.txt",
  `Cleaned ${data.length} records on ${new Date().toISOString()}\n`
);
}





function cleanPrice(price) {
  if (!price || price.toLowerCase() === "n/a") return null;
  return Number(price);
}




function cleanDate(date) {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
}




async function exportCleanData(data) {
  // Export JSON
  await fs.writeJson("./cleaned_sales_data.json", data, { spaces: 2 });




  // Export CSV
  const parser = new Parser();
  const csvData = parser.parse(data);
  await fs.writeFile("./cleaned_sales_data.csv", csvData);
}




cleanData();


