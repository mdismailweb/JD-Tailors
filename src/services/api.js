// API Service to communicate with Google Apps Script Backend

// This URL needs to be updated with the Web App URL generated from Google Apps Script.
export const API_URL = "https://script.google.com/macros/s/AKfycbwUSAwFYEUtGy66XAZ9acHPLEgBISgSn7zLpR2k9sCq1ZJuVlL5FAI3CPyBswTRYvDU/exec";

export async function addCustomer(customerData) {
  if (API_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Mock: Customer added!" }), 1500));
  }
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(customerData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function searchCustomer(query) {
  if (API_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: [{ "CustomerName": "John Doe", "ContactNumber": "1234567890", "Customer No": "JD001", "CreationDate": "2026-04-18", "ReadyDate": "2026-04-25", "ImageUrl": "" }]
    }), 1000));
  }
  try {
    const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}&t=${Date.now()}`, { method: "GET" });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update a customer's Status ('Ready' or 'Delivered') by their Customer ID.
 */
export async function updateStatus(customerId, status) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "updateStatus", customerId, status })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
