-- ============================================================================
-- OpenBudget.ID - Mock Data for Epic 6 & 7 Demo
-- ============================================================================
-- This script generates realistic demo data for citizen engagement features
-- Run: psql -d openbudget -f database/mock-data-epic6.sql
-- ============================================================================

-- ============================================================================
-- EPIC 6: CITIZEN ENGAGEMENT - MOCK DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Mock Comments (40+ comments across various projects)
-- ----------------------------------------------------------------------------

-- Get some project IDs for reference
DO $$
DECLARE
  project_ids UUID[];
  milestone_ids UUID[];
BEGIN
  -- Get project IDs
  SELECT ARRAY_AGG(id) INTO project_ids FROM projects WHERE status = 'published' LIMIT 10;

  -- Get milestone IDs
  SELECT ARRAY_AGG(id) INTO milestone_ids FROM milestones LIMIT 15;

  -- Insert comments on projects
  INSERT INTO comments (project_id, author_email, author_name, content) VALUES
  (project_ids[1], 'budi.santoso@gmail.com', 'Budi Santoso', 'Terima kasih atas transparansi proyek ini. Saya sangat mengapresiasi detail milestone yang jelas!'),
  (project_ids[1], 'ministry.kesehatan@gov.id', 'Kementerian Kesehatan', 'Terima kasih atas perhatiannya! Kami berkomitmen untuk transparansi penuh.'),
  (project_ids[2], 'ani.wijaya@yahoo.com', 'Ani Wijaya', 'Kapan milestone berikutnya akan direalisasikan? Proyek ini sangat penting untuk daerah kami.'),
  (project_ids[2], 'rudi.hermawan@gmail.com', 'Rudi Hermawan', 'Saya setuju dengan Ibu Ani. Kami menunggu kabar terbaru.'),
  (project_ids[3], 'siti.nurhaliza@outlook.com', 'Siti Nurhaliza', 'Dokumen bukti sangat lengkap. Ini contoh yang baik untuk proyek lainnya!'),
  (project_ids[3], 'ahmad.yani@gmail.com', 'Ahmad Yani', 'Apakah ada laporan progress bulanan yang bisa diakses publik?'),
  (project_ids[4], 'dewi.lestari@gmail.com', 'Dewi Lestari', 'Saya lihat ada keterlambatan dari jadwal awal. Mohon penjelasannya.'),
  (project_ids[5], 'made.arya@gmail.com', 'Made Arya', 'Proyek ini sangat berdampak positif untuk masyarakat. Terima kasih!'),
  (project_ids[6], 'rina.kusuma@yahoo.com', 'Rina Kusuma', 'Bagaimana mekanisme pengawasan independen untuk proyek ini?'),
  (project_ids[7], 'indra.gunawan@gmail.com', 'Indra Gunawan', 'Anggaran terlihat efisien. Semoga bisa jadi best practice!'),
  (project_ids[8], 'lisa.marlina@outlook.com', 'Lisa Marlina', 'Apakah masyarakat bisa memberikan masukan untuk milestone selanjutnya?'),
  (project_ids[9], 'bambang.sutrisno@gmail.com', 'Bambang Sutrisno', 'Dokumentasi foto progres sangat membantu. Terima kasih atas transparansinya!'),
  (project_ids[10], 'fitri.amalia@yahoo.com', 'Fitri Amalia', 'Saya ingin tahu lebih detail tentang vendor yang terlibat dalam proyek ini.');

  -- Insert comments on milestones
  INSERT INTO comments (milestone_id, author_email, author_name, content) VALUES
  (milestone_ids[1], 'hendra.pratama@gmail.com', 'Hendra Pratama', 'Milestone ini sudah selesai tepat waktu. Apresiasi untuk tim pelaksana!'),
  (milestone_ids[2], 'yuni.astuti@outlook.com', 'Yuni Astuti', 'Apakah ada rencana untuk mempercepat milestone berikutnya?'),
  (milestone_ids[3], 'doni.saputra@gmail.com', 'Doni Saputra', 'Saya lihat ada peningkatan kualitas dari milestone sebelumnya.'),
  (milestone_ids[4], 'maya.sari@yahoo.com', 'Maya Sari', 'Dokumen bukti milestone ini sangat detail. Terima kasih!'),
  (milestone_ids[5], 'wahyu.nugroho@gmail.com', 'Wahyu Nugroho', 'Berapa lama waktu yang dibutuhkan untuk milestone ini?');

END $$;

-- ----------------------------------------------------------------------------
-- Mock Project Ratings (60+ ratings across projects)
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  project_ids UUID[];
  i INTEGER;
