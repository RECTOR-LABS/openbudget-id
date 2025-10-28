-- OpenBudget.ID Seed Data Script
-- Generated from MOCK-DATA.md
-- Version: 1.0
-- Date: October 28, 2025
--
-- This script populates the database with 30 demo projects across 10 ministries
-- Total budget: IDR 2,395,000,000,000 (2.395 Trillion)
-- Total milestones: 125 (85 released, 40 pending)

BEGIN;

-- Clear existing data (cascades to projects and milestones)
TRUNCATE TABLE milestones CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE ministry_accounts CASCADE;

-- ============================================================================
-- MINISTRY ACCOUNTS (10 ministries)
-- ============================================================================

INSERT INTO ministry_accounts (id, google_id, email, ministry_name, wallet_address) VALUES
('11111111-1111-1111-1111-111111111111', 'mock-ministry-1@openbudget.demo', 'kemendikbudristek@kementerian.go.id', 'Kemendikbudristek', NULL),
('22222222-2222-2222-2222-222222222222', 'mock-ministry-2@openbudget.demo', 'kemenkes@kementerian.go.id', 'Kemenkes', NULL),
('33333333-3333-3333-3333-333333333333', 'mock-ministry-3@openbudget.demo', 'pupr@kementerian.go.id', 'PUPR', NULL),
('44444444-4444-4444-4444-444444444444', 'mock-ministry-4@openbudget.demo', 'kemenhub@kementerian.go.id', 'Kemenhub', NULL),
('55555555-5555-5555-5555-555555555555', 'mock-ministry-5@openbudget.demo', 'kementan@kementerian.go.id', 'Kementan', NULL),
('66666666-6666-6666-6666-666666666666', 'mock-ministry-6@openbudget.demo', 'esdm@kementerian.go.id', 'ESDM', NULL),
('77777777-7777-7777-7777-777777777777', 'mock-ministry-7@openbudget.demo', 'kemenkeu@kementerian.go.id', 'Kemenkeu', NULL),
('88888888-8888-8888-8888-888888888888', 'mock-ministry-8@openbudget.demo', 'kemendagri@kementerian.go.id', 'Kemendagri', NULL),
('99999999-9999-9999-9999-999999999999', 'mock-ministry-9@openbudget.demo', 'kemensos@kementerian.go.id', 'Kemensos', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mock-ministry-10@openbudget.demo', 'kominfo@kementerian.go.id', 'Kominfo', NULL);

-- ============================================================================
-- PROJECTS (30 projects, all published)
-- ============================================================================

-- Ministry 1: Kemendikbudristek (3 projects, IDR 150B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'PROJ2025001', 'Program Digitalisasi Sekolah Nasional 2025', 'Program digitalisasi untuk 1000 sekolah di seluruh Indonesia dengan pengadaan laptop, instalasi internet, pelatihan guru, dan platform e-learning nasional', 'PT Teknologi Pendidikan Indonesia', 75000000000, 75000000000, 60000000000, 'published', NULL, NULL, '2024-11-15 08:00:00'),
('10000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'PROJ2025002', 'Rehabilitasi Gedung Sekolah Terdampak Bencana', 'Rehabilitasi 250 sekolah yang terdampak bencana alam dengan perbaikan struktur bangunan, pengadaan furniture, dan sertifikasi keamanan', 'PT Karya Konstruksi Nusantara', 45000000000, 45000000000, 28000000000, 'published', NULL, NULL, '2024-12-01 09:30:00'),
('10000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'PROJ2025003', 'Beasiswa Penelitian Inovasi Teknologi', 'Program beasiswa penelitian untuk 500 mahasiswa pascasarjana di bidang teknologi dan inovasi', 'Konsorsium Universitas Riset Indonesia', 30000000000, 30000000000, 14000000000, 'published', NULL, NULL, '2024-12-10 10:00:00');

-- Ministry 2: Kemenkes (3 projects, IDR 255B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000002-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'PROJ2025004', 'Pembangunan Rumah Sakit Regional Jawa Tengah', 'Pembangunan rumah sakit modern berkapasitas 500 tempat tidur dengan fasilitas lengkap dan alat medis modern', 'PT Pembangunan Kesehatan Indonesia', 150000000000, 150000000000, 100000000000, 'published', NULL, NULL, '2024-10-20 08:30:00'),
('10000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'PROJ2025005', 'Program Vaksinasi Nasional 2025', 'Program vaksinasi massal untuk 50 juta penduduk dengan distribusi cold chain ke 34 provinsi', 'Bio Farma & Konsorsium Farmasi Nasional', 85000000000, 85000000000, 77000000000, 'published', NULL, NULL, '2024-11-05 09:00:00'),
('10000002-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'PROJ2025006', 'Digitalisasi Rekam Medis Puskesmas', 'Digitalisasi sistem rekam medis untuk 500 puskesmas di seluruh Indonesia dengan software SIMRS terintegrasi', 'PT Solusi Kesehatan Digital', 20000000000, 20000000000, 14000000000, 'published', NULL, NULL, '2024-12-15 10:30:00');

-- Ministry 3: PUPR (3 projects, IDR 355B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000003-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'PROJ2025007', 'Pembangunan Jalan Tol Trans Sumatera Segmen 5', 'Pembangunan jalan tol sepanjang 120 KM dengan 3 jembatan utama dan sistem tol elektronik', 'PT Hutama Karya (Persero)', 180000000000, 180000000000, 130000000000, 'published', NULL, NULL, '2024-09-10 08:00:00'),
('10000003-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'PROJ2025008', 'Rehabilitasi Irigasi 50,000 Hektar', 'Rehabilitasi sistem irigasi untuk 50,000 hektar lahan pertanian dengan perbaikan bendungan, saluran, dan pompa air', 'PT Waskita Karya', 55000000000, 55000000000, 47000000000, 'published', NULL, NULL, '2024-10-05 09:15:00'),
('10000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'PROJ2025009', 'Program Rumah Subsidi 10,000 Unit', 'Pembangunan 10,000 unit rumah subsidi di 15 lokasi dengan fasilitas infrastruktur lengkap', 'PT Perumnas (Persero)', 120000000000, 120000000000, 65000000000, 'published', NULL, NULL, '2024-11-01 10:00:00');

-- Ministry 4: Kemenhub (3 projects, IDR 195B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000004-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'PROJ2025010', 'Modernisasi Bandara Regional Kalimantan', 'Modernisasi bandara dengan perluasan runway 500 meter, renovasi terminal, dan upgrade sistem navigasi', 'PT Angkasa Pura II', 95000000000, 95000000000, 65000000000, 'published', NULL, NULL, '2024-10-15 08:30:00'),
('10000004-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'PROJ2025011', 'Pengadaan Bus Listrik Kota 200 Unit', 'Pengadaan 200 unit bus listrik dan pembangunan charging station untuk transportasi publik ramah lingkungan', 'PT Transportasi Jakarta', 60000000000, 60000000000, 42000000000, 'published', NULL, NULL, '2024-11-20 09:00:00'),
('10000004-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'PROJ2025012', 'Pembangunan Dermaga Penyeberangan', 'Pembangunan 3 dermaga penyeberangan modern dengan sistem tiket digital dan kapal ferry baru', 'PT Pelabuhan Indonesia', 40000000000, 40000000000, 28000000000, 'published', NULL, NULL, '2024-12-05 10:15:00');

-- Ministry 5: Kementan (3 projects, IDR 130B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000005-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'PROJ2025013', 'Program Swasembada Pangan Nasional', 'Program swasembada pangan dengan distribusi bibit unggul, subsidi pupuk, pembangunan gudang pangan, dan asuransi gagal panen', 'Konsorsium Petani Indonesia', 70000000000, 70000000000, 60000000000, 'published', NULL, NULL, '2024-09-25 08:00:00'),
('10000005-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'PROJ2025014', 'Modernisasi Pertanian dengan IoT', 'Modernisasi pertanian menggunakan sensor IoT untuk monitoring lahan 11,000 hektar dengan platform data pertanian', 'PT Agritech Innovation', 35000000000, 35000000000, 20000000000, 'published', NULL, NULL, '2024-10-30 09:30:00'),
('10000005-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'PROJ2025015', 'Revitalisasi Perkebunan Kopi Nusantara', 'Revitalisasi perkebunan kopi dengan peremajaan tanaman 5000 hektar, pelatihan petani, dan sertifikasi organik', 'PT Perkebunan Nusantara IX', 25000000000, 25000000000, 15000000000, 'published', NULL, NULL, '2024-11-25 10:00:00');

-- Ministry 6: ESDM (3 projects, IDR 335B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000006-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666666', 'PROJ2025016', 'Pembangkit Listrik Tenaga Surya 100 MW', 'Pembangunan pembangkit listrik tenaga surya berkapasitas 100 MW dengan 200,000 panel surya dan interkoneksi grid', 'PT PLN (Persero)', 200000000000, 200000000000, 160000000000, 'published', NULL, NULL, '2024-09-05 08:30:00'),
('10000006-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666', 'PROJ2025017', 'Eksplorasi Panas Bumi Sumatera Barat', 'Eksplorasi dan pengembangan panas bumi dengan potensi 250 MW melalui survey geologi dan pengeboran sumur', 'PT Pertamina Geothermal Energy', 85000000000, 85000000000, 55000000000, 'published', NULL, NULL, '2024-10-10 09:00:00'),
('10000006-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666', 'PROJ2025018', 'Program Konversi Energi Hijau Industri', 'Program konversi energi hijau untuk 500 pabrik dengan audit energi, subsidi panel surya, dan pelatihan energy manager', 'Asosiasi Industri Manufaktur', 50000000000, 50000000000, 30000000000, 'published', NULL, NULL, '2024-11-10 10:30:00');

-- Ministry 7: Kemenkeu (3 projects, IDR 215B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000007-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777', 'PROJ2025019', 'Modernisasi Sistem Pajak Digital (Core Tax)', 'Modernisasi sistem perpajakan dengan software Core Tax, data center Tier 3, dan migrasi 15 juta wajib pajak', 'Direktorat Jenderal Pajak', 120000000000, 120000000000, 100000000000, 'published', NULL, NULL, '2024-09-15 08:00:00'),
('10000007-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777', 'PROJ2025020', 'Program Literasi Keuangan Nasional', 'Program literasi keuangan untuk 500 ribu peserta di 34 provinsi dengan platform digital edukasi dan sertifikasi', 'Otoritas Jasa Keuangan', 30000000000, 30000000000, 17000000000, 'published', NULL, NULL, '2024-10-25 09:30:00'),
('10000007-0000-0000-0000-000000000003', '77777777-7777-7777-7777-777777777777', 'PROJ2025021', 'Integrasi Sistem Keuangan Daerah (SIKD)', 'Integrasi sistem keuangan daerah untuk 34 provinsi dengan pilot project 10 provinsi dan integrasi SPAN', 'PT Bahana Pembinaan Usaha Indonesia', 65000000000, 65000000000, 33000000000, 'published', NULL, NULL, '2024-11-15 10:00:00');

-- Ministry 8: Kemendagri (3 projects, IDR 235B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000008-0000-0000-0000-000000000001', '88888888-8888-8888-8888-888888888888', 'PROJ2025022', 'Implementasi Smart City 15 Kota', 'Implementasi smart city untuk 15 kota dengan infrastruktur IoT, command center, dan aplikasi layanan publik', 'Konsorsium Smart City Indonesia', 110000000000, 110000000000, 85000000000, 'published', NULL, NULL, '2024-09-20 08:30:00'),
('10000008-0000-0000-0000-000000000002', '88888888-8888-8888-8888-888888888888', 'PROJ2025023', 'Program e-KTP dan Kependudukan Digital', 'Program e-KTP untuk 50 juta penduduk dengan upgrade sistem Dukcapil dan implementasi mobile ID', 'PT Len Industri (Persero)', 80000000000, 80000000000, 50000000000, 'published', NULL, NULL, '2024-10-20 09:00:00'),
('10000008-0000-0000-0000-000000000003', '88888888-8888-8888-8888-888888888888', 'PROJ2025024', 'Pembangunan Kantor Kecamatan 200 Lokasi', 'Pembangunan 200 kantor kecamatan dengan desain standar dan fasilitas lengkap', 'PT Brantas Abipraya', 45000000000, 45000000000, 25000000000, 'published', NULL, NULL, '2024-11-30 10:15:00');

-- Ministry 9: Kemensos (3 projects, IDR 245B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000009-0000-0000-0000-000000000001', '99999999-9999-9999-9999-999999999999', 'PROJ2025025', 'Program Bantuan Sosial Tunai 10 Juta KK', 'Program bantuan sosial tunai untuk 10 juta kepala keluarga dengan pencairan triwulanan', 'PT Pos Indonesia (Persero)', 150000000000, 150000000000, 105000000000, 'published', NULL, NULL, '2024-10-01 08:00:00'),
('10000009-0000-0000-0000-000000000002', '99999999-9999-9999-9999-999999999999', 'PROJ2025026', 'Pembangunan Panti Sosial Terpadu 20 Lokasi', 'Pembangunan 20 panti sosial terpadu dengan fasilitas lengkap dan rekrutmen pendamping sosial', 'Yayasan Sosial Indonesia', 60000000000, 60000000000, 45000000000, 'published', NULL, NULL, '2024-10-28 09:30:00'),
('10000009-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999999', 'PROJ2025027', 'Program Pelatihan Keterampilan Disabilitas', 'Program pelatihan keterampilan untuk 10,000 penyandang disabilitas dengan pembangunan pusat pelatihan', 'Konsorsium Lembaga Pelatihan Vokasi', 35000000000, 35000000000, 28000000000, 'published', NULL, NULL, '2024-11-18 10:00:00');

-- Ministry 10: Kominfo (3 projects, IDR 265B total)

INSERT INTO projects (id, ministry_id, blockchain_id, title, description, recipient_name, total_amount, total_allocated, total_released, status, solana_account, creation_tx, created_at) VALUES
('10000010-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PROJ2025028', 'Pembangunan Palapa Ring Timur', 'Pembangunan infrastruktur fiber optik bawah laut sepanjang 2500 KM dengan 100 BTS di Indonesia Timur', 'PT Telkom Indonesia', 135000000000, 135000000000, 118000000000, 'published', NULL, NULL, '2024-09-01 08:00:00'),
('10000010-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PROJ2025029', 'Program Literasi Digital 50 Juta Warga', 'Program literasi digital untuk 50 juta warga dengan platform edukasi, rekrutmen fasilitator, dan sertifikasi kompetensi', 'Gerakan Nasional Literasi Digital', 40000000000, 40000000000, 28000000000, 'published', NULL, NULL, '2024-10-12 09:15:00'),
('10000010-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PROJ2025030', 'Sistem Keamanan Siber Nasional', 'Pembangunan Security Operation Center nasional dengan security tools, pelatihan tim respons insiden, dan threat intelligence', 'Badan Siber dan Sandi Negara', 90000000000, 90000000000, 68000000000, 'published', NULL, NULL, '2024-11-08 10:30:00');

-- ============================================================================
-- MILESTONES (125 milestones: 85 released, 40 pending)
-- ============================================================================

-- Project 1: Program Digitalisasi Sekolah Nasional 2025 (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000001-0000-0000-0000-000000000001', 0, 'Pengadaan Laptop untuk 1000 Sekolah', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025001-M0-laptop-batch1.pdf', '2024-12-15 10:00:00'),
('10000001-0000-0000-0000-000000000001', 1, 'Instalasi Jaringan Internet', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025001-M1-fiber-optic.pdf', '2025-01-10 11:00:00'),
('10000001-0000-0000-0000-000000000001', 2, 'Pelatihan Guru Digital', 20000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025001-M2-teacher-training.pdf', '2025-02-05 09:30:00'),
('10000001-0000-0000-0000-000000000001', 3, 'Platform E-Learning Nasional', 10000000000, FALSE, NULL, NULL, NULL),
('10000001-0000-0000-0000-000000000001', 4, 'Monitoring dan Evaluasi', 5000000000, FALSE, NULL, NULL, NULL);

-- Project 2: Rehabilitasi Gedung Sekolah Terdampak Bencana (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000001-0000-0000-0000-000000000002', 0, 'Survey dan Penilaian Kerusakan', 3000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025002-M0-survey-250-schools.pdf', '2024-12-20 08:00:00'),
('10000001-0000-0000-0000-000000000002', 1, 'Perbaikan Struktur Bangunan', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025002-M1-construction-60pct.pdf', '2025-02-10 14:00:00'),
('10000001-0000-0000-0000-000000000002', 2, 'Pengadaan Meubelair Baru', 10000000000, FALSE, NULL, NULL, NULL),
('10000001-0000-0000-0000-000000000002', 3, 'Sertifikasi Keamanan Bangunan', 7000000000, FALSE, NULL, NULL, NULL);

-- Project 3: Beasiswa Penelitian Inovasi Teknologi (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000001-0000-0000-0000-000000000003', 0, 'Seleksi dan Pendaftaran', 2000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025003-M0-500-recipients.pdf', '2025-01-05 09:00:00'),
('10000001-0000-0000-0000-000000000003', 1, 'Pencairan Dana Semester 1', 12000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025003-M1-bank-transfer.pdf', '2025-02-15 10:30:00'),
('10000001-0000-0000-0000-000000000003', 2, 'Pencairan Dana Semester 2', 12000000000, FALSE, NULL, NULL, NULL),
('10000001-0000-0000-0000-000000000003', 3, 'Publikasi Hasil Penelitian', 4000000000, FALSE, NULL, NULL, NULL);

-- Project 4: Pembangunan Rumah Sakit Regional Jawa Tengah (5 milestones: 2 released, 3 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000002-0000-0000-0000-000000000001', 0, 'Pembebasan Lahan dan Perizinan', 20000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025004-M0-land-certificate.pdf', '2024-11-15 08:30:00'),
('10000002-0000-0000-0000-000000000001', 1, 'Konstruksi Gedung Utama', 80000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025004-M1-construction-75pct.pdf', '2025-01-20 15:00:00'),
('10000002-0000-0000-0000-000000000001', 2, 'Pengadaan Alat Medis', 35000000000, FALSE, NULL, NULL, NULL),
('10000002-0000-0000-0000-000000000001', 3, 'Rekrutmen dan Pelatihan SDM', 10000000000, FALSE, NULL, NULL, NULL),
('10000002-0000-0000-0000-000000000001', 4, 'Uji Coba Operasional', 5000000000, FALSE, NULL, NULL, NULL);

-- Project 5: Program Vaksinasi Nasional 2025 (4 milestones: 3 released, 1 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000002-0000-0000-0000-000000000002', 0, 'Pengadaan Vaksin', 50000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025005-M0-biofarma-contract.pdf', '2024-11-20 09:00:00'),
('10000002-0000-0000-0000-000000000002', 1, 'Distribusi Cold Chain', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025005-M1-34-provinces.pdf', '2024-12-10 11:00:00'),
('10000002-0000-0000-0000-000000000002', 2, 'Pelaksanaan Vaksinasi Fase 1', 12000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025005-M2-10M-vaccinated.pdf', '2025-01-15 14:30:00'),
('10000002-0000-0000-0000-000000000002', 3, 'Pelaksanaan Vaksinasi Fase 2', 8000000000, FALSE, NULL, NULL, NULL);

-- Project 6: Digitalisasi Rekam Medis Puskesmas (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000002-0000-0000-0000-000000000003', 0, 'Pengembangan Software SIMRS', 8000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025006-M0-simrs-v2.pdf', '2025-01-05 10:00:00'),
('10000002-0000-0000-0000-000000000003', 1, 'Pengadaan Hardware dan Server', 6000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025006-M1-500-units.pdf', '2025-02-01 11:30:00'),
('10000002-0000-0000-0000-000000000003', 2, 'Pelatihan Tenaga Kesehatan', 4000000000, FALSE, NULL, NULL, NULL),
('10000002-0000-0000-0000-000000000003', 3, 'Implementasi dan Integrasi', 2000000000, FALSE, NULL, NULL, NULL);

-- Project 7: Pembangunan Jalan Tol Trans Sumatera Segmen 5 (5 milestones: 2 released, 3 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000003-0000-0000-0000-000000000001', 0, 'Pembebasan Lahan 120 KM', 40000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025007-M0-land-cert.pdf', '2024-10-15 08:00:00'),
('10000003-0000-0000-0000-000000000001', 1, 'Konstruksi Jalan dan Jembatan', 90000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025007-M1-construction-50pct.pdf', '2025-01-25 15:00:00'),
('10000003-0000-0000-0000-000000000001', 2, 'Instalasi Sistem Tol Elektronik', 25000000000, FALSE, NULL, NULL, NULL),
('10000003-0000-0000-0000-000000000001', 3, 'Pembangunan Rest Area', 15000000000, FALSE, NULL, NULL, NULL),
('10000003-0000-0000-0000-000000000001', 4, 'Uji Laik Fungsi', 10000000000, FALSE, NULL, NULL, NULL);

-- Project 8: Rehabilitasi Irigasi 50,000 Hektar (4 milestones: 3 released, 1 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000003-0000-0000-0000-000000000002', 0, 'Survey dan Desain Teknis', 5000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025008-M0-100-locations.pdf', '2024-10-25 09:00:00'),
('10000003-0000-0000-0000-000000000002', 1, 'Perbaikan Bendungan dan Saluran', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025008-M1-progress-70pct.pdf', '2024-12-20 14:00:00'),
('10000003-0000-0000-0000-000000000002', 2, 'Pembangunan Pompa Air', 12000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025008-M2-50-pumps.pdf', '2025-01-30 10:30:00'),
('10000003-0000-0000-0000-000000000002', 3, 'Pelatihan Kelompok Tani', 8000000000, FALSE, NULL, NULL, NULL);

-- Project 9: Program Rumah Subsidi 10,000 Unit (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000003-0000-0000-0000-000000000003', 0, 'Akuisisi Lahan di 15 Lokasi', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025009-M0-150-hectares.pdf', '2024-11-20 08:30:00'),
('10000003-0000-0000-0000-000000000003', 1, 'Konstruksi Batch 1 (3000 Unit)', 40000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025009-M1-2500-units.pdf', '2025-02-10 15:30:00'),
('10000003-0000-0000-0000-000000000003', 2, 'Konstruksi Batch 2 (4000 Unit)', 45000000000, FALSE, NULL, NULL, NULL),
('10000003-0000-0000-0000-000000000003', 3, 'Konstruksi Batch 3 (3000 Unit)', 10000000000, FALSE, NULL, NULL, NULL);

-- Project 10: Modernisasi Bandara Regional Kalimantan (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000004-0000-0000-0000-000000000001', 0, 'Perluasan Runway 500 Meter', 35000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025010-M0-airworthy-cert.pdf', '2024-11-10 09:00:00'),
('10000004-0000-0000-0000-000000000001', 1, 'Renovasi Terminal Penumpang', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025010-M1-terminal-2x.pdf', '2025-01-20 14:00:00'),
('10000004-0000-0000-0000-000000000001', 2, 'Upgrade Sistem Navigasi', 20000000000, FALSE, NULL, NULL, NULL),
('10000004-0000-0000-0000-000000000001', 3, 'Pembangunan Cargo Terminal', 10000000000, FALSE, NULL, NULL, NULL);

-- Project 11: Pengadaan Bus Listrik Kota 200 Unit (4 milestones: 3 released, 1 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000004-0000-0000-0000-000000000002', 0, 'Tender dan Kontrak', 2000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025011-M0-byd-contract.pdf', '2024-12-01 08:00:00'),
('10000004-0000-0000-0000-000000000002', 1, 'Pengadaan Bus Batch 1 (100 Unit)', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025011-M1-100-buses.pdf', '2025-01-15 13:00:00'),
('10000004-0000-0000-0000-000000000002', 2, 'Pembangunan Charging Station', 10000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025011-M2-20-stations.pdf', '2025-02-05 10:00:00'),
('10000004-0000-0000-0000-000000000002', 3, 'Pengadaan Bus Batch 2 (100 Unit)', 18000000000, FALSE, NULL, NULL, NULL);

-- Project 12: Pembangunan Dermaga Penyeberangan (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000004-0000-0000-0000-000000000003', 0, 'Desain dan Perizinan', 3000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025012-M0-permits.pdf', '2024-12-15 09:00:00'),
('10000004-0000-0000-0000-000000000003', 1, 'Konstruksi Dermaga 3 Lokasi', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025012-M1-operational.pdf', '2025-02-01 14:30:00'),
('10000004-0000-0000-0000-000000000003', 2, 'Pengadaan Kapal Ferry', 10000000000, FALSE, NULL, NULL, NULL),
('10000004-0000-0000-0000-000000000003', 3, 'Sistem Tiket Digital', 2000000000, FALSE, NULL, NULL, NULL);

-- Project 13: Program Swasembada Pangan Nasional (4 milestones: 3 released, 1 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000005-0000-0000-0000-000000000001', 0, 'Distribusi Bibit Unggul', 20000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025013-M0-1M-hectares.pdf', '2024-10-15 08:00:00'),
('10000005-0000-0000-0000-000000000001', 1, 'Subsidi Pupuk dan Alsintan', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025013-M1-subsidy-transfer.pdf', '2024-11-20 10:00:00'),
('10000005-0000-0000-0000-000000000001', 2, 'Pembangunan Gudang Pangan', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025013-M2-50-warehouses.pdf', '2025-01-10 11:30:00'),
('10000005-0000-0000-0000-000000000001', 3, 'Asuransi Gagal Panen', 10000000000, FALSE, NULL, NULL, NULL);

-- Project 14: Modernisasi Pertanian dengan IoT (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000005-0000-0000-0000-000000000002', 0, 'Riset dan Pengembangan Sensor', 8000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025014-M0-iot-prototype.pdf', '2024-11-15 09:00:00'),
('10000005-0000-0000-0000-000000000002', 1, 'Pilot Project 1000 Hektar', 12000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025014-M1-30pct-increase.pdf', '2025-01-05 13:00:00'),
('10000005-0000-0000-0000-000000000002', 2, 'Ekspansi 10,000 Hektar', 12000000000, FALSE, NULL, NULL, NULL),
('10000005-0000-0000-0000-000000000002', 3, 'Platform Data Pertanian', 3000000000, FALSE, NULL, NULL, NULL);

-- Project 15: Revitalisasi Perkebunan Kopi Nusantara (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000005-0000-0000-0000-000000000003', 0, 'Peremajaan Tanaman Kopi', 10000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025015-M0-5000-hectares.pdf', '2024-12-05 08:30:00'),
('10000005-0000-0000-0000-000000000003', 1, 'Pelatihan Petani Kopi', 5000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025015-M1-2000-farmers.pdf', '2025-01-15 10:00:00'),
('10000005-0000-0000-0000-000000000003', 2, 'Pembangunan Pabrik Pengolahan', 8000000000, FALSE, NULL, NULL, NULL),
('10000005-0000-0000-0000-000000000003', 3, 'Sertifikasi Organik Internasional', 2000000000, FALSE, NULL, NULL, NULL);

-- Project 16: Pembangkit Listrik Tenaga Surya 100 MW (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000006-0000-0000-0000-000000000001', 0, 'Studi Kelayakan dan Desain', 10000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025016-M0-amdal.pdf', '2024-10-01 08:00:00'),
('10000006-0000-0000-0000-000000000001', 1, 'Pengadaan Panel Surya', 100000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025016-M1-200k-panels.pdf', '2024-12-15 14:00:00'),
('10000006-0000-0000-0000-000000000001', 2, 'Konstruksi Infrastruktur', 50000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025016-M2-progress-80pct.pdf', '2025-02-01 15:30:00'),
('10000006-0000-0000-0000-000000000001', 3, 'Interkoneksi Grid', 30000000000, FALSE, NULL, NULL, NULL),
('10000006-0000-0000-0000-000000000001', 4, 'Commissioning', 10000000000, FALSE, NULL, NULL, NULL);

-- Project 17: Eksplorasi Panas Bumi Sumatera Barat (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000006-0000-0000-0000-000000000002', 0, 'Survey Geologi dan Geofisika', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025017-M0-250mw-potential.pdf', '2024-10-25 09:00:00'),
('10000006-0000-0000-0000-000000000002', 1, 'Pengeboran Sumur Eksplorasi', 40000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025017-M1-3-wells.pdf', '2025-01-10 13:00:00'),
('10000006-0000-0000-0000-000000000002', 2, 'Studi Dampak Lingkungan', 8000000000, FALSE, NULL, NULL, NULL),
('10000006-0000-0000-0000-000000000002', 3, 'Pembangunan Pembangkit', 22000000000, FALSE, NULL, NULL, NULL);

-- Project 18: Program Konversi Energi Hijau Industri (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000006-0000-0000-0000-000000000003', 0, 'Audit Energi 500 Pabrik', 5000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025018-M0-energy-audit.pdf', '2024-11-25 08:00:00'),
('10000006-0000-0000-0000-000000000003', 1, 'Subsidi Panel Surya Industri', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025018-M1-100-factories.pdf', '2025-01-20 12:00:00'),
('10000006-0000-0000-0000-000000000003', 2, 'Pelatihan Energy Manager', 10000000000, FALSE, NULL, NULL, NULL),
('10000006-0000-0000-0000-000000000003', 3, 'Monitoring dan Verifikasi', 10000000000, FALSE, NULL, NULL, NULL);

-- Project 19: Modernisasi Sistem Pajak Digital (Core Tax) (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000007-0000-0000-0000-000000000001', 0, 'Pengembangan Software Core Tax', 50000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025019-M0-coretax-demo.pdf', '2024-10-10 08:00:00'),
('10000007-0000-0000-0000-000000000001', 1, 'Infrastruktur Data Center', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025019-M1-tier3-dc.pdf', '2024-11-25 14:00:00'),
('10000007-0000-0000-0000-000000000001', 2, 'Migrasi Data Wajib Pajak', 20000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025019-M2-15M-taxpayers.pdf', '2025-01-15 11:30:00'),
('10000007-0000-0000-0000-000000000001', 3, 'Pelatihan Pegawai DJP', 12000000000, FALSE, NULL, NULL, NULL),
('10000007-0000-0000-0000-000000000001', 4, 'Sosialisasi Nasional', 8000000000, FALSE, NULL, NULL, NULL);

-- Project 20: Program Literasi Keuangan Nasional (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000007-0000-0000-0000-000000000002', 0, 'Pengembangan Konten Edukasi', 5000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025020-M0-100-modules.pdf', '2024-11-10 09:00:00'),
('10000007-0000-0000-0000-000000000002', 1, 'Roadshow 34 Provinsi', 12000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025020-M1-500k-participants.pdf', '2025-01-25 13:00:00'),
('10000007-0000-0000-0000-000000000002', 2, 'Platform Digital Edukasi', 8000000000, FALSE, NULL, NULL, NULL),
('10000007-0000-0000-0000-000000000002', 3, 'Sertifikasi Perencana Keuangan', 5000000000, FALSE, NULL, NULL, NULL);

-- Project 21: Integrasi Sistem Keuangan Daerah (SIKD) (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000007-0000-0000-0000-000000000003', 0, 'Desain dan Arsitektur Sistem', 8000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025021-M0-sikd-blueprint.pdf', '2024-12-01 08:30:00'),
('10000007-0000-0000-0000-000000000003', 1, 'Pilot Project 10 Provinsi', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025021-M1-10-provinces.pdf', '2025-02-05 14:00:00'),
('10000007-0000-0000-0000-000000000003', 2, 'Rollout 24 Provinsi', 25000000000, FALSE, NULL, NULL, NULL),
('10000007-0000-0000-0000-000000000003', 3, 'Integrasi dengan SPAN', 7000000000, FALSE, NULL, NULL, NULL);

-- Project 22: Implementasi Smart City 15 Kota (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000008-0000-0000-0000-000000000001', 0, 'Master Plan Smart City', 10000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025022-M0-15-cities-blueprint.pdf', '2024-10-05 08:00:00'),
('10000008-0000-0000-0000-000000000001', 1, 'Infrastruktur IoT dan Sensor', 40000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025022-M1-5000-sensors.pdf', '2024-12-15 14:00:00'),
('10000008-0000-0000-0000-000000000001', 2, 'Command Center Terintegrasi', 35000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025022-M2-10-centers.pdf', '2025-01-30 15:30:00'),
('10000008-0000-0000-0000-000000000001', 3, 'Aplikasi Layanan Publik', 18000000000, FALSE, NULL, NULL, NULL),
('10000008-0000-0000-0000-000000000001', 4, 'Pelatihan SDM Pemda', 7000000000, FALSE, NULL, NULL, NULL);

-- Project 23: Program e-KTP dan Kependudukan Digital (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000008-0000-0000-0000-000000000002', 0, 'Produksi e-KTP 50 Juta', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025023-M0-45M-distributed.pdf', '2024-11-05 09:00:00'),
('10000008-0000-0000-0000-000000000002', 1, 'Upgrade Sistem Dukcapil', 20000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025023-M1-34-provinces.pdf', '2025-01-10 13:00:00'),
('10000008-0000-0000-0000-000000000002', 2, 'Implementasi Mobile ID', 18000000000, FALSE, NULL, NULL, NULL),
('10000008-0000-0000-0000-000000000002', 3, 'Integrasi Biometrik', 12000000000, FALSE, NULL, NULL, NULL);

-- Project 24: Pembangunan Kantor Kecamatan 200 Lokasi (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000008-0000-0000-0000-000000000003', 0, 'Desain Standar dan Perizinan', 3000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025024-M0-standard-design.pdf', '2024-12-10 08:00:00'),
('10000008-0000-0000-0000-000000000003', 1, 'Konstruksi Fase 1 (100 Unit)', 22000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025024-M1-80-offices.pdf', '2025-02-15 14:30:00'),
('10000008-0000-0000-0000-000000000003', 2, 'Konstruksi Fase 2 (100 Unit)', 18000000000, FALSE, NULL, NULL, NULL),
('10000008-0000-0000-0000-000000000003', 3, 'Pengadaan Furniture', 2000000000, FALSE, NULL, NULL, NULL);

-- Project 25: Program Bantuan Sosial Tunai 10 Juta KK (4 milestones: 3 released, 1 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000009-0000-0000-0000-000000000001', 0, 'Verifikasi dan Validasi Data', 5000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025025-M0-10M-validated.pdf', '2024-10-15 08:00:00'),
('10000009-0000-0000-0000-000000000001', 1, 'Pencairan Triwulan 1', 50000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025025-M1-bank-transfer.pdf', '2024-11-25 10:00:00'),
('10000009-0000-0000-0000-000000000001', 2, 'Pencairan Triwulan 2', 50000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025025-M2-disbursement.pdf', '2025-01-20 11:00:00'),
('10000009-0000-0000-0000-000000000001', 3, 'Pencairan Triwulan 3', 45000000000, FALSE, NULL, NULL, NULL);

-- Project 26: Pembangunan Panti Sosial Terpadu 20 Lokasi (4 milestones: 2 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000009-0000-0000-0000-000000000002', 0, 'Akuisisi Lahan', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025026-M0-20-locations.pdf', '2024-11-15 09:00:00'),
('10000009-0000-0000-0000-000000000002', 1, 'Konstruksi Gedung', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025026-M1-15-completed.pdf', '2025-02-05 14:00:00'),
('10000009-0000-0000-0000-000000000002', 2, 'Pengadaan Peralatan', 10000000000, FALSE, NULL, NULL, NULL),
('10000009-0000-0000-0000-000000000002', 3, 'Rekrutmen Pendamping Sosial', 5000000000, FALSE, NULL, NULL, NULL);

-- Project 27: Program Pelatihan Keterampilan Disabilitas (4 milestones: 3 released, 1 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000009-0000-0000-0000-000000000003', 0, 'Pengembangan Kurikulum', 3000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025027-M0-20-modules.pdf', '2024-12-01 08:30:00'),
('10000009-0000-0000-0000-000000000003', 1, 'Pembangunan Pusat Pelatihan', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025027-M1-10-centers.pdf', '2025-01-15 13:00:00'),
('10000009-0000-0000-0000-000000000003', 2, 'Pelaksanaan Pelatihan Batch 1', 10000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025027-M2-5000-graduates.pdf', '2025-02-10 10:30:00'),
('10000009-0000-0000-0000-000000000003', 3, 'Pelaksanaan Pelatihan Batch 2', 7000000000, FALSE, NULL, NULL, NULL);

-- Project 28: Pembangunan Palapa Ring Timur (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000010-0000-0000-0000-000000000001', 0, 'Survey dan Desain Rute', 8000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025028-M0-2500km-route.pdf', '2024-09-20 08:00:00'),
('10000010-0000-0000-0000-000000000001', 1, 'Instalasi Fiber Optik Bawah Laut', 80000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025028-M1-1800km-installed.pdf', '2024-12-10 14:00:00'),
('10000010-0000-0000-0000-000000000001', 2, 'Pembangunan BTS 100 Lokasi', 30000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025028-M2-75-bts.pdf', '2025-01-25 15:00:00'),
('10000010-0000-0000-0000-000000000001', 3, 'Testing dan Commissioning', 12000000000, FALSE, NULL, NULL, NULL),
('10000010-0000-0000-0000-000000000001', 4, 'Operasional Tahun Pertama', 5000000000, FALSE, NULL, NULL, NULL);

-- Project 29: Program Literasi Digital 50 Juta Warga (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000010-0000-0000-0000-000000000002', 0, 'Pengembangan Platform Edukasi', 8000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025029-M0-platform.pdf', '2024-10-25 09:00:00'),
('10000010-0000-0000-0000-000000000002', 1, 'Rekrutmen Fasilitator 10,000 Orang', 5000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025029-M1-facilitators.pdf', '2024-11-30 10:30:00'),
('10000010-0000-0000-0000-000000000002', 2, 'Pelaksanaan Pelatihan Fase 1', 15000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025029-M2-30M-participants.pdf', '2025-01-20 13:00:00'),
('10000010-0000-0000-0000-000000000002', 3, 'Pelaksanaan Pelatihan Fase 2', 10000000000, FALSE, NULL, NULL, NULL),
('10000010-0000-0000-0000-000000000002', 4, 'Sertifikasi Kompetensi Digital', 2000000000, FALSE, NULL, NULL, NULL);

-- Project 30: Sistem Keamanan Siber Nasional (5 milestones: 3 released, 2 pending)
INSERT INTO milestones (project_id, index, description, amount, is_released, release_tx, proof_url, released_at) VALUES
('10000010-0000-0000-0000-000000000003', 0, 'Pembangunan Security Operation Center', 35000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025030-M0-soc-operational.pdf', '2024-11-20 08:00:00'),
('10000010-0000-0000-0000-000000000003', 1, 'Pengadaan Security Tools', 25000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025030-M1-firewall-ids.pdf', '2025-01-05 12:00:00'),
('10000010-0000-0000-0000-000000000003', 2, 'Pelatihan Tim Respons Insiden', 8000000000, TRUE, NULL, 'https://proof.openbudget.id/PROJ2025030-M2-500-analysts.pdf', '2025-02-01 10:00:00'),
('10000010-0000-0000-0000-000000000003', 3, 'Implementasi Threat Intelligence', 15000000000, FALSE, NULL, NULL, NULL),
('10000010-0000-0000-0000-000000000003', 4, 'Audit Keamanan Infrastruktur Kritis', 7000000000, FALSE, NULL, NULL, NULL);

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES (Optional - comment out in production)
-- ============================================================================

-- Verify ministry count
-- SELECT 'Ministries' as entity, COUNT(*) as count FROM ministry_accounts;

-- Verify project count and total budget
-- SELECT 'Projects' as entity, COUNT(*) as count, SUM(total_amount) as total_budget FROM projects;

-- Verify milestone count and status
-- SELECT
--     'Milestones' as entity,
--     COUNT(*) as total,
--     SUM(CASE WHEN is_released THEN 1 ELSE 0 END) as released,
--     SUM(CASE WHEN NOT is_released THEN 1 ELSE 0 END) as pending
-- FROM milestones;

-- Verify budget allocations match
-- SELECT
--     p.blockchain_id,
--     p.title,
--     p.total_amount as project_budget,
--     p.total_allocated,
--     p.total_released,
--     SUM(m.amount) as milestones_sum,
--     SUM(CASE WHEN m.is_released THEN m.amount ELSE 0 END) as released_sum
-- FROM projects p
-- LEFT JOIN milestones m ON p.id = m.project_id
-- GROUP BY p.id, p.blockchain_id, p.title, p.total_amount, p.total_allocated, p.total_released
-- HAVING p.total_allocated != SUM(m.amount) OR p.total_released != SUM(CASE WHEN m.is_released THEN m.amount ELSE 0 END);
