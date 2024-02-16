// const express = require('express');
// const admin = require('firebase-admin');

// const app = express();
// const port = process.env.PORT || 8000;


// const serviceAccount = require('./test-79539-firebase-adminsdk-8p9jt-397071f53c.json'); // Update with your own path
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://test-79539.firebaseio.com',
// });

// // Retrieve data from Firebase
// app.get('/api/data', (req, res) => {
//     const db = admin.firestore();
//     const docRef = db.collection('users').doc('KlnTxFSYnY38jlnJ2VQN');

//     docRef.get()
//         .then((doc) => {
//             if (doc.exists) {
//                 res.json({ data: doc.data() });
//             } else {
//                 res.status(404).json({ error: 'Document not found' });
//             }
//         })
//         .catch((error) => {
//             console.error('Error getting document:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });
// const db = admin.firestore();

// async function addData() {
//     try {
//         const data = {
//             name: "John Doe",
//             age: 30,
//             email: "johndoe@example.com"
//         };

//         // Add a new document with a generated ID
//         const docRef = await db.collection("users").add(data);
//         console.log("Document written with ID: ", docRef.id);
//     } catch (error) {
//         console.error("Error adding document: ", error);
//     }
// }
// addData()
// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on ${port}`);
// });




const express = require("express");
const admin = require("firebase-admin");
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require("./test-79539-firebase-adminsdk-8p9jt-397071f53c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-project-id.firebaseio.com"
});

// Get a Firestore reference
const db = admin.firestore();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
// Add data to Firestore collection
app.post("/api/add-data", async (req, res) => {
    try {
        const data = req.body; // Assuming data comes in as JSON
        const docRef = await db.collection("users").add(data);
        res.status(201).json({ message: "Data added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all data from Firestore collection
app.get("/api/get-data", async (req, res) => {
    try {
        const snapshot = await db.collection("users").get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting documents: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