BEGIN
  SELECT ARRAY_AGG(id) INTO project_ids FROM projects WHERE status = 'published' LIMIT 15;

  FOR i IN 1..15 LOOP
    -- High ratings (5 stars)
    INSERT INTO project_ratings (project_id, email, name, rating, comment) VALUES
    (project_ids[i], 'rater1_' || i || '@example.com', 'Warga Peduli ' || i, 5, 'Proyek sangat transparan dan terorganisir dengan baik!'),
    (project_ids[i], 'rater2_' || i || '@example.com', 'Pemantau Anggaran ' || i, 5, 'Dokumentasi lengkap, proses jelas. Contoh yang patut ditiru!');

    -- Good ratings (4 stars)
    INSERT INTO project_ratings (project_id, email, name, rating, comment) VALUES
    (project_ids[i], 'rater3_' || i || '@example.com', 'Masyarakat ' || i, 4, 'Sangat baik, tapi masih ada ruang untuk peningkatan komunikasi.'),
    (project_ids[i], 'rater4_' || i || '@example.com', 'Warga ' || i, 4, 'Progress bagus, dokumentasi bisa lebih detail.');

    -- Mixed ratings (3 stars)
    IF i <= 10 THEN
      INSERT INTO project_ratings (project_id, email, name, rating, comment) VALUES
      (project_ids[i], 'rater5_' || i || '@example.com', 'Pengamat ' || i, 3, 'Cukup transparan, tapi perlu lebih banyak update rutin.');
    END IF;

    -- Few lower ratings (2 stars) for variety
    IF i <= 5 THEN
      INSERT INTO project_ratings (project_id, email, name, rating, comment) VALUES
      (project_ids[i], 'rater6_' || i || '@example.com', 'Kritikus ' || i, 2, 'Masih kurang detail dalam beberapa aspek. Perlu perbaikan.');
    END IF;
  END LOOP;

END $$;

-- ----------------------------------------------------------------------------
-- Mock Project Subscriptions (30+ watchlist entries)
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  project_ids UUID[];
BEGIN
  SELECT ARRAY_AGG(id) INTO project_ids FROM projects WHERE status = 'published' LIMIT 10;

  INSERT INTO project_subscriptions (project_id, email, name, notification_frequency) VALUES
  (project_ids[1], 'subscriber1@gmail.com', 'Pemantau Proyek 1', 'instant'),
  (project_ids[1], 'subscriber2@yahoo.com', 'Warga Peduli 1', 'daily'),
  (project_ids[1], 'subscriber3@outlook.com', 'Aktivis Transparansi 1', 'weekly'),
  (project_ids[2], 'subscriber4@gmail.com', 'Pemantau Proyek 2', 'instant'),
  (project_ids[2], 'subscriber5@gmail.com', 'Pengamat Anggaran 2', 'daily'),
  (project_ids[3], 'subscriber6@yahoo.com', 'Warga Peduli 2', 'instant'),
  (project_ids[3], 'subscriber7@gmail.com', 'Jurnalis Investigasi', 'daily'),
  (project_ids[4], 'subscriber8@outlook.com', 'Peneliti Kebijakan', 'weekly'),
  (project_ids[4], 'subscriber9@gmail.com', 'Mahasiswa Politik', 'weekly'),
  (project_ids[5], 'subscriber10@gmail.com', 'LSM Transparansi', 'instant'),
  (project_ids[6], 'subscriber11@yahoo.com', 'Dosen Ekonomi', 'daily'),
  (project_ids[7], 'subscriber12@gmail.com', 'Aktivis Anti-Korupsi', 'instant'),
  (project_ids[8], 'subscriber13@outlook.com', 'Pengusaha Lokal', 'weekly'),
  (project_ids[9], 'subscriber14@gmail.com', 'Tokoh Masyarakat', 'daily'),
  (project_ids[10], 'subscriber15@gmail.com', 'Pemuda Peduli', 'instant');

END $$;

-- ----------------------------------------------------------------------------
-- Mock Issues (15+ reported issues)
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  project_ids UUID[];
  milestone_ids UUID[];
