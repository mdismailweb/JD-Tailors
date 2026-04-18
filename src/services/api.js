// API Service to communicate with Google Apps Script Backend

// This URL needs to be updated with the Web App URL generated from Google Apps Script.
export const API_URL = "https://script.google.com/macros/s/AKfycbzsgwv8MzqOtuMltxPRSGfENsxmv9TbV3h6sx0Y570UXH-s3fOenHB--ZwN0ciZ2Ju3/exec";

/**
 * Perform a generic fetch to the Apps Script with no-cors / cors mapping.
 * Apps Script deployment responses are generally handled correctly if we treat them correctly.
 */
export async function addCustomer(customerData) {
  if (API_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    console.warn("API_URL is not set. Simulating a successful request for development.");
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Mock: Customer added!" }), 1500));
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(customerData)
    });

    // Using simple text or json depending on Apps Script output
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding customer:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Perform a search request to the Apps script
 */
export async function searchCustomer(query) {
  if (API_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    console.warn("API_URL is not set. Simulating search results.");
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: [
        {
          "CustomerName": "John Doe",
          "ContactNumber": "1234567890",
          "Customer No": "JD001",
          "CreationDate": "2026-04-18",
          "ReadyDate": "2026-04-25",
          "ImageUrl": ""
        }
      ]
    }), 1000));
  }

  try {
    // Apps script usually needs GET parameters
    const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`, {
      method: "GET"
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error searching customer:", error);
    return { success: false, error: error.message };
  }
}
