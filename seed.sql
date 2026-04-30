USE gia_hub;

-- ═══════════════════════════════════════════════════════════
-- SEED DATA — Rich dummy data for GIA HUB
-- ═══════════════════════════════════════════════════════════

-- ─── New Grant Programs ─────────────────────────────────────
INSERT INTO Grant_Program (grant_name, description, eligibility_criteria, max_amount) VALUES
('Rural Housing Aid', 'Housing assistance for rural families below poverty line', 'BPL card holder, rural address', 75000.00),
('Digital Literacy Fund', 'Providing digital devices and training for underprivileged youth', 'Age 16-30, income below 1,50,000', 25000.00),
('Senior Citizen Welfare', 'Monthly pension supplement for senior citizens', 'Age 60+, income below 1,00,000', 20000.00),
('Disability Support Grant', 'Financial aid for persons with disabilities', 'Valid disability certificate', 45000.00);

-- ─── New Beneficiaries ──────────────────────────────────────
INSERT INTO Beneficiary (full_name, dob, gender, phone, email, address, income_level, created_at) VALUES
('Priya Nair', '1992-03-15', 'Female', '9876001001', 'priya.nair@gmail.com', 'Kochi, Kerala', 85000.00, '2026-01-05 10:30:00'),
('Amit Patel', '1988-07-22', 'Male', '9876001002', 'amit.patel@gmail.com', 'Ahmedabad, Gujarat', 110000.00, '2026-01-08 14:20:00'),
('Sunita Devi', '1975-11-03', 'Female', '9876001003', 'sunita.devi@gmail.com', 'Patna, Bihar', 45000.00, '2026-01-12 09:15:00'),
('Karthik Rajan', '1996-05-18', 'Male', '9876001004', 'karthik.r@gmail.com', 'Coimbatore, Tamil Nadu', 72000.00, '2026-01-15 11:45:00'),
('Fatima Begum', '1990-09-28', 'Female', '9876001005', 'fatima.b@gmail.com', 'Hyderabad, Telangana', 68000.00, '2026-01-18 16:30:00'),
('Deepak Mehra', '1985-01-10', 'Male', '9876001006', 'deepak.m@gmail.com', 'Jaipur, Rajasthan', 130000.00, '2026-01-22 08:00:00'),
('Lakshmi Iyer', '1993-06-25', 'Female', '9876001007', 'lakshmi.i@gmail.com', 'Madurai, Tamil Nadu', 55000.00, '2026-01-25 13:10:00'),
('Rajesh Tiwari', '1980-12-07', 'Male', '9876001008', 'rajesh.t@gmail.com', 'Lucknow, Uttar Pradesh', 92000.00, '2026-01-28 10:00:00'),
('Meena Kumari', '1997-04-14', 'Female', '9876001009', 'meena.k@gmail.com', 'Bhopal, Madhya Pradesh', 48000.00, '2026-02-01 15:30:00'),
('Arjun Reddy', '1991-08-30', 'Male', '9876001010', 'arjun.reddy@gmail.com', 'Visakhapatnam, Andhra Pradesh', 78000.00, '2026-02-04 09:45:00'),
('Kavitha Menon', '1987-02-19', 'Female', '9876001011', 'kavitha.m@gmail.com', 'Thiruvananthapuram, Kerala', 105000.00, '2026-02-07 12:20:00'),
('Suresh Babu', '1978-10-05', 'Male', '9876001012', 'suresh.b@gmail.com', 'Mysore, Karnataka', 60000.00, '2026-02-10 14:00:00'),
('Nandini Rao', '1994-07-12', 'Female', '9876001013', 'nandini.r@gmail.com', 'Pune, Maharashtra', 88000.00, '2026-02-13 11:30:00'),
('Mohammed Irfan', '1986-03-28', 'Male', '9876001014', 'irfan.m@gmail.com', 'Kolkata, West Bengal', 70000.00, '2026-02-16 16:15:00'),
('Geeta Sharma', '1999-01-08', 'Female', '9876001015', 'geeta.s@gmail.com', 'Chandigarh, Punjab', 42000.00, '2026-02-19 08:45:00'),
('Vikram Singh', '1983-09-17', 'Male', '9876001016', 'vikram.s@gmail.com', 'Dehradun, Uttarakhand', 95000.00, '2026-02-22 10:30:00'),
('Anjali Das', '1995-12-01', 'Female', '9876001017', 'anjali.d@gmail.com', 'Guwahati, Assam', 52000.00, '2026-02-25 13:00:00'),
('Harish Kumar', '1989-04-22', 'Male', '9876001018', 'harish.k@gmail.com', 'Nagpur, Maharashtra', 115000.00, '2026-02-28 15:45:00'),
('Pooja Mishra', '1998-08-09', 'Female', '9876001019', 'pooja.m@gmail.com', 'Varanasi, Uttar Pradesh', 38000.00, '2026-03-03 09:00:00'),
('Siddharth Joshi', '1992-06-14', 'Male', '9876001020', 'sid.j@gmail.com', 'Indore, Madhya Pradesh', 82000.00, '2026-03-06 11:20:00'),
('Rekha Pandey', '1976-11-25', 'Female', '9876001021', 'rekha.p@gmail.com', 'Ranchi, Jharkhand', 35000.00, '2026-03-09 14:30:00'),
('Arun Prakash', '1990-02-03', 'Male', '9876001022', 'arun.p@gmail.com', 'Salem, Tamil Nadu', 63000.00, '2026-03-12 08:15:00'),
('Divya Krishnan', '1997-10-20', 'Female', '9876001023', 'divya.k@gmail.com', 'Mangalore, Karnataka', 47000.00, '2026-03-15 12:00:00'),
('Manoj Yadav', '1984-05-31', 'Male', '9876001024', 'manoj.y@gmail.com', 'Agra, Uttar Pradesh', 100000.00, '2026-03-18 16:00:00'),
('Shreya Ghosh', '1996-09-07', 'Female', '9876001025', 'shreya.g@gmail.com', 'Siliguri, West Bengal', 56000.00, '2026-03-21 10:45:00'),
('Ramesh Gupta', '1970-03-14', 'Male', '9876001026', 'ramesh.g@gmail.com', 'Jodhpur, Rajasthan', 40000.00, '2026-03-24 09:30:00'),
('Swathi Reddy', '1993-12-28', 'Female', '9876001027', 'swathi.r@gmail.com', 'Warangal, Telangana', 74000.00, '2026-03-27 14:15:00'),
('Prakash Sinha', '1981-07-16', 'Male', '9876001028', 'prakash.s@gmail.com', 'Raipur, Chhattisgarh', 58000.00, '2026-03-30 11:00:00'),
('Usha Rani', '1968-01-22', 'Female', '9876001029', 'usha.r@gmail.com', 'Vijayawada, Andhra Pradesh', 32000.00, '2026-04-02 13:30:00'),
('Nikhil Jain', '1991-11-09', 'Male', '9876001030', 'nikhil.j@gmail.com', 'Surat, Gujarat', 125000.00, '2026-04-05 08:00:00'),
('Padma Lakshmi', '1986-04-18', 'Female', '9876001031', 'padma.l@gmail.com', 'Tiruchirappalli, Tamil Nadu', 66000.00, '2026-04-08 15:20:00'),
('Venkat Rao', '1979-08-25', 'Male', '9876001032', 'venkat.r@gmail.com', 'Hubli, Karnataka', 90000.00, '2026-04-11 10:10:00'),
('Sarita Kumari', '1995-02-14', 'Female', '9876001033', 'sarita.k@gmail.com', 'Muzaffarpur, Bihar', 28000.00, '2026-04-14 12:45:00'),
('Ajay Thakur', '1988-06-30', 'Male', '9876001034', 'ajay.t@gmail.com', 'Shimla, Himachal Pradesh', 77000.00, '2026-04-17 09:00:00'),
('Bhavana Desai', '1994-10-11', 'Female', '9876001035', 'bhavana.d@gmail.com', 'Vadodara, Gujarat', 54000.00, '2026-04-20 14:00:00'),
('Govind Pillai', '1982-01-27', 'Male', '9876001036', 'govind.p@gmail.com', 'Kozhikode, Kerala', 98000.00, '2026-04-23 11:30:00'),
('Tanvi Mehta', '1999-05-06', 'Female', '9876001037', 'tanvi.m@gmail.com', 'Mumbai, Maharashtra', 43000.00, '2026-04-26 16:45:00');

