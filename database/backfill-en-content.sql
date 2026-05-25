-- 2026-05-25: Backfill English content for bilingual support
-- Translations are hand-curated for accuracy on government entity names
--
-- Strategy: Match by source Indonesian value (e.g., ministry_name) rather than UUID,
-- so the script is portable across local + Neon production DBs.

BEGIN;

-- ============================================================================
-- ministry_accounts.ministry_name_en
-- NOTE: seed.sql uses short abbreviations (Kemendikbudristek, Kemenkes, etc.)
-- as ministry_name. We match on those abbreviations, not the full form used
-- in the backfill template above which assumed full names. The full ministry
-- names are stored in projects.recipient_name instead.
-- ============================================================================

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Education, Culture, Research, and Technology'
  WHERE ministry_name = 'Kemendikbudristek';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Health'
  WHERE ministry_name = 'Kemenkes';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Public Works and Public Housing'
  WHERE ministry_name = 'PUPR';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Transportation'
  WHERE ministry_name = 'Kemenhub';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Agriculture'
  WHERE ministry_name = 'Kementan';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Energy and Mineral Resources'
  WHERE ministry_name = 'ESDM';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Finance'
  WHERE ministry_name = 'Kemenkeu';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Home Affairs'
  WHERE ministry_name = 'Kemendagri';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Social Affairs'
  WHERE ministry_name = 'Kemensos';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Communication and Digital Affairs'
  WHERE ministry_name = 'Kominfo';

-- ============================================================================
-- projects.recipient_name_en — mirrors the recipient (executing entity) names
-- These are the actual contractor/agency names stored in recipient_name.
-- ============================================================================

UPDATE projects SET recipient_name_en = 'PT Technology Education Indonesia'
  WHERE recipient_name = 'PT Teknologi Pendidikan Indonesia';

UPDATE projects SET recipient_name_en = 'PT Karya Konstruksi Nusantara'
  WHERE recipient_name = 'PT Karya Konstruksi Nusantara';

UPDATE projects SET recipient_name_en = 'Consortium of Indonesian Research Universities'
  WHERE recipient_name = 'Konsorsium Universitas Riset Indonesia';

UPDATE projects SET recipient_name_en = 'PT Healthcare Development Indonesia'
  WHERE recipient_name = 'PT Pembangunan Kesehatan Indonesia';

UPDATE projects SET recipient_name_en = 'Bio Farma & National Pharmaceutical Consortium'
  WHERE recipient_name = 'Bio Farma & Konsorsium Farmasi Nasional';

UPDATE projects SET recipient_name_en = 'PT Digital Health Solutions'
  WHERE recipient_name = 'PT Solusi Kesehatan Digital';

UPDATE projects SET recipient_name_en = 'PT Hutama Karya (State-Owned)'
  WHERE recipient_name = 'PT Hutama Karya (Persero)';

UPDATE projects SET recipient_name_en = 'PT Waskita Karya'
  WHERE recipient_name = 'PT Waskita Karya';

UPDATE projects SET recipient_name_en = 'PT Perumnas (State-Owned)'
  WHERE recipient_name = 'PT Perumnas (Persero)';

UPDATE projects SET recipient_name_en = 'PT Angkasa Pura II'
  WHERE recipient_name = 'PT Angkasa Pura II';

UPDATE projects SET recipient_name_en = 'PT Transportasi Jakarta'
  WHERE recipient_name = 'PT Transportasi Jakarta';

UPDATE projects SET recipient_name_en = 'PT Pelabuhan Indonesia'
  WHERE recipient_name = 'PT Pelabuhan Indonesia';

UPDATE projects SET recipient_name_en = 'Indonesian Farmers Consortium'
  WHERE recipient_name = 'Konsorsium Petani Indonesia';

UPDATE projects SET recipient_name_en = 'PT Agritech Innovation'
  WHERE recipient_name = 'PT Agritech Innovation';

UPDATE projects SET recipient_name_en = 'PT Perkebunan Nusantara IX'
  WHERE recipient_name = 'PT Perkebunan Nusantara IX';

UPDATE projects SET recipient_name_en = 'PT PLN (State-Owned)'
  WHERE recipient_name = 'PT PLN (Persero)';

UPDATE projects SET recipient_name_en = 'PT Pertamina Geothermal Energy'
  WHERE recipient_name = 'PT Pertamina Geothermal Energy';

UPDATE projects SET recipient_name_en = 'Association of Manufacturing Industries'
  WHERE recipient_name = 'Asosiasi Industri Manufaktur';

UPDATE projects SET recipient_name_en = 'Directorate General of Taxation'
  WHERE recipient_name = 'Direktorat Jenderal Pajak';

UPDATE projects SET recipient_name_en = 'Financial Services Authority'
  WHERE recipient_name = 'Otoritas Jasa Keuangan';

UPDATE projects SET recipient_name_en = 'PT Bahana Pembinaan Usaha Indonesia'
  WHERE recipient_name = 'PT Bahana Pembinaan Usaha Indonesia';

UPDATE projects SET recipient_name_en = 'Indonesian Smart City Consortium'
  WHERE recipient_name = 'Konsorsium Smart City Indonesia';

UPDATE projects SET recipient_name_en = 'PT Len Industri (State-Owned)'
  WHERE recipient_name = 'PT Len Industri (Persero)';

UPDATE projects SET recipient_name_en = 'PT Brantas Abipraya'
  WHERE recipient_name = 'PT Brantas Abipraya';

