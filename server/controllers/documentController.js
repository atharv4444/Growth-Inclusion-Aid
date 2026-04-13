const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, a.status AS application_status, b.full_name
      FROM Documents d
      LEFT JOIN Application a ON d.application_id = a.application_id
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      ORDER BY d.upload_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByApplication = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Documents WHERE application_id = ?',
      [req.params.applicationId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { application_id, document_type, document_hash } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Documents (application_id, document_type, document_hash, upload_date)
       VALUES (?, ?, ?, NOW())`,
      [application_id, document_type, document_hash]
    );
    res.status(201).json({ document_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
