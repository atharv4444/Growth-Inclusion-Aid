const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, b.full_name
      FROM Chatbot_Query c
      LEFT JOIN Beneficiary b ON c.beneficiary_id = b.beneficiary_id
      ORDER BY c.timestamp DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBeneficiary = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Chatbot_Query WHERE beneficiary_id = ? ORDER BY timestamp DESC',
      [req.params.beneficiaryId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { beneficiary_id, question } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Chatbot_Query (beneficiary_id, question, timestamp)
       VALUES (?, ?, NOW())`,
      [beneficiary_id, question]
    );
    res.status(201).json({ query_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
