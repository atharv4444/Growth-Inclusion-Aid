const pool = require('../config/db');

// GET all beneficiaries
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Beneficiary ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single beneficiary
exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Beneficiary WHERE beneficiary_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create beneficiary
exports.create = async (req, res) => {
  try {
    const { full_name, dob, gender, phone, email, address, income_level } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Beneficiary (full_name, dob, gender, phone, email, address, income_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, dob, gender, phone, email, address, income_level]
    );
    res.status(201).json({ beneficiary_id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update beneficiary
exports.update = async (req, res) => {
  try {
    const { full_name, dob, gender, phone, email, address, income_level } = req.body;
    await pool.query(
      `UPDATE Beneficiary SET full_name=?, dob=?, gender=?, phone=?, email=?, address=?, income_level=?
       WHERE beneficiary_id=?`,
      [full_name, dob, gender, phone, email, address, income_level, req.params.id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE beneficiary
exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM Beneficiary WHERE beneficiary_id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