-- ─── Applications (spread across all grants & statuses) ─────
-- Using beneficiary IDs 14-50 (the new ones) and grant IDs 1-8
INSERT INTO Application (beneficiary_id, application_date, status, grant_id, remarks) VALUES
-- Education Support Grant (grant_id=1)
(14, '2026-01-10', 'Approved', 1, 'Documents verified'),
(16, '2026-01-20', 'Approved', 1, 'Income criteria met'),
(19, '2026-02-05', 'Under Review', 1, 'Pending income verification'),
(23, '2026-02-15', 'Rejected', 1, 'Income above threshold'),
(25, '2026-03-01', 'Approved', 1, 'Fast-tracked approval'),
(33, '2026-03-20', 'Under Review', 1, 'Awaiting document upload'),
-- Skill Development Grant (grant_id=2)
(15, '2026-01-12', 'Approved', 2, 'Age verified, training enrolled'),
(17, '2026-01-25', 'Approved', 2, 'Vocational center confirmed'),
(20, '2026-02-08', 'Approved', 2, 'Skill assessment passed'),
(22, '2026-02-18', 'Under Review', 2, 'Awaiting trainer confirmation'),
(26, '2026-03-05', 'Rejected', 2, 'Age exceeds limit'),
(30, '2026-03-25', 'Approved', 2, 'Priority case'),
-- Women Empowerment Grant (grant_id=3)
(18, '2026-01-28', 'Approved', 3, 'Business plan approved'),
(21, '2026-02-10', 'Approved', 3, 'Micro-enterprise verified'),
(24, '2026-02-20', 'Under Review', 3, 'Business registration pending'),
(27, '2026-03-08', 'Approved', 3, 'Mentor assigned'),
(31, '2026-03-28', 'Rejected', 3, 'Incomplete application'),
(35, '2026-04-15', 'Under Review', 3, 'Under document review'),
-- Medical Assistance Grant (grant_id=4)
(16, '2026-02-01', 'Approved', 4, 'Medical emergency confirmed'),
(28, '2026-03-10', 'Approved', 4, 'Hospital bills verified'),
(32, '2026-04-01', 'Under Review', 4, 'Awaiting medical certificate'),
(36, '2026-04-18', 'Approved', 4, 'Urgent case processed'),
-- Rural Housing Aid (grant_id=5)
(19, '2026-02-12', 'Approved', 5, 'BPL card verified'),
(21, '2026-02-22', 'Approved', 5, 'Land documents clear'),
(29, '2026-03-15', 'Approved', 5, 'Housing survey completed'),
(33, '2026-04-05', 'Under Review', 5, 'Site inspection pending'),
(37, '2026-04-22', 'Rejected', 5, 'Urban address — ineligible'),
-- Digital Literacy Fund (grant_id=6)
(17, '2026-01-30', 'Approved', 6, 'Training center enrolled'),
(23, '2026-02-25', 'Approved', 6, 'Device allocation confirmed'),
(25, '2026-03-12', 'Approved', 6, 'Laptop disbursed'),
(34, '2026-04-10', 'Under Review', 6, 'Age verification pending'),
(37, '2026-04-25', 'Under Review', 6, 'Income proof awaited'),
-- Senior Citizen Welfare (grant_id=7)
(29, '2026-03-18', 'Approved', 7, 'Age and income verified'),
(26, '2026-03-22', 'Approved', 7, 'Pension supplement initiated'),
(32, '2026-04-08', 'Under Review', 7, 'Address verification pending'),
-- Disability Support Grant (grant_id=8)
(28, '2026-03-12', 'Approved', 8, 'Disability certificate verified'),
(16, '2026-03-30', 'Approved', 8, 'Physical disability — 60%'),
(34, '2026-04-12', 'Under Review', 8, 'Certificate validation pending'),
(38, '2026-04-20', 'Rejected', 8, 'Certificate expired');

