// ============================================
// Google Apps Script Backend for JD Tailors
// ============================================
//
// INSTRUCTIONS:
// 1. Go to script.google.com and create a new project.
// 2. Paste this entire code into Code.gs.
// 3. Fill in the SHEET_ID and FOLDER_ID variables below.
// 4. Click "Deploy" -> "New deployment"
// 5. Select type "Web app"
// 6. Set "Execute as" to "Me"
// 7. Set "Who has access" to "Anyone"
// 8. Deploy and authorize permissions.
// 9. Copy the Web App URL and provide it to the React application.

const SHEET_ID = '144jVRjgBMjr2hHx27h3uhRbHB6rZDhFws01WI6-jLBg'; 
const FOLDER_ID = '11HUkBatWCNpM38jO_lDhsEAPKDybMT-A';

// Handle GET requests (Search by Number, Name or Customer Number)
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // e.parameter.query shouldn't be null if it's a search
    const query = e.parameter.query ? e.parameter.query.toLowerCase() : '';
    
    if (!query) {
       return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: "No query provided"
       })).setMimeType(ContentService.MimeType.JSON);
    }
    
    let results = [];
    
    // We assume the sheet has headers like: 
    // [CustomerName, ContactNumber, CreationDate, ReadyDate, ImageUrl]
    // You can adjust these headers as needed.
    
    // Let's dynamically find header indices
    const nameIdx = headers.findIndex(h => h.toLowerCase().includes('name'));
    const contactIdx = headers.findIndex(h => h.toLowerCase().includes('contact') || h.toLowerCase().includes('number'));
    const idIdx = headers.findIndex(h => h.toLowerCase().includes('id') || h.toLowerCase().includes('customer no'));
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      const name = nameIdx > -1 ? String(row[nameIdx]).toLowerCase() : "";
      const contact = contactIdx > -1 ? String(row[contactIdx]).toLowerCase() : "";
      const id = idIdx > -1 ? String(row[idIdx]).toLowerCase() : "";
      
      if (name.includes(query) || contact.includes(query) || id.includes(query)) {
        // Build JSON object based on headers
        let record = {};
        for (let j = 0; j < headers.length; j++) {
           record[headers[j]] = row[j];
        }
        results.push(record);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: results
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests (Create new customer)
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const parsedData = JSON.parse(e.postData.contents);
    
    const customerId = parsedData.customerId;
    const customerName = parsedData.name;
    const contactNumber = parsedData.number;
    const creationDate = parsedData.creationDate;
    const readyDate = parsedData.readyDate;
    const base64Image = parsedData.image; 

    let fileUrl = "";
    
    if (base64Image) {
      // Decode the base64 image
      // Format usually comes in as "data:image/jpeg;base64,....."
      const dataStr = base64Image.split(",")[1]; 
      const mimeType = base64Image.split(";")[0].split(":")[1];
      
      const fileName = `${customerId}_${customerName}_${creationDate}_capture.jpg`.replace(/[^a-z0-9_.-]/gi, '_');
      const decodedBytes = Utilities.base64Decode(dataStr);
      const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
      
      // Upload to Drive folder
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const file = folder.createFile(blob);
      
      // Allow anybody with link to view image so it can be previewed in app
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getDownloadUrl(); // alternatively use file.getUrl();
    }
    
    // Append to sheet (Make sure your sheet headers match this order)
    // 1: Customer Number, 2: Customer Name, 3: Contact Number, 4: Creation Date, 5: Ready Date, 6: Image Url
    sheet.appendRow([
      customerId,
      customerName,
      contactNumber,
      creationDate,
      readyDate,
      fileUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Customer created successfully!",
      imageUrl: fileUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// (Removed unused doOptions to avoid confusion - Google handles CORS inherently)