UPDATE projects SET recipient_name_en = 'PT Pos Indonesia (State-Owned)'
  WHERE recipient_name = 'PT Pos Indonesia (Persero)';

UPDATE projects SET recipient_name_en = 'Yayasan Sosial Indonesia'
  WHERE recipient_name = 'Yayasan Sosial Indonesia';

UPDATE projects SET recipient_name_en = 'Consortium of Vocational Training Institutions'
  WHERE recipient_name = 'Konsorsium Lembaga Pelatihan Vokasi';

UPDATE projects SET recipient_name_en = 'PT Telkom Indonesia'
  WHERE recipient_name = 'PT Telkom Indonesia';

UPDATE projects SET recipient_name_en = 'National Digital Literacy Movement'
  WHERE recipient_name = 'Gerakan Nasional Literasi Digital';

UPDATE projects SET recipient_name_en = 'National Cyber and Encryption Agency'
  WHERE recipient_name = 'Badan Siber dan Sandi Negara';

-- ============================================================================
-- projects.title_en + description_en — 30 projects, matched by Indonesian title
-- ============================================================================

-- Project 1
UPDATE projects SET
  title_en = 'National School Digitalization Program 2025',
  description_en = 'Digitalization program for 1,000 schools across Indonesia, covering laptop procurement, internet installation, teacher training, and a national e-learning platform'
WHERE title = 'Program Digitalisasi Sekolah Nasional 2025';

-- Project 2
UPDATE projects SET
  title_en = 'Rehabilitation of Disaster-Affected School Buildings',
  description_en = 'Rehabilitation of 250 schools damaged by natural disasters, including structural repairs, furniture procurement, and building safety certification'
WHERE title = 'Rehabilitasi Gedung Sekolah Terdampak Bencana';

-- Project 3
UPDATE projects SET
  title_en = 'Technology Innovation Research Scholarships',
  description_en = 'Scholarship program for 500 postgraduate students in the fields of technology and innovation'
WHERE title = 'Beasiswa Penelitian Inovasi Teknologi';

-- Project 4
UPDATE projects SET
  title_en = 'Construction of Central Java Regional Hospital',
  description_en = 'Construction of a modern 500-bed hospital with complete facilities and state-of-the-art medical equipment'
WHERE title = 'Pembangunan Rumah Sakit Regional Jawa Tengah';

-- Project 5
UPDATE projects SET
  title_en = 'National Vaccination Program 2025',
  description_en = 'Mass vaccination program targeting 50 million residents, with cold chain distribution across all 34 provinces'
WHERE title = 'Program Vaksinasi Nasional 2025';

-- Project 6
UPDATE projects SET
  title_en = 'Digitalization of Medical Records at Community Health Centers',
  description_en = 'Digitalization of medical record systems at 500 community health centers (puskesmas) across Indonesia using integrated SIMRS software'
WHERE title = 'Digitalisasi Rekam Medis Puskesmas';

-- Project 7
UPDATE projects SET
  title_en = 'Trans-Sumatra Toll Road Construction – Segment 5',
  description_en = 'Construction of a 120-km toll road with 3 major bridges and an electronic toll system'
WHERE title = 'Pembangunan Jalan Tol Trans Sumatera Segmen 5';

-- Project 8
UPDATE projects SET
  title_en = 'Irrigation Rehabilitation – 50,000 Hectares',
  description_en = 'Rehabilitation of irrigation systems covering 50,000 hectares of agricultural land, including dam repairs, canal restoration, and water pump installation'
WHERE title = 'Rehabilitasi Irigasi 50,000 Hektar';

-- Project 9
UPDATE projects SET
  title_en = 'Subsidized Housing Program – 10,000 Units',
  description_en = 'Construction of 10,000 subsidized housing units across 15 locations with complete infrastructure facilities'
WHERE title = 'Program Rumah Subsidi 10,000 Unit';

-- Project 10
UPDATE projects SET
  title_en = 'Modernization of Kalimantan Regional Airport',
  description_en = 'Airport modernization including 500-meter runway extension, terminal renovation, and navigation system upgrades'
WHERE title = 'Modernisasi Bandara Regional Kalimantan';

-- Project 11
UPDATE projects SET
  title_en = 'Procurement of 200 Electric City Buses',
  description_en = 'Procurement of 200 electric buses and construction of charging stations for environmentally friendly public transportation'
WHERE title = 'Pengadaan Bus Listrik Kota 200 Unit';

-- Project 12
UPDATE projects SET
  title_en = 'Construction of Ferry Crossing Terminals',
  description_en = 'Construction of 3 modern ferry crossing terminals with digital ticketing systems and new ferry vessels'
WHERE title = 'Pembangunan Dermaga Penyeberangan';

-- Project 13
UPDATE projects SET
  title_en = 'National Food Self-Sufficiency Program',
  description_en = 'Food self-sufficiency program comprising distribution of high-quality seeds, fertilizer subsidies, construction of food storage facilities, and crop failure insurance'
WHERE title = 'Program Swasembada Pangan Nasional';

-- Project 14
UPDATE projects SET
  title_en = 'Agricultural Modernization with IoT',
  description_en = 'Agricultural modernization using IoT sensors to monitor 11,000 hectares of farmland, supported by an agricultural data platform'
WHERE title = 'Modernisasi Pertanian dengan IoT';

-- Project 15
UPDATE projects SET
  title_en = 'Revitalization of Nusantara Coffee Plantations',
  description_en = 'Revitalization of coffee plantations including replanting across 5,000 hectares, farmer training, and international organic certification'
