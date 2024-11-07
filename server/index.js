import express from 'express';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes.js'; // Import routes
  
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// Use the routes
app.use('/api',  patientRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/* import express from "express";
import cors from "cors";
import db from '../db.js'; 

const app = express();
const port = 5000;


app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Routes// 

//add new patient //
app.post("/add", async (req, res) => {
    const { title, name, birthdate, number, history } = req.body;
    // Initialize an array to store missing fields
    const missingFields = [];

    // Check which fields are missing
    if (!title) missingFields.push("title");
    if (!name) missingFields.push("name");
    if (!birthdate) missingFields.push("birthdate");
    if (!number) missingFields.push("phone number");
    if (!history) missingFields.push("history");

    // If there are missing fields, return an error with details
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            error: `Please complete the following required fields: ${missingFields.join(", ")}.` 
        });
    }
    try { 
        const newpatient = await db.query("INSERT INTO patients  (title, name, dateofbirth, phone_number, history)  VALUES($1, $2, $3, $4, $5) Returning *",
             [title, name, birthdate, number, history] );
        console.log(newpatient.rows[0]);
        res.status(201).json({ message: "Patient added successfully", patient: newpatient.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            // Handle duplicate phone number error
            res.status(409).json({ error: "This phone number is already in use." });
        } else {
            // General error handling
            console.error(err.message);
            res.status(500).json({ error: "An error occurred while adding the patient." });
        }
    }
})
//search for patient and get it//
app.post("/search", async (req, res) => {
    const { searchBy, query } = req.body;
  
    try {
      let result;
  
      if (searchBy === "name") {
        result = await db.query(
          "SELECT * FROM patients WHERE name ILIKE $1",
          [`%${query}%`]
        );
      } else if (searchBy === "phone_number") {
        result = await db.query(
          "SELECT * FROM patients WHERE phone_number = $1",
          [query]
        );
      } else {
        return res.status(400).json({ error: "Invalid search criteria." });
      }
  
      if (result.rows.length > 0) {
        res.json(result.rows);
      } else {
        res.status(404).json({ message: "No patient found." });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "An error occurred while searching." });
    }
  });

// get all patients//
app.get("/patients", async (req, res) => {
    try {
      const result = await db.query(
        `SELECT 
          title, 
          name, 
          phone_number, 
          DATE_PART('year', AGE(dateofbirth)) AS age 
        FROM patients`
      );
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "An error occurred while fetching patients." });
    }
  });

//update patient // 
app.put("/update/:id", async (req, res) => {
    const patientId = req.params.id;
    const { title, name, birthdate, number, history } = req.body;

    try {
        const result = await db.query(
            `UPDATE patients 
             SET title = $1, name = $2, dateofbirth = $3, phone_number = $4, history = $5
             WHERE id = $6 RETURNING *`,
            [title, name, birthdate, number, history, patientId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient updated successfully", patient: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});


app.listen(port, ()=> {
    console.log(`server has started on port ${port}`)
})
    */