-- ─── Payment Records ───────────────────────────────────────
-- Payments for Approved applications (using the new application IDs)
-- application_id starts at 14 for the new inserts
INSERT INTO Payment_Record (application_id, amount, payment_date, payment_status) VALUES
-- Education
(14, 45000.00, '2026-01-18', 'Completed'),
(15, 50000.00, '2026-01-28', 'Completed'),
(18, 48000.00, '2026-03-08', 'Completed'),
-- Skill Dev
(20, 28000.00, '2026-01-20', 'Completed'),
(21, 30000.00, '2026-02-02', 'Completed'),
(23, 25000.00, '2026-02-15', 'Completed'),
(25, 30000.00, '2026-04-01', 'Completed'),
-- Women Emp
(26, 35000.00, '2026-02-05', 'Completed'),
(27, 40000.00, '2026-02-18', 'Completed'),
(29, 38000.00, '2026-03-15', 'Completed'),
-- Medical
(33, 55000.00, '2026-02-10', 'Completed'),
(34, 60000.00, '2026-03-18', 'Completed'),
(36, 58000.00, '2026-04-25', 'Completed'),
-- Rural Housing
(37, 70000.00, '2026-02-20', 'Completed'),
(38, 75000.00, '2026-03-02', 'Completed'),
(39, 65000.00, '2026-03-22', 'Completed'),
-- Digital Literacy
(42, 22000.00, '2026-02-08', 'Completed'),
(43, 25000.00, '2026-03-05', 'Completed'),
(44, 24000.00, '2026-03-20', 'Completed'),
-- Senior Citizen
(46, 18000.00, '2026-03-25', 'Completed'),
(47, 20000.00, '2026-03-30', 'Completed'),
-- Disability
(49, 42000.00, '2026-03-20', 'Completed'),
(50, 45000.00, '2026-04-05', 'Completed'),
-- Some pending payments
(19, 35000.00, '2026-03-10', 'Pending'),
(24, 27000.00, '2026-02-20', 'Pending'),
(40, 72000.00, '2026-04-15', 'Pending');