WHERE title = 'Revitalisasi Perkebunan Kopi Nusantara';

-- Project 16
UPDATE projects SET
  title_en = '100 MW Solar Power Plant',
  description_en = 'Construction of a 100 MW solar power plant with 200,000 solar panels and grid interconnection'
WHERE title = 'Pembangkit Listrik Tenaga Surya 100 MW';

-- Project 17
UPDATE projects SET
  title_en = 'Geothermal Exploration in West Sumatra',
  description_en = 'Exploration and development of geothermal resources with 250 MW potential, through geological surveys and exploratory well drilling'
WHERE title = 'Eksplorasi Panas Bumi Sumatera Barat';

-- Project 18
UPDATE projects SET
  title_en = 'Green Energy Conversion Program for Industry',
  description_en = 'Green energy conversion program for 500 factories, including energy audits, solar panel subsidies, and energy manager training'
WHERE title = 'Program Konversi Energi Hijau Industri';

-- Project 19
UPDATE projects SET
  title_en = 'Modernization of the Digital Tax System (Core Tax)',
  description_en = 'Modernization of the national tax system with Core Tax software, Tier 3 data center infrastructure, and migration of 15 million taxpayer records'
WHERE title = 'Modernisasi Sistem Pajak Digital (Core Tax)';

-- Project 20
UPDATE projects SET
  title_en = 'National Financial Literacy Program',
  description_en = 'Financial literacy program reaching 500,000 participants across all 34 provinces, delivered through a digital education platform with certification'
WHERE title = 'Program Literasi Keuangan Nasional';

-- Project 21
UPDATE projects SET
  title_en = 'Regional Government Financial System Integration (SIKD)',
  description_en = 'Integration of regional financial systems across all 34 provinces, with a 10-province pilot and full integration with the national SPAN system'
WHERE title = 'Integrasi Sistem Keuangan Daerah (SIKD)';

-- Project 22
UPDATE projects SET
  title_en = 'Smart City Implementation – 15 Cities',
  description_en = 'Smart city rollout across 15 cities, including IoT infrastructure, integrated command centers, and public service applications'
WHERE title = 'Implementasi Smart City 15 Kota';

-- Project 23
UPDATE projects SET
  title_en = 'e-ID Card and Digital Population Administration Program',
  description_en = 'e-ID card program covering 50 million residents, including upgrades to the civil registration (Dukcapil) system and mobile ID implementation'
WHERE title = 'Program e-KTP dan Kependudukan Digital';

-- Project 24
UPDATE projects SET
  title_en = 'Construction of Sub-District Offices – 200 Locations',
  description_en = 'Construction of 200 sub-district offices (kantor kecamatan) to a standardized design with complete facilities'
WHERE title = 'Pembangunan Kantor Kecamatan 200 Lokasi';

-- Project 25
UPDATE projects SET
  title_en = 'Cash Social Assistance Program – 10 Million Households',
  description_en = 'Cash social assistance program for 10 million households with quarterly disbursements'
WHERE title = 'Program Bantuan Sosial Tunai 10 Juta KK';

-- Project 26
UPDATE projects SET
  title_en = 'Construction of Integrated Social Welfare Centers – 20 Locations',
  description_en = 'Construction of 20 integrated social welfare centers with full facilities and recruitment of social assistance workers'
WHERE title = 'Pembangunan Panti Sosial Terpadu 20 Lokasi';

-- Project 27
UPDATE projects SET
  title_en = 'Vocational Skills Training Program for Persons with Disabilities',
  description_en = 'Skills training program for 10,000 persons with disabilities, including construction of dedicated training centers'
WHERE title = 'Program Pelatihan Keterampilan Disabilitas';

-- Project 28
UPDATE projects SET
  title_en = 'Eastern Palapa Ring Construction',
  description_en = 'Construction of 2,500 km of undersea fiber-optic infrastructure with 100 base transceiver stations (BTS) across Eastern Indonesia'
WHERE title = 'Pembangunan Palapa Ring Timur';

-- Project 29
UPDATE projects SET
  title_en = 'Digital Literacy Program – 50 Million Citizens',
  description_en = 'Digital literacy program for 50 million citizens, delivered through an education platform with facilitator recruitment and digital competency certification'
WHERE title = 'Program Literasi Digital 50 Juta Warga';

-- Project 30
UPDATE projects SET
  title_en = 'National Cybersecurity System',
  description_en = 'Construction of a national Security Operations Center with security tooling, incident response team training, and threat intelligence capabilities'
WHERE title = 'Sistem Keamanan Siber Nasional';

-- ============================================================================
-- milestones.description_en — 125 milestones matched by project title + index
-- ============================================================================

-- Project 1: National School Digitalization Program 2025
UPDATE milestones m SET description_en = 'Laptop Procurement for 1,000 Schools'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Digitalisasi Sekolah Nasional 2025' AND m.index = 0;

UPDATE milestones m SET description_en = 'Internet Network Installation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Digitalisasi Sekolah Nasional 2025' AND m.index = 1;

UPDATE milestones m SET description_en = 'Digital Teacher Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Digitalisasi Sekolah Nasional 2025' AND m.index = 2;

UPDATE milestones m SET description_en = 'National E-Learning Platform'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Digitalisasi Sekolah Nasional 2025' AND m.index = 3;