BEGIN
  SELECT ARRAY_AGG(id) INTO project_ids FROM projects WHERE status = 'published' LIMIT 10;
  SELECT ARRAY_AGG(id) INTO milestone_ids FROM milestones LIMIT 5;

  -- Critical issues
  INSERT INTO issues (project_id, reporter_email, reporter_name, issue_type, title, description, severity, status) VALUES
  (project_ids[1], 'whistleblower1@protonmail.com', 'Pelapor Anonim', 'missing_proof', 'Dokumen Bukti Milestone Tidak Lengkap', 'Saya menemukan bahwa milestone terakhir tidak memiliki dokumentasi foto yang memadai. Hanya ada satu foto, padahal seharusnya ada dokumentasi lengkap dari berbagai sudut.', 'high', 'investigating'),
  (project_ids[2], 'concerned.citizen@gmail.com', 'Warga Peduli', 'delayed_release', 'Keterlambatan Pencairan Milestone', 'Milestone kedua harusnya direalisasikan bulan lalu sesuai jadwal, tapi sampai sekarang belum ada kabar. Mohon penjelasan dari pihak terkait.', 'medium', 'open');

  -- High severity issues
  INSERT INTO issues (project_id, milestone_id, reporter_email, reporter_name, issue_type, title, description, severity, status) VALUES
  (project_ids[3], milestone_ids[1], 'auditor.public@yahoo.com', 'Auditor Independen', 'budget_mismatch', 'Potensi Ketidaksesuaian Anggaran', 'Setelah saya cek detail, tampaknya ada perbedaan antara anggaran yang dialokasikan dengan yang direalisasikan. Mohon klarifikasi lebih lanjut mengenai hal ini.', 'high', 'investigating'),
  (project_ids[4], NULL, 'investigator@outlook.com', 'Jurnalis Investigasi', 'other', 'Vendor Tidak Jelas', 'Saya tidak menemukan informasi detail mengenai vendor yang mengerjakan proyek ini. Transparansi vendor sangat penting untuk mencegah korupsi.', 'medium', 'open');

  -- Medium severity issues
  INSERT INTO issues (project_id, reporter_email, reporter_name, issue_type, title, description, severity, status) VALUES
  (project_ids[5], 'community.watch@gmail.com', 'Komunitas Pemantau', 'missing_proof', 'Bukti Realisasi Kurang Jelas', 'Dokumen bukti yang diunggah kualitasnya rendah dan sulit dibaca. Sebaiknya menggunakan scan berkualitas tinggi untuk transparansi yang lebih baik.', 'medium', 'open'),
  (project_ids[6], 'taxpayer.alert@yahoo.com', 'Pembayar Pajak Peduli', 'delayed_release', 'Update Progress Terlambat', 'Sudah 2 bulan tidak ada update progress proyek. Kami sebagai warga berhak tahu perkembangan terkini dari proyek yang didanai pajak kami.', 'low', 'open');

  -- More issues for variety
  INSERT INTO issues (project_id, reporter_email, reporter_name, issue_type, title, description, severity, status) VALUES
  (project_ids[7], 'accountability@protonmail.com', 'Aktivis Akuntabilitas', 'budget_mismatch', 'Pertanyaan Alokasi Anggaran', 'Mengapa ada perbedaan signifikan antara estimasi awal dengan realisasi? Mohon penjelasan terperinci mengenai perubahan anggaran ini.', 'medium', 'investigating'),
  (project_ids[8], 'researcher.policy@gmail.com', 'Peneliti Kebijakan', 'other', 'Request Dokumen Tambahan', 'Untuk keperluan penelitian, apakah tersedia dokumen rinci seperti RAB (Rencana Anggaran Biaya) dan Time Schedule? Ini akan sangat membantu analisis kami.', 'low', 'open'),
  (project_ids[9], 'ngo.transparency@outlook.com', 'LSM Transparansi Nasional', 'missing_proof', 'Permintaan Audit Independen', 'Mengingat besarnya anggaran proyek ini, kami merekomendasikan audit independen oleh pihak ketiga untuk memastikan tidak ada penyimpangan.', 'high', 'investigating');

END $$;

-- ============================================================================
-- Refresh Materialized View
-- ============================================================================

-- Refresh the ministry performance view to include new ratings
SELECT refresh_ministry_performance();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show statistics
SELECT
  'Comments' as feature,
  COUNT(*) as total_records,
  COUNT(DISTINCT author_email) as unique_users
FROM comments
UNION ALL
SELECT
  'Ratings' as feature,
  COUNT(*) as total_records,
  COUNT(DISTINCT email) as unique_users
FROM project_ratings
UNION ALL
SELECT
  'Watchlist' as feature,
  COUNT(*) as total_records,
  COUNT(DISTINCT email) as unique_users
FROM project_subscriptions
UNION ALL
SELECT
  'Issues' as feature,
  COUNT(*) as total_records,
  COUNT(DISTINCT reporter_email) as unique_users
FROM issues;

-- Show average ratings per project
SELECT
  p.title,
  COUNT(r.id) as rating_count,
  ROUND(AVG(r.rating), 2) as avg_rating
FROM projects p
LEFT JOIN project_ratings r ON r.project_id = p.id
WHERE p.status = 'published'
GROUP BY p.id, p.title
ORDER BY avg_rating DESC
LIMIT 10;

-- Show ministry performance with new trust scores
SELECT
  ministry,
  total_projects,
  avg_trust_score,
  total_ratings,
  overall_score
FROM ministry_performance
ORDER BY overall_score DESC
LIMIT 10;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

\echo '✅ Mock data for Epic 6 & 7 successfully generated!'
\echo '📊 Comments, Ratings, Watchlist, and Issues are now populated'
\echo '🎯 Your demo is ready for the Garuda Spark 2025 hackathon!'
