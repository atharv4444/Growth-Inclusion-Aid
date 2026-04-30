const pool = require('../config/db');

// GET all applications with beneficiary + grant info (JOIN)
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, b.full_name, b.email AS beneficiary_email, g.grant_name, g.max_amount
      FROM Application a
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      LEFT JOIN Grant_Program g ON a.grant_id = g.grant_id
      ORDER BY a.application_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single application
exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, b.full_name, b.email AS beneficiary_email, g.grant_name, g.max_amount
      FROM Application a
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      LEFT JOIN Grant_Program g ON a.grant_id = g.grant_id
      WHERE a.application_id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create application
exports.create = async (req, res) => {
  try {
    const { beneficiary_id, application_date, status, grant_id, remarks } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Application (beneficiary_id, application_date, status, grant_id, remarks)
       VALUES (?, ?, ?, ?, ?)`,
      [beneficiary_id, application_date || new Date(), status || 'Under Review', grant_id, remarks]
    );
    res.status(201).json({ application_id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update application status (verify)
exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    await pool.query(
      'UPDATE Application SET status=?, remarks=? WHERE application_id=?',
      [status, remarks, req.params.id]
    );
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST verify application (approve/reject)
exports.verify = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Approved or Rejected' });
    }
    await pool.query(
      'UPDATE Application SET status=?, remarks=? WHERE application_id=?',
      [status, remarks || '', req.params.id]
    );
    res.json({ message: `Application ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET applications grouped by status (for Kanban)
exports.getByStatus = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, b.full_name, g.grant_name,
        (SELECT f.fraud_id FROM Fraud_Check_Log f WHERE f.application_id = a.application_id ORDER BY f.checked_on DESC LIMIT 1) AS fraud_id,
        (SELECT f.risk_score FROM Fraud_Check_Log f WHERE f.application_id = a.application_id ORDER BY f.checked_on DESC LIMIT 1) AS risk_score,
        (SELECT f.fraud_flag FROM Fraud_Check_Log f WHERE f.application_id = a.application_id ORDER BY f.checked_on DESC LIMIT 1) AS fraud_flag
      FROM Application a
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      LEFT JOIN Grant_Program g ON a.grant_id = g.grant_id
      ORDER BY a.application_date DESC
    `);
    const grouped = {
      'Under Review': rows.filter(r => r.status === 'Under Review'),
      'Approved': rows.filter(r => r.status === 'Approved'),
      'Rejected': rows.filter(r => r.status === 'Rejected'),
    };
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
