const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, a.status AS application_status, b.full_name, g.grant_name
      FROM Fraud_Check_Log f
      LEFT JOIN Application a ON f.application_id = a.application_id
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      LEFT JOIN Grant_Program g ON a.grant_id = g.grant_id
      ORDER BY f.checked_on DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHighRisk = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, b.full_name, g.grant_name
      FROM Fraud_Check_Log f
      LEFT JOIN Application a ON f.application_id = a.application_id
      LEFT JOIN Beneficiary b ON a.beneficiary_id = b.beneficiary_id
      LEFT JOIN Grant_Program g ON a.grant_id = g.grant_id
      WHERE f.risk_score >= 70 OR f.fraud_flag = 'YES'
      ORDER BY f.risk_score DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByApplication = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Fraud_Check_Log WHERE application_id = ? ORDER BY checked_on DESC',
      [req.params.applicationId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRiskDistribution = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        CASE
          WHEN risk_score >= 80 THEN 'Critical'
          WHEN risk_score >= 60 THEN 'High'
          WHEN risk_score >= 40 THEN 'Medium'
          ELSE 'Low'
        END AS risk_level,
        COUNT(*) AS count,
        AVG(risk_score) AS avg_score
      FROM Fraud_Check_Log
      GROUP BY risk_level
      ORDER BY avg_score DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle fraud flag for a specific fraud log entry
exports.toggleFlag = async (req, res) => {
  try {
    const { fraud_id } = req.params;
    const { fraud_flag } = req.body; // 'YES' or 'NO'
    if (!['YES', 'NO'].includes(fraud_flag)) {
      return res.status(400).json({ error: 'fraud_flag must be YES or NO' });
    }
    await pool.query(
      'UPDATE Fraud_Check_Log SET fraud_flag = ? WHERE fraud_id = ?',
      [fraud_flag, fraud_id]
    );
    res.json({ message: `Fraud flag set to ${fraud_flag}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new fraud check entry for an application
exports.create = async (req, res) => {
  try {
    const { application_id, risk_score, fraud_flag, detection_reason } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Fraud_Check_Log (application_id, risk_score, fraud_flag, detection_reason)
       VALUES (?, ?, ?, ?)`,
      [application_id, risk_score || 0, fraud_flag || 'NO', detection_reason || 'Manual entry']
    );
    res.status(201).json({ fraud_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
