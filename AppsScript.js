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

// RUN THIS FUNCTION ONCE IN THE EDITOR TO AUTHORIZE GOOGLE DRIVE & SHEETS
function setup() {
  SpreadsheetApp.openById(SHEET_ID);
  DriveApp.getFolderById(FOLDER_ID);
  console.log("Authorization successful!");
}

// Handle GET requests (Search by Number, Name or Customer Number)
function doGet(e) {
  try {
    let sheet = SpreadsheetApp.openById(SHEET_ID).getSheets().find(s => s.getName().trim().toLowerCase() === 'customers');
    if (!sheet) sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
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
    const readyIdx  = headers.findIndex(h => h.toLowerCase().includes('ready') || h.toLowerCase().includes('collection'));
    const entryIdx  = headers.findIndex(h => h.toLowerCase().includes('creation') || h.toLowerCase().includes('entry') || h.toLowerCase().includes('added'));
    const delivIdx  = headers.findIndex(h => h.toLowerCase().includes('delivered') || h.toLowerCase().includes('status'));

    // Determine today's date as a string for exact matching
    const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let isMatch = false;

      const normalizeDate = (cellVal) => {
        if (!cellVal) return '';
        if (cellVal instanceof Date) return Utilities.formatDate(cellVal, Session.getScriptTimeZone(), "yyyy-MM-dd");
        return String(cellVal).split('T')[0];
      };

      if (query === ':today:') {
        if (readyIdx > -1 && row[readyIdx]) {
          if (normalizeDate(row[readyIdx]) === todayStr) isMatch = true;
        }
      } else if (query === ':overdue:') {
        if (readyIdx > -1 && row[readyIdx]) {
          const rd = normalizeDate(row[readyIdx]);
          const notDelivered = delivIdx < 0 || String(row[delivIdx]).toLowerCase() !== 'delivered';
          if (rd < todayStr && notDelivered) isMatch = true;
        }
      } else if (query === ':upcoming:') {
        if (readyIdx > -1 && row[readyIdx]) {
          const rd = normalizeDate(row[readyIdx]);
          const future7 = Utilities.formatDate(new Date(new Date().getTime() + 7*24*60*60*1000), Session.getScriptTimeZone(), "yyyy-MM-dd");
          const notDelivered = delivIdx < 0 || String(row[delivIdx]).toLowerCase() !== 'delivered';
          if (rd >= todayStr && rd <= future7 && notDelivered) isMatch = true;
        }
      } else if (query === ':delivered:') {
        if (delivIdx > -1 && String(row[delivIdx]).toLowerCase() === 'delivered') isMatch = true;
      } else if (query.startsWith(':date:ready:')) {
        const targetDate = query.replace(':date:ready:', '').trim();
        if (readyIdx > -1 && normalizeDate(row[readyIdx]) === targetDate) isMatch = true;
      } else if (query.startsWith(':date:entry:')) {
        const targetDate = query.replace(':date:entry:', '').trim();
        if (entryIdx > -1 && normalizeDate(row[entryIdx]) === targetDate) isMatch = true;
      } else {
        const name    = nameIdx    > -1 ? String(row[nameIdx]).toLowerCase()    : '';
        const contact = contactIdx > -1 ? String(row[contactIdx]).toLowerCase() : '';
        const id      = idIdx      > -1 ? String(row[idIdx]).toLowerCase()      : '';
        if (name.includes(query) || contact.includes(query) || id.includes(query)) isMatch = true;
      }

      if (isMatch) {
        let record = {};
        for (let j = 0; j < headers.length; j++) {
          record[headers[j]] = row[j] instanceof Date
            ? Utilities.formatDate(row[j], Session.getScriptTimeZone(), "yyyy-MM-dd")
            : row[j];
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

// Handle POST requests (Create new customer OR mark as delivered)
function doPost(e) {
  try {
    let sheet = SpreadsheetApp.openById(SHEET_ID).getSheets().find(s => s.getName().trim().toLowerCase() === 'customers');
    if (!sheet) sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const parsedData = JSON.parse(e.postData.contents);

    // ── Update Status action (Ready / Delivered) ──
    if (parsedData.action === 'updateStatus') {
      const targetId   = String(parsedData.customerId).trim().toLowerCase();
      const newStatus  = parsedData.status || 'Ready'; // 'Ready' or 'Delivered'
      const data       = sheet.getDataRange().getValues();
      const headers    = data[0];

      // Find or create the "Status" column
      let statusColIdx = headers.findIndex(h => h.toLowerCase().trim() === 'status');
      if (statusColIdx < 0) {
        statusColIdx = headers.length;
        sheet.getRange(1, statusColIdx + 1).setValue('Status');
      }

      // Find the ID column
      const idColIdx = headers.findIndex(h => h.toLowerCase().includes('id') || h.toLowerCase().includes('customer no') || h.toLowerCase().includes('number'));
      if (idColIdx < 0) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'ID column not found' })).setMimeType(ContentService.MimeType.JSON);
      }

      // Update matching rows
      let updated = false;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idColIdx]).trim().toLowerCase() === targetId) {
          sheet.getRange(i + 1, statusColIdx + 1).setValue(newStatus);
          updated = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: updated,
        message: updated ? `Status set to ${newStatus}` : 'Customer not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }

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
      
      // Try to allow viewing in the app. If Google Workspace blocks public sharing, catch and ignore.
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (sharingError) {
        console.warn("Public sharing is blocked by Google Workspace. Image will remain private.", sharingError);
      }
      fileUrl = file.getDownloadUrl() || file.getUrl();
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
