const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, a.status AS application_status, b.full_name, g.grant_name
      FROM Payment_Record p
      LEFT JOIN Application a ON p.application_id = a.application_id
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      LEFT JOIN Grant_Program g ON a.grant_id = g.grant_id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByApplication = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Payment_Record WHERE application_id = ?',
      [req.params.applicationId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { application_id, amount, payment_date, payment_status } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Payment_Record (application_id, amount, payment_date, payment_status)
       VALUES (?, ?, ?, ?)`,
      [application_id, amount, payment_date || new Date(), payment_status || 'Pending']
    );
    res.status(201).json({ payment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { payment_status } = req.body;
    await pool.query(
      'UPDATE Payment_Record SET payment_status=? WHERE payment_id=?',
      [payment_status, req.params.id]
    );
    res.json({ message: 'Payment status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