UPDATE milestones m SET description_en = 'Monitoring and Evaluation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Digitalisasi Sekolah Nasional 2025' AND m.index = 4;

-- Project 2: Rehabilitation of Disaster-Affected School Buildings
UPDATE milestones m SET description_en = 'Damage Assessment Survey'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Gedung Sekolah Terdampak Bencana' AND m.index = 0;

UPDATE milestones m SET description_en = 'Structural Repairs'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Gedung Sekolah Terdampak Bencana' AND m.index = 1;

UPDATE milestones m SET description_en = 'New Furniture Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Gedung Sekolah Terdampak Bencana' AND m.index = 2;

UPDATE milestones m SET description_en = 'Building Safety Certification'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Gedung Sekolah Terdampak Bencana' AND m.index = 3;

-- Project 3: Technology Innovation Research Scholarships
UPDATE milestones m SET description_en = 'Selection and Registration'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Beasiswa Penelitian Inovasi Teknologi' AND m.index = 0;

UPDATE milestones m SET description_en = 'Semester 1 Fund Disbursement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Beasiswa Penelitian Inovasi Teknologi' AND m.index = 1;

UPDATE milestones m SET description_en = 'Semester 2 Fund Disbursement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Beasiswa Penelitian Inovasi Teknologi' AND m.index = 2;

UPDATE milestones m SET description_en = 'Publication of Research Outputs'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Beasiswa Penelitian Inovasi Teknologi' AND m.index = 3;

-- Project 4: Construction of Central Java Regional Hospital
UPDATE milestones m SET description_en = 'Land Acquisition and Permitting'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Rumah Sakit Regional Jawa Tengah' AND m.index = 0;

UPDATE milestones m SET description_en = 'Main Building Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Rumah Sakit Regional Jawa Tengah' AND m.index = 1;

UPDATE milestones m SET description_en = 'Medical Equipment Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Rumah Sakit Regional Jawa Tengah' AND m.index = 2;

UPDATE milestones m SET description_en = 'Staff Recruitment and Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Rumah Sakit Regional Jawa Tengah' AND m.index = 3;

UPDATE milestones m SET description_en = 'Operational Trial'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Rumah Sakit Regional Jawa Tengah' AND m.index = 4;

-- Project 5: National Vaccination Program 2025
UPDATE milestones m SET description_en = 'Vaccine Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Vaksinasi Nasional 2025' AND m.index = 0;

UPDATE milestones m SET description_en = 'Cold Chain Distribution'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Vaksinasi Nasional 2025' AND m.index = 1;

UPDATE milestones m SET description_en = 'Vaccination Rollout – Phase 1'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Vaksinasi Nasional 2025' AND m.index = 2;

UPDATE milestones m SET description_en = 'Vaccination Rollout – Phase 2'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Vaksinasi Nasional 2025' AND m.index = 3;

-- Project 6: Digitalization of Medical Records at Community Health Centers
UPDATE milestones m SET description_en = 'SIMRS Software Development'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Digitalisasi Rekam Medis Puskesmas' AND m.index = 0;

UPDATE milestones m SET description_en = 'Hardware and Server Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Digitalisasi Rekam Medis Puskesmas' AND m.index = 1;

UPDATE milestones m SET description_en = 'Healthcare Worker Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Digitalisasi Rekam Medis Puskesmas' AND m.index = 2;

UPDATE milestones m SET description_en = 'System Implementation and Integration'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Digitalisasi Rekam Medis Puskesmas' AND m.index = 3;

-- Project 7: Trans-Sumatra Toll Road – Segment 5
UPDATE milestones m SET description_en = 'Land Acquisition – 120 km Corridor'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Jalan Tol Trans Sumatera Segmen 5' AND m.index = 0;

UPDATE milestones m SET description_en = 'Road and Bridge Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Jalan Tol Trans Sumatera Segmen 5' AND m.index = 1;

UPDATE milestones m SET description_en = 'Electronic Toll System Installation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Jalan Tol Trans Sumatera Segmen 5' AND m.index = 2;

UPDATE milestones m SET description_en = 'Rest Area Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Jalan Tol Trans Sumatera Segmen 5' AND m.index = 3;

UPDATE milestones m SET description_en = 'Operational Feasibility Test'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Jalan Tol Trans Sumatera Segmen 5' AND m.index = 4;

-- Project 8: Irrigation Rehabilitation – 50,000 Hectares
UPDATE milestones m SET description_en = 'Survey and Technical Design'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Irigasi 50,000 Hektar' AND m.index = 0;

UPDATE milestones m SET description_en = 'Dam and Canal Repairs'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Irigasi 50,000 Hektar' AND m.index = 1;

UPDATE milestones m SET description_en = 'Water Pump Installation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Irigasi 50,000 Hektar' AND m.index = 2;

UPDATE milestones m SET description_en = 'Farmer Group Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Rehabilitasi Irigasi 50,000 Hektar' AND m.index = 3;

-- Project 9: Subsidized Housing Program – 10,000 Units
UPDATE milestones m SET description_en = 'Land Acquisition at 15 Locations'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Rumah Subsidi 10,000 Unit' AND m.index = 0;

UPDATE milestones m SET description_en = 'Construction Batch 1 (3,000 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Rumah Subsidi 10,000 Unit' AND m.index = 1;

UPDATE milestones m SET description_en = 'Construction Batch 2 (4,000 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Rumah Subsidi 10,000 Unit' AND m.index = 2;

UPDATE milestones m SET description_en = 'Construction Batch 3 (3,000 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Rumah Subsidi 10,000 Unit' AND m.index = 3;

