import express from "express";
import db from "../db.js"; // Import the database connection
import multer from "multer";
import bcrypt from "bcrypt";
import path from "path";
import jwt from "jsonwebtoken";
import { fileStorage } from "../multerConfig.js"; // Import the multer configuration
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bufferToBase64 = (buffer) => {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};
const router = express.Router();

const upload = multer({ storage: fileStorage }).fields([
  { name: "pre", maxCount: 10 },
  { name: "post", maxCount: 10 },
  { name: "intra_oral", maxCount: 10 },
  { name: "extra_oral", maxCount: 10 },
]);
// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
});
// Add new patient
router.post("/add", async (req, res) => {
  const { title, name, birthdate, number, history, address } = req.body;
  const missingFields = [];

  if (!title) missingFields.push("title");
  if (!name) missingFields.push("name");
  if (!birthdate) missingFields.push("birthdate");
  if (!number) missingFields.push("phone number");
  if (!history) missingFields.push("history");
  if (!address) missingFields.push("adress");

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Please complete the following required fields: ${missingFields.join(
        ", "
      )}.`,
    });
  }

  try {
    const newpatient = await db.query(
      "INSERT INTO patients (title, name, dateofbirth, phone_number, history, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, name, birthdate, number, history, address]
    );
    res.status(201).json({ message: "Patient added successfully" });
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "This phone number is already in use." });
    } else {
      console.error(err.message);
      res
        .status(500)
        .json({ error: "An error occurred while adding the patient." });
    }
  }
});

// Search for patient
router.post("/search", async (req, res) => {
  const { searchBy, query } = req.body;

  try {
    let result;

    if (searchBy === "name") {
      result = await db.query("SELECT * FROM patients WHERE name ILIKE $1", [
        `%${query}%`,
      ]);
    } else if (searchBy === "phone_number") {
      result = await db.query(
        "SELECT * FROM patients WHERE phone_number = $1",
        [query]
      );
    } else {
      return res.status(400).json({ error: "Invalid search criteria." });
    }

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the first match
    } else {
      res.status(404).json({ message: "No patient found." });
    }
  } catch (err) {
    console.error("Error during search:", err.message);
    res.status(500).json({ error: "An error occurred while searching." });
  }
});

router.get("/patient/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, title, name, phone_number, history, address, dateofbirth, DATE_PART('year', AGE(dateofbirth)) AS age FROM patients WHERE id = $1",
      [id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Patient not found." });
    }
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching patient data." });
  }
});

// Get all patients
router.get("/patients", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
                id,
                title, 
                name, 
                phone_number, 
                DATE_PART('year', AGE(dateofbirth)) AS age,
                history
            FROM patients ORDER BY name`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching patients." });
  }
});