-- ─── Fraud Check Logs ───────────────────────────────────────
INSERT INTO Fraud_Check_Log (application_id, risk_score, fraud_flag, detection_reason, checked_on) VALUES
(14, 15, 'NO', 'All documents verified successfully', '2026-01-15 10:00:00'),
(15, 10, 'NO', 'Clean record, no anomalies detected', '2026-01-25 11:30:00'),
(16, 72, 'YES', 'Multiple applications from same address in short period', '2026-01-22 14:00:00'),
(17, 85, 'YES', 'Phone number linked to previously flagged account', '2026-01-27 09:45:00'),
(18, 5, 'NO', 'Verified through Aadhaar cross-reference', '2026-03-05 16:20:00'),
(19, 45, 'NO', 'Minor income discrepancy — within tolerance', '2026-02-08 10:15:00'),
(20, 8, 'NO', 'Valid record, age criteria met', '2026-01-15 13:00:00'),
(21, 12, 'NO', 'Vocational eligibility confirmed', '2026-02-01 11:00:00'),
(22, 55, 'NO', 'Trainer reference needs manual review', '2026-02-20 15:30:00'),
(23, 68, 'YES', 'Duplicate Aadhaar number detected in system', '2026-02-18 09:00:00'),
(24, 20, 'NO', 'Business registration verified', '2026-02-22 14:45:00'),
(25, 78, 'YES', 'Income level inconsistent with tax records', '2026-03-15 10:30:00'),
(26, 30, 'NO', 'Standard verification passed', '2026-02-03 12:00:00'),
(27, 7, 'NO', 'All criteria met, clean background', '2026-02-15 16:00:00'),
(28, 90, 'YES', 'Suspected identity fraud — name mismatch with Aadhaar', '2026-03-10 08:30:00'),
(29, 18, 'NO', 'Mentor verification successful', '2026-03-12 11:15:00'),
(30, 42, 'NO', 'Minor address discrepancy — resolved', '2026-03-30 14:00:00'),
(31, 65, 'YES', 'Submitted forged income certificate', '2026-04-18 10:45:00'),
(32, 25, 'NO', 'Medical records authenticated', '2026-04-05 09:30:00'),
(33, 10, 'NO', 'Emergency case — fast-track verified', '2026-02-08 15:00:00'),
(34, 82, 'YES', 'Same beneficiary applying under different phone numbers', '2026-03-15 13:20:00'),
(35, 15, 'NO', 'Housing eligibility confirmed via BPL card', '2026-04-20 11:00:00'),
(36, 5, 'NO', 'All documents authentic', '2026-04-22 16:30:00'),
(37, 38, 'NO', 'BPL verification passed with minor delay', '2026-02-18 10:00:00'),
(38, 92, 'YES', 'Fabricated land ownership documents detected', '2026-03-01 08:15:00'),
(39, 22, 'NO', 'Site survey confirmed rural residence', '2026-03-20 14:30:00'),
(40, 50, 'NO', 'Address mismatch — needs clarification', '2026-04-08 09:00:00'),
(41, 8, 'NO', 'Clean digital literacy application', '2026-04-25 12:00:00'),
(42, 12, 'NO', 'Training enrollment verified', '2026-02-05 15:45:00'),
(43, 75, 'YES', 'Applicant already received similar grant from another NGO', '2026-03-02 10:30:00'),
(44, 18, 'NO', 'Device allocation approved', '2026-03-18 13:00:00'),
(45, 60, 'YES', 'Age falsification suspected', '2026-04-12 11:30:00'),
(46, 6, 'NO', 'Senior citizen status confirmed via Aadhaar', '2026-03-22 09:15:00'),
(47, 10, 'NO', 'Pension records verified', '2026-03-28 14:00:00'),
(49, 14, 'NO', 'Disability certificate authenticated', '2026-03-18 16:00:00'),
(50, 20, 'NO', 'Medical board assessment confirmed', '2026-04-02 10:45:00'),
(51, 48, 'NO', 'Certificate validity under review', '2026-04-15 08:30:00');