-- Project 10: Modernization of Kalimantan Regional Airport
UPDATE milestones m SET description_en = 'Runway Extension – 500 Metres'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Bandara Regional Kalimantan' AND m.index = 0;

UPDATE milestones m SET description_en = 'Passenger Terminal Renovation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Bandara Regional Kalimantan' AND m.index = 1;

UPDATE milestones m SET description_en = 'Navigation System Upgrade'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Bandara Regional Kalimantan' AND m.index = 2;

UPDATE milestones m SET description_en = 'Cargo Terminal Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Bandara Regional Kalimantan' AND m.index = 3;

-- Project 11: Procurement of 200 Electric City Buses
UPDATE milestones m SET description_en = 'Tender and Contract Award'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pengadaan Bus Listrik Kota 200 Unit' AND m.index = 0;

UPDATE milestones m SET description_en = 'Bus Procurement Batch 1 (100 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pengadaan Bus Listrik Kota 200 Unit' AND m.index = 1;

UPDATE milestones m SET description_en = 'Charging Station Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pengadaan Bus Listrik Kota 200 Unit' AND m.index = 2;

UPDATE milestones m SET description_en = 'Bus Procurement Batch 2 (100 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pengadaan Bus Listrik Kota 200 Unit' AND m.index = 3;

-- Project 12: Construction of Ferry Crossing Terminals
UPDATE milestones m SET description_en = 'Design and Permits'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Dermaga Penyeberangan' AND m.index = 0;

UPDATE milestones m SET description_en = 'Terminal Construction at 3 Locations'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Dermaga Penyeberangan' AND m.index = 1;

UPDATE milestones m SET description_en = 'Ferry Vessel Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Dermaga Penyeberangan' AND m.index = 2;

UPDATE milestones m SET description_en = 'Digital Ticketing System'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Dermaga Penyeberangan' AND m.index = 3;

-- Project 13: National Food Self-Sufficiency Program
UPDATE milestones m SET description_en = 'Distribution of High-Yield Seeds'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Swasembada Pangan Nasional' AND m.index = 0;

UPDATE milestones m SET description_en = 'Fertilizer and Farm Equipment Subsidies'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Swasembada Pangan Nasional' AND m.index = 1;

UPDATE milestones m SET description_en = 'Food Storage Warehouse Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Swasembada Pangan Nasional' AND m.index = 2;

UPDATE milestones m SET description_en = 'Crop Failure Insurance'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Swasembada Pangan Nasional' AND m.index = 3;

-- Project 14: Agricultural Modernization with IoT
UPDATE milestones m SET description_en = 'Sensor Research and Development'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Pertanian dengan IoT' AND m.index = 0;

UPDATE milestones m SET description_en = 'Pilot Project – 1,000 Hectares'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Pertanian dengan IoT' AND m.index = 1;

UPDATE milestones m SET description_en = 'Expansion to 10,000 Hectares'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Pertanian dengan IoT' AND m.index = 2;

UPDATE milestones m SET description_en = 'Agricultural Data Platform'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Pertanian dengan IoT' AND m.index = 3;

-- Project 15: Revitalization of Nusantara Coffee Plantations
UPDATE milestones m SET description_en = 'Coffee Plant Replanting'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Revitalisasi Perkebunan Kopi Nusantara' AND m.index = 0;

UPDATE milestones m SET description_en = 'Coffee Farmer Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Revitalisasi Perkebunan Kopi Nusantara' AND m.index = 1;

UPDATE milestones m SET description_en = 'Processing Mill Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Revitalisasi Perkebunan Kopi Nusantara' AND m.index = 2;

UPDATE milestones m SET description_en = 'International Organic Certification'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Revitalisasi Perkebunan Kopi Nusantara' AND m.index = 3;

-- Project 16: 100 MW Solar Power Plant
UPDATE milestones m SET description_en = 'Feasibility Study and Design'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangkit Listrik Tenaga Surya 100 MW' AND m.index = 0;

UPDATE milestones m SET description_en = 'Solar Panel Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangkit Listrik Tenaga Surya 100 MW' AND m.index = 1;

UPDATE milestones m SET description_en = 'Infrastructure Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangkit Listrik Tenaga Surya 100 MW' AND m.index = 2;

UPDATE milestones m SET description_en = 'Grid Interconnection'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangkit Listrik Tenaga Surya 100 MW' AND m.index = 3;

UPDATE milestones m SET description_en = 'Commissioning'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangkit Listrik Tenaga Surya 100 MW' AND m.index = 4;

-- Project 17: Geothermal Exploration in West Sumatra
UPDATE milestones m SET description_en = 'Geological and Geophysical Survey'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Eksplorasi Panas Bumi Sumatera Barat' AND m.index = 0;

UPDATE milestones m SET description_en = 'Exploratory Well Drilling'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Eksplorasi Panas Bumi Sumatera Barat' AND m.index = 1;

UPDATE milestones m SET description_en = 'Environmental Impact Assessment'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Eksplorasi Panas Bumi Sumatera Barat' AND m.index = 2;

UPDATE milestones m SET description_en = 'Power Plant Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Eksplorasi Panas Bumi Sumatera Barat' AND m.index = 3;

-- Project 18: Green Energy Conversion Program for Industry
UPDATE milestones m SET description_en = 'Energy Audit of 500 Factories'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Konversi Energi Hijau Industri' AND m.index = 0;