// Update patient
router.put("/update/:id", async (req, res) => {
  const patientId = req.params.id;
  const { title, name, dateofbirth, phone_number, history, address } = req.body;

  try {
    const result = await db.query(
      `UPDATE patients 
             SET title = $1, name = $2, dateofbirth = $3, phone_number = $4, history = $5, address = $6
             WHERE id = $7 RETURNING *`,
      [title, name, dateofbirth, phone_number, history, address, patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//add visit

router.post("/addvisit", upload, async (req, res) => {
  console.log("Received files:", req.files); // Log files
  console.log("Received form data:", req.body);

  const { doctor_name, patient_id, reason, treatment, cost, amount_paid } =
    req.body;
  const missingFields = [];

  if (!req.files) {
    console.log("no file provided");
  }

  // Check for required fields
  if (!doctor_name) missingFields.push("doctor_name");
  if (!reason) missingFields.push("reason");
  if (!treatment) missingFields.push("treatment");
  if (cost === undefined) missingFields.push("cost"); // Ensure cost is provided
  if (amount_paid === undefined) missingFields.push("amount_paid"); // Ensure amount_paid is provided

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Please complete the following required fields: ${missingFields.join(
        ", "
      )}.`,
    });
  }

  try {
    // Retrieve doctor_id based on doctor_name
    const doctorResult = await db.query(
      "SELECT id FROM doctors WHERE doctor_name = $1",
      [doctor_name]
    );

    const doctor_id = doctorResult.rows[0].id;
    // Collect paths of all files for each category
    const preImages = req.files.pre
      ? req.files.pre.map((file) => `images/${file.filename}`)
      : [];
    const postImages = req.files.post
      ? req.files.post.map((file) => `images/${file.filename}`)
      : [];
    const intraOralImages = req.files.intra_oral
      ? req.files.intra_oral.map((file) => `images/${file.filename}`)
      : [];
    const extraOralImages = req.files.extra_oral
      ? req.files.extra_oral.map((file) => `images/${file.filename}`)
      : [];

    // Insert into the visits table
    const newVisit = await db.query(
      "INSERT INTO visits (doctor_id, patient_id, reason, treatment, pre, post, intra_oral, extra_oral, cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        doctor_id,
        patient_id,
        reason,
        treatment,
        JSON.stringify(preImages),
        JSON.stringify(postImages),
        JSON.stringify(intraOralImages),
        JSON.stringify(extraOralImages),
        cost,
      ]
    );

    const visitId = newVisit.rows[0].id; // Get the newly inserted visit ID

    // Insert into the payments table
    await db.query(
      "INSERT INTO payments (visit_id, patient_id, doctor_id, amountpaid) VALUES ($1, $2, $3, $4)",
      [visitId, patient_id, doctor_id, amount_paid]
    );

    res.status(201).json({ message: "Visit and payment added successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      // Unique constraint violation
      res.status(409).json({ error: "Conflict with existing data." });
    } else {
      res.status(500).json({
        error: "An error occurred while adding the visit and payment.",
        details: err.message,
      });
    }
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await db.query(
      "SELECT id, doctor_name AS name FROM doctors"
    );
    res.json(doctors.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

//calculate amount due
router.get("/amountdue/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch all visits and payments for the patient
    const visits = await db.query(
      "SELECT cost FROM visits WHERE patient_id = $1",
      [id]
    );
    const payments = await db.query(
      "SELECT amountpaid FROM payments WHERE patient_id = $1",
      [id]
    );

    // Calculate total cost and total payments
    const totalCost = visits.rows.reduce(
      (sum, visit) => sum + parseFloat(visit.cost),
      0
    );
    const totalPayments = payments.rows.reduce(
      (sum, payment) => sum + parseFloat(payment.amountpaid),
      0
    );

    // Calculate amount due (excluding current visit)
    const amountDue = totalCost - totalPayments;

    // Send amount due to frontend
    res.json({ amountDue });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while calculating the amount due" });
  }
});

router.get("/visits/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const visits = await db.query(
      "SELECT TO_CHAR(v.visit_date,'DD/MM/YYYY') AS visit_date, d.doctor_name, v.reason, v.cost, v.id, COALESCE(p.amountpaid, 0) AS amount_paid FROM visits v JOIN doctors d ON v.doctor_id = d.id LEFT JOIN payments p ON v.id = p.visit_id WHERE v.patient_id =$1 ORDER BY v.visit_date;",
      [id]
    );
    res.json(visits.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

//get visit details

router.get("/visit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const visit = await db.query(
      "SELECT  * , amountpaid, doctor_name FROM visits JOIN payments ON visits.id = payments.visit_id JOIN doctors ON visits.doctor_id = doctors.id WHERE visits.id = $1;",
      [id]
    );

    if (visit.rows.length > 0) {
      const visitData = visit.rows[0];

      // Convert image buffers to base64 if they exist
      const visitWithImages = {
        ...visitData,
        pre: visitData.pre ? JSON.parse(visitData.pre) : [], // Parsing JSON stored as an array of paths
        post: visitData.post ? JSON.parse(visitData.post) : [],
        intra_oral: visitData.intra_oral
          ? JSON.parse(visitData.intra_oral)
          : [],
        extra_oral: visitData.extra_oral
          ? JSON.parse(visitData.extra_oral)
          : [],
      };

      res.json([visitWithImages]); // Send the visit data along with base64 images
      console.log(visit.rows);
    } else {
      res.status(404).json({ error: "Visit not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

router.get("/doctor/summary", async (req, res) => {
  const { startDate, endDate } = req.query; // Get the start and end dates from the query parameters

  try {
    const query = `
                SELECT
                    doctors.doctor_name,
                    COALESCE(SUM(payments.amountpaid), 0) AS total_amount_paid,
                    COALESCE(SUM(visits.cost), 0) AS total_cost
                FROM
                    doctors
                LEFT JOIN visits ON doctors.id = visits.doctor_id
                LEFT JOIN payments ON visits.id = payments.visit_id
                WHERE
                    visits.visit_date BETWEEN $1 AND $2
                    AND payments.paymentdate BETWEEN $1 AND $2
                GROUP BY
                    doctors.doctor_name;
            `;
    const values = [startDate, endDate];
    const result = await db.query(query, values);
    console.log(endDate);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching doctor summary data." });
  }
});
export default router;

/* SELECT
doctors.doctor_name,
COALESCE(SUM(payments.amountpaid), 0) AS total_amount_paid,
COALESCE(SUM(visits.cost), 0) AS total_cost
FROM
doctors
LEFT JOIN visits ON doctors.id = visits.doctor_id
LEFT JOIN payments ON visits.id = payments.visit_id
GROUP BY
doctors.doctor_name; */