-- ─── Documents ──────────────────────────────────────────────
INSERT INTO Documents (application_id, document_type, document_hash, upload_date) VALUES
(14, 'Aadhaar Card', 'sha256_aadh_14a', '2026-01-09'),
(14, 'Income Certificate', 'sha256_inc_14b', '2026-01-09'),
(15, 'Aadhaar Card', 'sha256_aadh_15a', '2026-01-19'),
(15, 'Marksheet', 'sha256_mark_15b', '2026-01-19'),
(16, 'Aadhaar Card', 'sha256_aadh_16a', '2026-01-21'),
(17, 'Aadhaar Card', 'sha256_aadh_17a', '2026-01-26'),
(17, 'Income Certificate', 'sha256_inc_17b', '2026-01-26'),
(18, 'Aadhaar Card', 'sha256_aadh_18a', '2026-03-04'),
(20, 'Aadhaar Card', 'sha256_aadh_20a', '2026-01-11'),
(20, 'Age Proof', 'sha256_age_20b', '2026-01-11'),
(21, 'Aadhaar Card', 'sha256_aadh_21a', '2026-01-24'),
(21, 'Training Certificate', 'sha256_train_21b', '2026-01-24'),
(26, 'Business Plan', 'sha256_biz_26a', '2026-02-02'),
(26, 'Aadhaar Card', 'sha256_aadh_26b', '2026-02-02'),
(27, 'Business Registration', 'sha256_biz_27a', '2026-02-09'),
(33, 'Medical Certificate', 'sha256_med_33a', '2026-02-07'),
(33, 'Hospital Bill', 'sha256_bill_33b', '2026-02-07'),
(34, 'Medical Certificate', 'sha256_med_34a', '2026-03-12'),
(37, 'BPL Card', 'sha256_bpl_37a', '2026-02-11'),
(37, 'Land Document', 'sha256_land_37b', '2026-02-11'),
(38, 'BPL Card', 'sha256_bpl_38a', '2026-02-21'),
(42, 'Aadhaar Card', 'sha256_aadh_42a', '2026-01-29'),
(46, 'Age Proof', 'sha256_age_46a', '2026-03-17'),
(46, 'Pension Card', 'sha256_pen_46b', '2026-03-17'),
(49, 'Disability Certificate', 'sha256_dis_49a', '2026-03-11'),
(50, 'Disability Certificate', 'sha256_dis_50a', '2026-03-29');