UPDATE milestones m SET description_en = 'Industrial Solar Panel Subsidies'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Konversi Energi Hijau Industri' AND m.index = 1;

UPDATE milestones m SET description_en = 'Energy Manager Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Konversi Energi Hijau Industri' AND m.index = 2;

UPDATE milestones m SET description_en = 'Monitoring and Verification'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Konversi Energi Hijau Industri' AND m.index = 3;

-- Project 19: Modernization of the Digital Tax System (Core Tax)
UPDATE milestones m SET description_en = 'Core Tax Software Development'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Sistem Pajak Digital (Core Tax)' AND m.index = 0;

UPDATE milestones m SET description_en = 'Data Center Infrastructure'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Sistem Pajak Digital (Core Tax)' AND m.index = 1;

UPDATE milestones m SET description_en = 'Taxpayer Data Migration'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Sistem Pajak Digital (Core Tax)' AND m.index = 2;

UPDATE milestones m SET description_en = 'DGT Staff Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Sistem Pajak Digital (Core Tax)' AND m.index = 3;

UPDATE milestones m SET description_en = 'National Public Outreach'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Modernisasi Sistem Pajak Digital (Core Tax)' AND m.index = 4;

-- Project 20: National Financial Literacy Program
UPDATE milestones m SET description_en = 'Educational Content Development'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Keuangan Nasional' AND m.index = 0;

UPDATE milestones m SET description_en = 'Roadshow Across 34 Provinces'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Keuangan Nasional' AND m.index = 1;

UPDATE milestones m SET description_en = 'Digital Education Platform'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Keuangan Nasional' AND m.index = 2;

UPDATE milestones m SET description_en = 'Financial Planner Certification'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Keuangan Nasional' AND m.index = 3;

-- Project 21: Regional Government Financial System Integration (SIKD)
UPDATE milestones m SET description_en = 'System Architecture Design'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Integrasi Sistem Keuangan Daerah (SIKD)' AND m.index = 0;

UPDATE milestones m SET description_en = 'Pilot Project – 10 Provinces'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Integrasi Sistem Keuangan Daerah (SIKD)' AND m.index = 1;

UPDATE milestones m SET description_en = 'Rollout to Remaining 24 Provinces'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Integrasi Sistem Keuangan Daerah (SIKD)' AND m.index = 2;

UPDATE milestones m SET description_en = 'Integration with National SPAN System'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Integrasi Sistem Keuangan Daerah (SIKD)' AND m.index = 3;

-- Project 22: Smart City Implementation – 15 Cities
UPDATE milestones m SET description_en = 'Smart City Master Plan'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Implementasi Smart City 15 Kota' AND m.index = 0;

UPDATE milestones m SET description_en = 'IoT and Sensor Infrastructure'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Implementasi Smart City 15 Kota' AND m.index = 1;

UPDATE milestones m SET description_en = 'Integrated Command Centers'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Implementasi Smart City 15 Kota' AND m.index = 2;

UPDATE milestones m SET description_en = 'Public Service Applications'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Implementasi Smart City 15 Kota' AND m.index = 3;

UPDATE milestones m SET description_en = 'Local Government Staff Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Implementasi Smart City 15 Kota' AND m.index = 4;

-- Project 23: e-ID Card and Digital Population Administration Program
UPDATE milestones m SET description_en = 'Production of 50 Million e-ID Cards'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program e-KTP dan Kependudukan Digital' AND m.index = 0;

UPDATE milestones m SET description_en = 'Dukcapil System Upgrade'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program e-KTP dan Kependudukan Digital' AND m.index = 1;

UPDATE milestones m SET description_en = 'Mobile ID Implementation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program e-KTP dan Kependudukan Digital' AND m.index = 2;

UPDATE milestones m SET description_en = 'Biometric Integration'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program e-KTP dan Kependudukan Digital' AND m.index = 3;

-- Project 24: Construction of Sub-District Offices – 200 Locations
UPDATE milestones m SET description_en = 'Standard Design and Permits'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Kantor Kecamatan 200 Lokasi' AND m.index = 0;

UPDATE milestones m SET description_en = 'Construction Phase 1 (100 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Kantor Kecamatan 200 Lokasi' AND m.index = 1;

UPDATE milestones m SET description_en = 'Construction Phase 2 (100 Units)'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Kantor Kecamatan 200 Lokasi' AND m.index = 2;

UPDATE milestones m SET description_en = 'Furniture Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Kantor Kecamatan 200 Lokasi' AND m.index = 3;

-- Project 25: Cash Social Assistance Program – 10 Million Households
UPDATE milestones m SET description_en = 'Beneficiary Data Verification and Validation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Bantuan Sosial Tunai 10 Juta KK' AND m.index = 0;

UPDATE milestones m SET description_en = 'Quarter 1 Disbursement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Bantuan Sosial Tunai 10 Juta KK' AND m.index = 1;

UPDATE milestones m SET description_en = 'Quarter 2 Disbursement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Bantuan Sosial Tunai 10 Juta KK' AND m.index = 2;

UPDATE milestones m SET description_en = 'Quarter 3 Disbursement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Bantuan Sosial Tunai 10 Juta KK' AND m.index = 3;

-- Project 26: Construction of Integrated Social Welfare Centers – 20 Locations
UPDATE milestones m SET description_en = 'Land Acquisition'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Panti Sosial Terpadu 20 Lokasi' AND m.index = 0;

UPDATE milestones m SET description_en = 'Building Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Panti Sosial Terpadu 20 Lokasi' AND m.index = 1;

