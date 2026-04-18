const API_URL = "https://script.google.com/macros/s/AKfycbyuYuY19wKnqA70Hb1d6B6gas8ZshrSlT12X1lahUDIc70pDtuv5EyqyMzCctAYunpcug/exec";

async function run() {
  const payload = {
    customerId: "TEST_IMG_AGAIN",
    name: "Automated Image Test",
    number: "5555555",
    creationDate: "2026-04-19",
    readyDate: "2026-04-20",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=" // tiny 1x1 image
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    console.log("RESPONSE:", text);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