-- ─── NGO Staff ──────────────────────────────────────────────
INSERT INTO NGO_Staff (name, role, email) VALUES
('Dr. Anika Kapoor', 'Director', 'anika.kapoor@giahub.org'),
('Raghav Menon', 'Program Manager', 'raghav.menon@giahub.org'),
('Shalini Verma', 'Field Officer', 'shalini.verma@giahub.org'),
('Farhan Sheikh', 'Fraud Analyst', 'farhan.sheikh@giahub.org'),
('Deepa Nambiar', 'Finance Controller', 'deepa.nambiar@giahub.org'),
('Vivek Choudhary', 'Data Analyst', 'vivek.choudhary@giahub.org'),
('Meghna Roy', 'Verification Lead', 'meghna.roy@giahub.org'),
('Sunil Patil', 'Field Officer', 'sunil.patil@giahub.org'),
('Ananya Bose', 'Community Liaison', 'ananya.bose@giahub.org'),
('Tarun Saxena', 'IT Administrator', 'tarun.saxena@giahub.org');

-- ─── Chatbot Queries ────────────────────────────────────────
INSERT INTO Chatbot_Query (beneficiary_id, question, timestamp) VALUES
(14, 'What is the status of my education grant application?', '2026-01-20 09:30:00'),
(15, 'How can I upload my income certificate?', '2026-01-22 14:15:00'),
(16, 'When will my application be reviewed?', '2026-02-01 10:00:00'),
(17, 'What documents are needed for skill development grant?', '2026-02-03 11:45:00'),
(19, 'Can I apply for multiple grants at the same time?', '2026-02-10 16:30:00'),
(20, 'What is the maximum amount for medical assistance?', '2026-02-12 08:20:00'),
(22, 'How long does the verification process take?', '2026-02-25 13:00:00'),
(24, 'My application was rejected. How do I appeal?', '2026-03-05 09:15:00'),
(26, 'Is there any grant for senior citizens?', '2026-03-10 15:00:00'),
(28, 'How can I check my payment status?', '2026-03-20 10:30:00'),
(29, 'What is the eligibility for rural housing aid?', '2026-03-22 14:45:00'),
(30, 'Can I update my contact information?', '2026-03-28 11:00:00'),
(32, 'How do I get a disability certificate?', '2026-04-05 09:00:00'),
(35, 'What is the digital literacy fund about?', '2026-04-12 16:20:00'),
(37, 'When is the next batch of housing grants?', '2026-04-18 08:30:00'),
(14, 'Thank you, my payment was received!', '2026-04-20 12:00:00'),
(19, 'Is there a helpline number for queries?', '2026-04-22 14:30:00'),
(21, 'Can I attend the training program online?', '2026-04-25 10:15:00');