UPDATE milestones m SET description_en = 'Equipment Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Panti Sosial Terpadu 20 Lokasi' AND m.index = 2;

UPDATE milestones m SET description_en = 'Social Worker Recruitment'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Panti Sosial Terpadu 20 Lokasi' AND m.index = 3;

-- Project 27: Vocational Skills Training Program for Persons with Disabilities
UPDATE milestones m SET description_en = 'Curriculum Development'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Pelatihan Keterampilan Disabilitas' AND m.index = 0;

UPDATE milestones m SET description_en = 'Training Center Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Pelatihan Keterampilan Disabilitas' AND m.index = 1;

UPDATE milestones m SET description_en = 'Training Batch 1 Delivery'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Pelatihan Keterampilan Disabilitas' AND m.index = 2;

UPDATE milestones m SET description_en = 'Training Batch 2 Delivery'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Pelatihan Keterampilan Disabilitas' AND m.index = 3;

-- Project 28: Eastern Palapa Ring Construction
UPDATE milestones m SET description_en = 'Route Survey and Design'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Palapa Ring Timur' AND m.index = 0;

UPDATE milestones m SET description_en = 'Undersea Fiber-Optic Cable Installation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Palapa Ring Timur' AND m.index = 1;

UPDATE milestones m SET description_en = 'Construction of 100 BTS Sites'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Palapa Ring Timur' AND m.index = 2;

UPDATE milestones m SET description_en = 'Testing and Commissioning'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Palapa Ring Timur' AND m.index = 3;

UPDATE milestones m SET description_en = 'First Year of Operations'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Pembangunan Palapa Ring Timur' AND m.index = 4;

-- Project 29: Digital Literacy Program – 50 Million Citizens
UPDATE milestones m SET description_en = 'Education Platform Development'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Digital 50 Juta Warga' AND m.index = 0;

UPDATE milestones m SET description_en = 'Recruitment of 10,000 Facilitators'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Digital 50 Juta Warga' AND m.index = 1;

UPDATE milestones m SET description_en = 'Training Rollout – Phase 1'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Digital 50 Juta Warga' AND m.index = 2;

UPDATE milestones m SET description_en = 'Training Rollout – Phase 2'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Digital 50 Juta Warga' AND m.index = 3;

UPDATE milestones m SET description_en = 'Digital Competency Certification'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Program Literasi Digital 50 Juta Warga' AND m.index = 4;

-- Project 30: National Cybersecurity System
UPDATE milestones m SET description_en = 'Security Operations Center Construction'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Sistem Keamanan Siber Nasional' AND m.index = 0;

UPDATE milestones m SET description_en = 'Security Tooling Procurement'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Sistem Keamanan Siber Nasional' AND m.index = 1;

UPDATE milestones m SET description_en = 'Incident Response Team Training'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Sistem Keamanan Siber Nasional' AND m.index = 2;

UPDATE milestones m SET description_en = 'Threat Intelligence Implementation'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Sistem Keamanan Siber Nasional' AND m.index = 3;

UPDATE milestones m SET description_en = 'Critical Infrastructure Security Audit'
  FROM projects p WHERE m.project_id = p.id AND p.title = 'Sistem Keamanan Siber Nasional' AND m.index = 4;

-- ============================================================================
-- comments.content_en — 18 demo comments translated by matching source content
-- 13 project-level + 5 milestone-level comments (from mock-data-epic6.sql)
-- ============================================================================

-- Project-level comments (13)

UPDATE comments SET content_en = 'Thank you for the transparency on this project. I really appreciate the clearly defined milestones!'
  WHERE content = 'Terima kasih atas transparansi proyek ini. Saya sangat mengapresiasi detail milestone yang jelas!';

UPDATE comments SET content_en = 'Thank you for your attention! We are committed to full transparency.'
  WHERE content = 'Terima kasih atas perhatiannya! Kami berkomitmen untuk transparansi penuh.';

UPDATE comments SET content_en = 'When will the next milestone be completed? This project is very important for our region.'
  WHERE content = 'Kapan milestone berikutnya akan direalisasikan? Proyek ini sangat penting untuk daerah kami.';

UPDATE comments SET content_en = 'I agree with Mrs. Ani. We are waiting for the latest update.'
  WHERE content = 'Saya setuju dengan Ibu Ani. Kami menunggu kabar terbaru.';

UPDATE comments SET content_en = 'The supporting documents are very complete. This is a great example for other projects!'
  WHERE content = 'Dokumen bukti sangat lengkap. Ini contoh yang baik untuk proyek lainnya!';

UPDATE comments SET content_en = 'Is there a monthly progress report available to the public?'
  WHERE content = 'Apakah ada laporan progress bulanan yang bisa diakses publik?';

UPDATE comments SET content_en = 'I can see there has been a delay from the original schedule. Could you please explain?'
  WHERE content = 'Saya lihat ada keterlambatan dari jadwal awal. Mohon penjelasannya.';

UPDATE comments SET content_en = 'This project has a very positive impact on the community. Thank you!'
  WHERE content = 'Proyek ini sangat berdampak positif untuk masyarakat. Terima kasih!';

UPDATE comments SET content_en = 'What is the independent oversight mechanism for this project?'
  WHERE content = 'Bagaimana mekanisme pengawasan independen untuk proyek ini?';

UPDATE comments SET content_en = 'The budget looks efficient. Hopefully this can become best practice!'
  WHERE content = 'Anggaran terlihat efisien. Semoga bisa jadi best practice!';

