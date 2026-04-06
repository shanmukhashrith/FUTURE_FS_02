const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE (The Translators) ---
app.use(cors()); // Gives the frontend permission to connect
app.use(express.json()); // Allows our server to understand JSON data

// --- 2. CONNECT TO DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.log("❌ Database connection failed:", err));

// --- 3. DATABASE SCHEMA (The Blueprint) ---
// This tells the database exactly what a "Lead" should look like.
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String, // e.g., 'Website', 'Referral'
  status: { type: String, default: 'new' }, // 'new', 'contacted', 'converted'
  notes: [String] // A list of follow-up notes
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' times

const Lead = mongoose.model('Lead', leadSchema);

// --- 4. API ROUTES (The Waiters) ---

// POST Route: Add a brand new lead
app.post('/leads', async (req, res) => {
  const newLead = new Lead(req.body); // Package the data from the frontend
  await newLead.save(); // Save it to the MongoDB database
  res.json(newLead); // Send the saved data back as confirmation
});

// GET Route: See all leads
app.get('/leads', async (req, res) => {
  const leads = await Lead.find(); // Go find all leads in the database
  res.json(leads); // Send them back to the frontend
});

// PUT Route: Update a lead's status (e.g., from 'new' to 'contacted')
app.put('/leads/:id', async (req, res) => {
  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedLead);
});

// POST Route: Add a follow-up note to a specific lead
app.post('/leads/:id/notes', async (req, res) => {
  const lead = await Lead.findById(req.params.id); // Find the lead
  lead.notes.push(req.body.note); // Add the new note to their list
  await lead.save(); // Save the updated lead
  res.json(lead);
});
// --- DELETE A LEAD ---
app.delete('/leads/:id', async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ error: "Lead not found" });
    res.json({ message: "Lead deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

// --- 5. START THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});