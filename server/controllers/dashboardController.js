const pool = require('../config/db');

// Aggregate stats for dashboard summary cards
exports.getSummary = async (req, res) => {
  try {
    const [[benCount]] = await pool.query('SELECT COUNT(*) AS total FROM Beneficiary');
    const [[appCount]] = await pool.query('SELECT COUNT(*) AS total FROM Application');
    const [[disbursed]] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM Payment_Record WHERE payment_status = 'Completed'"
    );
    const [[pendingApps]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Application WHERE status = 'Under Review'"
    );
    const [[flaggedCount]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Fraud_Check_Log WHERE fraud_flag = 'YES'"
    );

    res.json({
      totalBeneficiaries: benCount.total,
      totalApplications: appCount.total,
      totalDisbursed: disbursed.total,
      pendingReview: pendingApps.total,
      flaggedFraud: flaggedCount.total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fund allocation by grant type (for Donut Chart)
exports.getFundAllocation = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.grant_name AS name, COALESCE(SUM(p.amount), 0) AS value
      FROM Grant_Program g
      LEFT JOIN Application a ON g.grant_id = a.grant_id
      LEFT JOIN Payment_Record p ON a.application_id = p.application_id AND p.payment_status = 'Completed'
      GROUP BY g.grant_id, g.grant_name
      HAVING value > 0
      ORDER BY value DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Application flow over last 30 days (for Area Chart)
exports.getApplicationFlow = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE(application_date) AS date,
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END) AS pending
      FROM Application
      WHERE application_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(application_date)
      ORDER BY date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Projected vs Actual aid (for Bar Graph)
exports.getProjectedVsActual = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.grant_name AS name,
        COALESCE(g.max_amount * COUNT(DISTINCT a.application_id), 0) AS projected,
        COALESCE(SUM(p.amount), 0) AS actual
      FROM Grant_Program g
      LEFT JOIN Application a ON g.grant_id = a.grant_id AND a.status = 'Approved'
      LEFT JOIN Payment_Record p ON a.application_id = p.application_id AND p.payment_status = 'Completed'
      GROUP BY g.grant_id, g.grant_name, g.max_amount
      ORDER BY g.grant_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