UPDATE comments SET content_en = 'Can the public provide input for the next milestone?'
  WHERE content = 'Apakah masyarakat bisa memberikan masukan untuk milestone selanjutnya?';

UPDATE comments SET content_en = 'The construction progress photos are very helpful. Thank you for the transparency!'
  WHERE content = 'Dokumentasi foto progres sangat membantu. Terima kasih atas transparansinya!';

UPDATE comments SET content_en = 'I would like to know more details about the vendors involved in this project.'
  WHERE content = 'Saya ingin tahu lebih detail tentang vendor yang terlibat dalam proyek ini.';

-- Milestone-level comments (5)

UPDATE comments SET content_en = 'This milestone was completed on time. Kudos to the implementation team!'
  WHERE content = 'Milestone ini sudah selesai tepat waktu. Apresiasi untuk tim pelaksana!';

UPDATE comments SET content_en = 'Is there a plan to accelerate the next milestone?'
  WHERE content = 'Apakah ada rencana untuk mempercepat milestone berikutnya?';

UPDATE comments SET content_en = 'I can see an improvement in quality compared to the previous milestone.'
  WHERE content = 'Saya lihat ada peningkatan kualitas dari milestone sebelumnya.';

UPDATE comments SET content_en = 'The documentation for this milestone is very detailed. Thank you!'
  WHERE content = 'Dokumen bukti milestone ini sangat detail. Terima kasih!';

UPDATE comments SET content_en = 'How long did this milestone take to complete?'
  WHERE content = 'Berapa lama waktu yang dibutuhkan untuk milestone ini?';

-- ============================================================================
-- issues.description_en — 9 demo issue reports translated by matching title
-- ============================================================================

UPDATE issues SET description_en = 'I found that the last milestone does not have adequate photo documentation. There is only one photo, whereas there should be complete documentation from multiple angles.'
  WHERE title = 'Dokumen Bukti Milestone Tidak Lengkap';

UPDATE issues SET description_en = 'The second milestone was supposed to be completed last month according to the schedule, but there has been no news yet. Please provide an explanation from the relevant parties.'
  WHERE title = 'Keterlambatan Pencairan Milestone';

UPDATE issues SET description_en = 'After checking the details, it appears there is a discrepancy between the allocated budget and what has been realized. Please provide further clarification on this matter.'
  WHERE title = 'Potensi Ketidaksesuaian Anggaran';

UPDATE issues SET description_en = 'I cannot find detailed information about the vendor executing this project. Vendor transparency is very important in preventing corruption.'
  WHERE title = 'Vendor Tidak Jelas';

UPDATE issues SET description_en = 'The uploaded proof documents are low quality and difficult to read. It would be better to use high-resolution scans for greater transparency.'
  WHERE title = 'Bukti Realisasi Kurang Jelas';

UPDATE issues SET description_en = 'There has been no project progress update for 2 months. As citizens we have the right to know the current status of a project funded by our taxes.'
  WHERE title = 'Update Progress Terlambat';

UPDATE issues SET description_en = 'Why is there a significant difference between the initial estimate and the actual realization? Please provide a detailed explanation of this budget change.'
  WHERE title = 'Pertanyaan Alokasi Anggaran';

UPDATE issues SET description_en = 'For research purposes, are detailed documents such as the Bill of Quantities (RAB) and Time Schedule available? These would be very helpful for our analysis.'
  WHERE title = 'Request Dokumen Tambahan';

UPDATE issues SET description_en = 'Given the significant budget of this project, we recommend an independent third-party audit to ensure there are no irregularities.'
  WHERE title = 'Permintaan Audit Independen';

-- ============================================================================
-- project_ratings.comment_en — translating the 6 unique comment templates
-- used in the dynamic INSERT loop (mock-data-epic6.sql lines 68–86).
-- These comments are inserted as literal strings with a loop counter suffix
-- (e.g. "Warga Peduli 1", "Warga Peduli 2") — the content field itself is
-- the same for all iterations within each star tier. We match by comment text.
-- ============================================================================

-- 5-star comments
UPDATE project_ratings SET comment_en = 'A very transparent and well-organized project!'
  WHERE comment = 'Proyek sangat transparan dan terorganisir dengan baik!';

UPDATE project_ratings SET comment_en = 'Complete documentation, clear process. A model worth emulating!'
  WHERE comment = 'Dokumentasi lengkap, proses jelas. Contoh yang patut ditiru!';

-- 4-star comments
UPDATE project_ratings SET comment_en = 'Very good, but there is still room to improve communication.'
  WHERE comment = 'Sangat baik, tapi masih ada ruang untuk peningkatan komunikasi.';

UPDATE project_ratings SET comment_en = 'Good progress, documentation could be more detailed.'
  WHERE comment = 'Progress bagus, dokumentasi bisa lebih detail.';

-- 3-star comment
UPDATE project_ratings SET comment_en = 'Reasonably transparent, but more regular updates are needed.'
  WHERE comment = 'Cukup transparan, tapi perlu lebih banyak update rutin.';

-- 2-star comment
UPDATE project_ratings SET comment_en = 'Still lacking detail in several areas. Needs improvement.'
  WHERE comment = 'Masih kurang detail dalam beberapa aspek. Perlu perbaikan.';

-- ============================================================================
-- Refresh materialized view so ministry_en propagates
-- ============================================================================

REFRESH MATERIALIZED VIEW ministry_performance;

COMMIT;
