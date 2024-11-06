const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

// Function to read CSV file
function readCSV(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
            return Papa.parse(fileContent, {
                header: false,
                skipEmptyLines: true
            }).data;
        }
        return null;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

function addGrossUnitsColumn(existingData, baseData, salesData) {
    try {
        const dateRow = salesData.find(row => row[0] === "Date");
        if (!dateRow) {
            console.error("Date row not found in sales data");
            return existingData || baseData;
        }
        const date = dateRow[1];
        console.log("Found date:", date);

        const topAsinsIndex = salesData.findIndex(row => 
            row[0] === "Top ASINs" && 
            row[1] === "GROSS_UNITS"
        );
        if (topAsinsIndex === -1) {
            console.error("Top ASINs GROSS_UNITS section not found");
            return existingData || baseData;
        }

        const asinToUnitsMap = new Map();
        for (let i = topAsinsIndex + 1; i < salesData.length; i++) {
            const row = salesData[i];
            if (!row[0]) break;
            asinToUnitsMap.set(row[0], parseInt(row[1]) || 0);
        }

        let updatedData;
        if (existingData) {
            // Check if the date already exists in existingData
            const dateExists = existingData.some(row => row[0] === date);
            if (dateExists) {
                console.log(`Data for date ${date} already exists. Skipping...`);
                return existingData; // Return existing data without modification
            }

            updatedData = existingData.map((row, index) => {
                if (index === 0) {
                    return [...row, date];
                }
                const asin = row[0];
                const units = asinToUnitsMap.get(asin) || 0;
                return [...row, units];
            });
        } else {
            updatedData = baseData.map((row, index) => {
                if (index === 0) {
                    return [...row, date];
                }
                const asin = row[0];
                const units = asinToUnitsMap.get(asin) || 0;
                return [...row, units];
            });
        }

        console.log("Updated data rows:", updatedData.length);
        return updatedData;
    } catch (error) {
        console.error("Error in addGrossUnitsColumn:", error);
        throw error;
    }
}

// Function to write CSV file
function writeCSV(data, filePath) {
    try {
        const csv = Papa.unparse(data);
        fs.writeFileSync(filePath, csv, { encoding: 'utf-8' });
        console.log(`File successfully written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        throw error;
    }
}

// Main execution
async function main() {
    try {
        console.log("Starting process...");

        // Specify the directory containing CSV files
        const inputDirectory = './input_files'; // Change this to your input directory

        // Read all CSV files in the directory
        const files = fs.readdirSync(inputDirectory).filter(file => path.extname(file) === '.csv');

        // Initialize baseData and existingData
        let baseData = null;
        let existingData = null;

        // Read existing updated output if it exists
        console.log("Checking for existing updated output...");
        existingData = readCSV('./updated_output.csv');
        if (existingData) {
            console.log(`Existing data rows: ${existingData.length}`);
        } else {
            console.log("No existing updated output found. Will create new file.");
        }

        // Use the first file as baseData if it's not already set
        if (!baseData) {
            console.log("Reading base data...");
            baseData = readCSV('./base.csv');
            console.log(`Base data rows: ${baseData.length}`);
        }

        for (const file of files) {
            const filePath = path.join(inputDirectory, file);
 console.log(`Reading sales data from ${filePath}...`);
            const salesData = readCSV(filePath);
            console.log(`Sales data rows: ${salesData.length}`);

            // Process data
            console.log("Processing data...");
            existingData = addGrossUnitsColumn(existingData, baseData, salesData);
            console.log(`Updated data rows after processing ${file}: ${existingData.length}`);
        }

        // Write output
        console.log("Writing output file...");
        writeCSV(existingData, './updated_output.csv');
        
        console.log('Processing completed successfully!');
        
        // Debug: Print first few rows of output
        console.log("\nFirst few rows of output:");
        existingData.slice(0, 3).forEach(row => console.log(row));
        
    } catch (error) {
        console.error('Error in main process:', error);
    }
}

// Run the program
main();