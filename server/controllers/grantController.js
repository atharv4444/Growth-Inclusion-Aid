const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*,
        COUNT(DISTINCT a.application_id) AS total_applications,
        COALESCE(SUM(CASE WHEN a.status = 'Approved' THEN 1 ELSE 0 END), 0) AS approved_count,
        COALESCE(SUM(p.amount), 0) AS total_disbursed
      FROM Grant_Program g
      LEFT JOIN Application a ON g.grant_id = a.grant_id
      LEFT JOIN Payment_Record p ON a.application_id = p.application_id AND p.payment_status = 'Completed'
      GROUP BY g.grant_id
      ORDER BY g.grant_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Grant_Program WHERE grant_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { grant_name, description, eligibility_criteria, max_amount } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Grant_Program (grant_name, description, eligibility_criteria, max_amount)
       VALUES (?, ?, ?, ?)`,
      [grant_name, description, eligibility_criteria, max_amount]
    );
    res.status(201).json({ grant_id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
