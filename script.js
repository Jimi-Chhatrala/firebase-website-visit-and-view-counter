// import { firebaseConfig } from "./firebaseConfig.js";

const firebaseConfig = {
  apiKey: "AIzaSyBj0HtA-vyVz_g4LQ7Njuvm-fsr1zFFA2Y",
  authDomain: "website-visitor-counter.firebaseapp.com",
  projectId: "website-visitor-counter",
  storageBucket: "website-visitor-counter.appspot.com",
  messagingSenderId: "1040813132571",
  appId: "1:1040813132571:web:4bb0e95a6635d95e9b21be",
};

console.log("Initializing Firebase...");
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
console.log("Firebase Initialized:", db);

// Function to update visitor and pageview counts
async function updateCounter(type) {
  const counterRef = db.collection("counters").doc("visitor_count");
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(counterRef);
    if (!doc.exists) {
      transaction.set(counterRef, { visits: 0, pageviews: 0 });
    }
    const data = doc.data();
    if (type === "type=visit-pageview") {
      transaction.update(counterRef, {
        visits: data.visits + 1,
        pageviews: data.pageviews + 1,
      });
    } else if (type === "type=pageview") {
      transaction.update(counterRef, { pageviews: data.pageviews + 1 });
    }
  });

  const updatedDoc = await counterRef.get();
  const counts = updatedDoc.data();
  document.getElementById(
    "visitor-count"
  ).textContent = `Visits: ${counts.visits}, Pageviews: ${counts.pageviews}`;
}

// Check sessionStorage to determine if it's a new visit or just a pageview
function checkAndUpdateCounter() {
  if (sessionStorage.getItem("visit") === null) {
    // New visit and pageview
    updateCounter("type=visit-pageview");
    sessionStorage.setItem("visit", "x");
  } else {
    // Pageview
    updateCounter("type=pageview");
  }
}

// Call the function to update the count when the page loads
checkAndUpdateCounter();
