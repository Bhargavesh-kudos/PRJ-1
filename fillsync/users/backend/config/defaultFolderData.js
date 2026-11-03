/**
 * ============================================================================
 * FILE: users/backend/config/defaultFolderData.js
 * PURPOSE: Exhaustive, comprehensive data dictionaries for the 3 Built-In
 *          Profiles (Travel, Professional, Personal).
 *          Covers every real-world field for:
 *          - Travel: IRCTC Train, Aero/Flight, Bus (redBus)
 *          - Professional: Common Base OTR, Govt Exams (SSC/UPSC/Banking/RRB),
 *                          College/Admissions (CUET/JEE/GATE), Portfolio
 *          - Personal: Full Bio, Contact, Address, IDs, Banking, File Uploads
 * ============================================================================
 */

export function getComprehensiveTravelFields() {
  return [
    // 🚆 Dynamic Route & Station Settings (Solves "Different Stations Every Time")
    { section: "Journey Routes & Stations", key: "Current Trip Origin (From)", value: "NDLS (New Delhi)", type: "text" },
    { section: "Journey Routes & Stations", key: "Current Trip Destination (To)", value: "RE (Rewari)", type: "text" },
    { section: "Journey Routes & Stations", key: "Date of Journey", value: "2026-11-20", type: "date" },
    { section: "Journey Routes & Stations", key: "Frequent Route 1 (Home - College)", value: "RE (Rewari) ➔ NDLS (New Delhi)", type: "text" },
    { section: "Journey Routes & Stations", key: "Frequent Route 2 (Metro - Capital)", value: "NDLS (New Delhi) ➔ BOM (Mumbai)", type: "text" },
    { section: "Journey Routes & Stations", key: "Frequent Route 3 (Intercity)", value: "NDLS (New Delhi) ➔ JP (Jaipur)", type: "text" },
    { section: "Journey Routes & Stations", key: "Prompt Stations On Search", value: "Yes (Prompt if station is not pre-filled)", type: "text" },

    // 🚆 Train Booking Class & Preferences
    { section: "Train Booking (IRCTC / MMT)", key: "Travel Class", value: "3A - AC 3 Tier", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "Booking Quota", value: "General (or Tatkal)", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "Boarding Station", value: "Delhi Cantt (DEC)", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "IRCTC User ID", value: "bhargav_rail", type: "text", isEncrypted: true },
    { section: "Train Booking (IRCTC / MMT)", key: "Auto-Upgradation Choice", value: "Consider for Auto-Upgradation", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "Confirm Berth Condition", value: "Book only if confirm berths are allotted", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "Preferred Coach ID", value: "B1", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "Contact Mobile Number", value: "9876543210", type: "text", isEncrypted: true },
    { section: "Train Booking (IRCTC / MMT)", key: "Contact Email ID", value: "bhargaveshpandit@gmail.com", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "Travel Insurance", value: "Yes", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "GSTIN Number", value: "", type: "text" },
    { section: "Train Booking (IRCTC / MMT)", key: "GST Company Name", value: "", type: "text" },

    // 👨‍👩‍👧‍👦 Family Passenger Roster (Full 6 Passengers for IRCTC Tatkal & Family Bookings)
    { section: "Family Passengers (6 Members)", key: "Passenger 1 (Primary) Full Name", value: "Bhargavesh", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 1 Age", value: "21", type: "number" },
    { section: "Family Passengers (6 Members)", key: "Passenger 1 Gender", value: "Male", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 1 Berth Preference", value: "Lower Berth", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 1 Food Preference", value: "Veg", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 1 ID / Aadhaar", value: "1234 5678 9012", type: "text", isEncrypted: true },

    { section: "Family Passengers (6 Members)", key: "Passenger 2 (Family) Full Name", value: "Suresh Pandit (Father)", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 2 Age", value: "52", type: "number" },
    { section: "Family Passengers (6 Members)", key: "Passenger 2 Gender", value: "Male", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 2 Berth Preference", value: "Lower Berth (Senior Priority)", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 2 Food Preference", value: "Veg", type: "text" },

    { section: "Family Passengers (6 Members)", key: "Passenger 3 (Family) Full Name", value: "Sunita Pandit (Mother)", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 3 Age", value: "48", type: "number" },
    { section: "Family Passengers (6 Members)", key: "Passenger 3 Gender", value: "Female", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 3 Berth Preference", value: "Lower Berth", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 3 Food Preference", value: "Veg", type: "text" },

    { section: "Family Passengers (6 Members)", key: "Passenger 4 (Family) Full Name", value: "Rahul Pandit (Brother)", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 4 Age", value: "18", type: "number" },
    { section: "Family Passengers (6 Members)", key: "Passenger 4 Gender", value: "Male", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 4 Berth Preference", value: "Upper Berth", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 4 Food Preference", value: "Non-Veg", type: "text" },

    { section: "Family Passengers (6 Members)", key: "Passenger 5 (Family) Full Name", value: "Pooja Pandit (Sister)", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 5 Age", value: "24", type: "number" },
    { section: "Family Passengers (6 Members)", key: "Passenger 5 Gender", value: "Female", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 5 Berth Preference", value: "Side Lower Berth", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 5 Food Preference", value: "Veg", type: "text" },

    { section: "Family Passengers (6 Members)", key: "Passenger 6 (Family) Full Name", value: "Aakash Pandit", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 6 Age", value: "15", type: "number" },
    { section: "Family Passengers (6 Members)", key: "Passenger 6 Gender", value: "Male", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 6 Berth Preference", value: "Side Upper Berth", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Passenger 6 Food Preference", value: "Veg", type: "text" },

    { section: "Family Passengers (6 Members)", key: "Infant 1 Name (< 5 Yrs)", value: "", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Infant 1 Age & Gender", value: "", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Infant 2 Name (< 5 Yrs)", value: "", type: "text" },
    { section: "Family Passengers (6 Members)", key: "Infant 2 Age & Gender", value: "", type: "text" },

    // ✈️ Flight Booking (IndiGo, Air India, Skyscanner)
    { section: "Flight Booking (Aero)", key: "Flight Trip Type", value: "One-Way", type: "text" },
    { section: "Flight Booking (Aero)", key: "Departure Airport / Code", value: "DEL (Indira Gandhi Intl, Delhi)", type: "text" },
    { section: "Flight Booking (Aero)", key: "Arrival Airport / Code", value: "BOM (Chhatrapati Shivaji Intl, Mumbai)", type: "text" },
    { section: "Flight Booking (Aero)", key: "Departure Date", value: "2026-11-25", type: "date" },
    { section: "Flight Booking (Aero)", key: "Return Date", value: "", type: "date" },
    { section: "Flight Booking (Aero)", key: "Adults Count", value: "1", type: "number" },
    { section: "Flight Booking (Aero)", key: "Flight Cabin Class", value: "Economy", type: "text" },
    { section: "Flight Booking (Aero)", key: "Special Fare Category", value: "Student", type: "text" },
    { section: "Flight Booking (Aero)", key: "Passenger Title", value: "Mr", type: "text" },
    { section: "Flight Booking (Aero)", key: "First & Middle Name", value: "Bhargavesh", type: "text" },
    { section: "Flight Booking (Aero)", key: "Last Name / Surname", value: "Pandit", type: "text" },
    { section: "Flight Booking (Aero)", key: "Date of Birth (DOB)", value: "2004-05-14", type: "date" },
    { section: "Flight Booking (Aero)", key: "Student ID / Defence ID No", value: "BMU2022CSE045", type: "text" },
    { section: "Flight Booking (Aero)", key: "Passport Number", value: "Z1234567", type: "text", isEncrypted: true },
    { section: "Flight Booking (Aero)", key: "Passport Issuing Country", value: "IND (India)", type: "text" },
    { section: "Flight Booking (Aero)", key: "Passport Expiry Date", value: "2032-10-30", type: "date" },
    { section: "Flight Booking (Aero)", key: "Flight Seat Preference", value: "Window Seat", type: "text" },
    { section: "Flight Booking (Aero)", key: "Flight Meal Preference", value: "Vegetarian Hindu Meal (AVML)", type: "text" },
    { section: "Flight Booking (Aero)", key: "Wheelchair Assistance", value: "No", type: "text" },
    { section: "Flight Booking (Aero)", key: "Frequent Flyer / Loyalty No", value: "", type: "text" },

    // 🚌 Bus Booking (redBus, AbhiBus, State Roadways)
    { section: "Bus Booking (redBus / Roadways)", key: "Bus From City / Stop", value: "Gurugram / IFFCO Chowk", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus To City / Stop", value: "Jaipur / Sindhi Camp", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Date of Journey", value: "2026-11-28", type: "date" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Type Preference", value: "AC Sleeper (2+1)", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Seat Preference", value: "Lower Deck Window", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Exact Boarding Point Landmark", value: "IFFCO Chowk Flyover, Near Police Booth", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Exact Dropping Point Landmark", value: "Sindhi Camp Bus Stand Platform 1", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Passenger Name", value: "Bhargavesh", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Passenger Age & Gender", value: "21 / Male", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Contact Mobile (For Driver/GPS)", value: "9876543210", type: "text", isEncrypted: true },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Contact Email", value: "bhargaveshpandit@gmail.com", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "State of Residence (GST)", value: "Haryana", type: "text" },
    { section: "Bus Booking (redBus / Roadways)", key: "Bus Travel Insurance", value: "Yes", type: "text" }
  ];
}

export function getComprehensiveProfessionalFields() {
  return [
    // 🏛️ Common Base / One-Time Registration (OTR)
    { section: "Common Base (OTR / 10th Identity)", key: "Candidate Full Name (As per 10th)", value: "Bhargavesh", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Have You Ever Changed Name", value: "No", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Previous Name (If Changed)", value: "", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Father's Full Name (As per 10th)", value: "Suresh Pandit", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Mother's Full Name (As per 10th)", value: "Sunita Pandit", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Guardian / Spouse Name", value: "", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Date of Birth (DOB)", value: "2004-05-14", type: "date" },
    { section: "Common Base (OTR / 10th Identity)", key: "Gender", value: "Male", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Marital Status", value: "Unmarried", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Nationality / Citizenship", value: "Citizen of India", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Religion", value: "Hindu", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Minority Community Status", value: "No", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Visible Identification Mark", value: "A small mole on right cheek", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Govt Photo ID Type", value: "Aadhaar Card", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Govt Photo ID Number", value: "1234 5678 9012", type: "text", isEncrypted: true },
    { section: "Common Base (OTR / 10th Identity)", key: "Present Correspondence Address", value: "Flat 302, Green Valley Apartments, Gurugram, Haryana - 122001", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Permanent Address", value: "House No 45, Civil Lines, Rewari, Haryana - 123401", type: "text" },
    { section: "Common Base (OTR / 10th Identity)", key: "Primary Mobile Number", value: "9876543210", type: "text", isEncrypted: true },
    { section: "Common Base (OTR / 10th Identity)", key: "Alternate Mobile Number", value: "9812345678", type: "text", isEncrypted: true },
    { section: "Common Base (OTR / 10th Identity)", key: "Primary Email Address", value: "bhargaveshpandit@gmail.com", type: "text" },

    // 📝 Government Exam Forms (SSC, UPSC, Banking, Railways, State PSC)
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Social Category", value: "General (UR)", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Category / EWS Certificate Number", value: "", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Category Certificate Issue Date", value: "", type: "date" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Category Issuing Authority", value: "Tehsildar", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Domicile State", value: "Haryana", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Domicile Certificate Number", value: "DOM/HAR/2022/8941", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Family ID / Parivar Pehchan Patra (PPP)", value: "8XYZ1234", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Person with Benchmark Disability (PwBD)", value: "No", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Disability Type & Percentage", value: "None / 0%", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "UDID Card Number", value: "", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Scribe Requirement", value: "No", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Ex-Servicemen (ESM) Status", value: "No", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "ESM Service Length", value: "0 Years", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Current Government Employee", value: "No", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Department & Designation", value: "", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Exam Centre Preference 1", value: "Gurugram", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Exam Centre Preference 2", value: "Delhi / New Delhi", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Exam Centre Preference 3", value: "Jaipur", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Medium of Examination", value: "English", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Medium of Typing / Skill Test", value: "English", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Keyboard Layout for Typing", value: "Remington Gail / QWERTY", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Preferred Post / Zone", value: "Income Tax Inspector (CBDT) / Northern Railway", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "UPSC Optional Subject", value: "Mathematics", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Number of Previous Attempts", value: "0", type: "number" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Height (in cm)", value: "176 cm", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Chest (Unexpanded / Expanded)", value: "82 cm / 87 cm", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Weight (in kg)", value: "68 kg", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Eye Vision", value: "6/6 Distant, N6 Near", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "NCC Certificate (A / B / C)", value: "None", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Criminal Record or Pending FIR", value: "No", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Ever Debarred by UPSC / SSC", value: "No", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Fee Refund Bank Account Holder", value: "Bhargavesh", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Fee Refund Bank Name", value: "State Bank of India", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Fee Refund Account Number", value: "34891028491", type: "text", isEncrypted: true },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Fee Refund IFSC Code", value: "SBIN0001234", type: "text" },
    { section: "Govt Exams (SSC / UPSC / Banking)", key: "Fee Refund Branch Name", value: "Rewari Main Branch", type: "text" },

    // 🎓 College, University & Entrance Forms (CUET, JEE, Admissions)
    { section: "College & Entrance (CUET / JEE)", key: "ABC ID / APAAR ID", value: "1234-5678-9012", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "DigiLocker / NAD ID", value: "bhargavesh_digi", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 10th Board", value: "CBSE", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 10th School Name & PIN", value: "Delhi Public School, Rewari (PIN: 123401)", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 10th Passing Year", value: "2020", type: "number" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 10th Roll Number", value: "2104589", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 10th Score / CGPA / %", value: "94.2% (CGPA 9.6)", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th Board", value: "CBSE", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th School / College", value: "Delhi Public School, Rewari", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th Stream", value: "Science (PCM)", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th Passing Year", value: "2022", type: "number" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th Roll Number", value: "2214892", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th Percentage", value: "91.8%", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Class 12th PCM Marks Breakdown", value: "Physics: 92, Chemistry: 89, Maths: 95", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Current Degree / Branch", value: "B.Tech Computer Science & Engineering (CSE)", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "University / Institute Name", value: "BML Munjal University, Gurugram", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Current Semester / Year", value: "5th Semester / 3rd Year", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Current CGPA / Percentage", value: "8.75 / 10", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Gap Year Details", value: "No Gap", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Entrance Exam Name", value: "JEE Main", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Entrance Roll / Application No", value: "220310489102", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Entrance Score / NTA Percentile", value: "96.42 Percentile", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "All India Rank (AIR / CRL)", value: "38,421", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Category Rank", value: "38,421", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Annual Family Income (INR)", value: "₹8,50,000", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Special Admission Quota", value: "General Merit / None", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Preferred Program & Branch", value: "1. B.Tech CSE, 2. B.Tech AI & Data Science", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Hostel & Mess Preference", value: "Hosteller (AC Double, Veg Mess)", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "University Bus Transport", value: "No", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Anti-Ragging Reference Number", value: "AR-2022-849102", type: "text" },
    { section: "College & Entrance (CUET / JEE)", key: "Transfer / Migration Certificate No", value: "TC-89410", type: "text" },

    // 💼 Work & Portfolio (Internships / Job Search)
    { section: "Career & Portfolio Links", key: "LinkedIn URL", value: "https://linkedin.com/in/bhargavesh", type: "text" },
    { section: "Career & Portfolio Links", key: "GitHub URL", value: "https://github.com/bhargavesh", type: "text" },
    { section: "Career & Portfolio Links", key: "Portfolio URL", value: "https://bhargavesh.dev", type: "text" },
    { section: "Career & Portfolio Links", key: "Key Technical Skills", value: "React, Node.js, Express, Tailwind CSS, Python, Chrome Extensions", type: "text" },

    // 📁 Academic & Exam Documents (PDF & Certificate Uploads)
    { section: "Academic & Exam Documents", key: "Latest Resume / CV PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Academic & Exam Documents", key: "Class 10th Marksheet PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Academic & Exam Documents", key: "Class 12th Marksheet PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Academic & Exam Documents", key: "Graduation Degree / Transcript PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Academic & Exam Documents", key: "Category / EWS Certificate PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Academic & Exam Documents", key: "Domicile / State Resident PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Academic & Exam Documents", key: "Entrance Exam Scorecard PDF (JEE/CUET/GATE)", value: "", type: "file", fileName: null, fileSize: null }
  ];
}

export function getComprehensivePersonalFields() {
  return [
    // 👤 Core Identity & Biographic
    { section: "Core Identity & Bio", key: "Full Legal Name", value: "Bhargavesh", type: "text" },
    { section: "Core Identity & Bio", key: "First Name (Given Name)", value: "Bhargavesh", type: "text" },
    { section: "Core Identity & Bio", key: "Middle Name", value: "", type: "text" },
    { section: "Core Identity & Bio", key: "Last Name (Surname)", value: "Pandit", type: "text" },
    { section: "Core Identity & Bio", key: "Title / Salutation", value: "Mr", type: "text" },
    { section: "Core Identity & Bio", key: "Date of Birth (DOB)", value: "2004-05-14", type: "date" },
    { section: "Core Identity & Bio", key: "Age in Years", value: "21", type: "number" },
    { section: "Core Identity & Bio", key: "Place of Birth", value: "Rewari, Haryana", type: "text" },
    { section: "Core Identity & Bio", key: "Gender", value: "Male", type: "text" },
    { section: "Core Identity & Bio", key: "Marital Status", value: "Unmarried", type: "text" },
    { section: "Core Identity & Bio", key: "Nationality", value: "Indian", type: "text" },
    { section: "Core Identity & Bio", key: "Religion", value: "Hindu", type: "text" },
    { section: "Core Identity & Bio", key: "Mother Tongue", value: "Hindi", type: "text" },
    { section: "Core Identity & Bio", key: "Blood Group", value: "B+", type: "text" },
    { section: "Core Identity & Bio", key: "Height (in cm)", value: "176 cm", type: "text" },
    { section: "Core Identity & Bio", key: "Weight (in kg)", value: "68 kg", type: "text" },
    { section: "Core Identity & Bio", key: "Visible Identification Mark", value: "A small mole on right cheek", type: "text" },

    // 📞 Contact & Emergency
    { section: "Contact & Emergency", key: "Primary Mobile Number", value: "9876543210", type: "text", isEncrypted: true },
    { section: "Contact & Emergency", key: "Alternate Mobile Number", value: "9812345678", type: "text", isEncrypted: true },
    { section: "Contact & Emergency", key: "WhatsApp Number", value: "9876543210", type: "text", isEncrypted: true },
    { section: "Contact & Emergency", key: "Primary Email Address", value: "bhargaveshpandit@gmail.com", type: "text" },
    { section: "Contact & Emergency", key: "Alternate Email Address", value: "bhargav.backup@gmail.com", type: "text" },
    { section: "Contact & Emergency", key: "Emergency Contact Person Name", value: "Suresh Pandit (Father)", type: "text" },
    { section: "Contact & Emergency", key: "Emergency Contact Relation", value: "Father", type: "text" },
    { section: "Contact & Emergency", key: "Emergency Contact Phone", value: "9812345678", type: "text", isEncrypted: true },

    // 🏠 Addresses (Present & Permanent)
    { section: "Addresses (Present & Permanent)", key: "Present House / Flat Number", value: "Flat 302, Block B", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present Street / Locality", value: "Green Valley Apartments, Sector 48", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present Landmark", value: "Near Metro Pillar 140", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present City / Town", value: "Gurugram", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present Post Office", value: "Sector 47 Sub-Post Office", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present Police Station", value: "Sadar Police Station, Gurugram", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present Tehsil / Sub-District", value: "Gurugram", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present District", value: "Gurugram", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present State / UT", value: "Haryana", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Present PIN Code", value: "122001", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Permanent Address Same as Present", value: "No", type: "text" },
    { section: "Addresses (Present & Permanent)", key: "Permanent Full Address", value: "House No 45, Civil Lines, Rewari, Haryana - 123401", type: "text" },

    // 🆔 Official Government IDs & Accounts
    { section: "Official Govt IDs & Accounts", key: "Aadhaar Card Number", value: "1234 5678 9012", type: "text", isEncrypted: true },
    { section: "Official Govt IDs & Accounts", key: "Aadhaar Enrollment ID (EID)", value: "", type: "text" },
    { section: "Official Govt IDs & Accounts", key: "PAN Card Number", value: "ABCDE1234F", type: "text", isEncrypted: true },
    { section: "Official Govt IDs & Accounts", key: "Voter ID (EPIC Number)", value: "HR/02/104/891024", type: "text", isEncrypted: true },
    { section: "Official Govt IDs & Accounts", key: "Driving License Number", value: "HR-3620220019283", type: "text", isEncrypted: true },
    { section: "Official Govt IDs & Accounts", key: "Driving License Expiry Date", value: "2042-05-13", type: "date" },
    { section: "Official Govt IDs & Accounts", key: "Passport Number", value: "Z1234567", type: "text", isEncrypted: true },
    { section: "Official Govt IDs & Accounts", key: "Passport Expiry Date", value: "2032-10-30", type: "date" },
    { section: "Official Govt IDs & Accounts", key: "State Family ID / PPP", value: "8XYZ1234", type: "text" },
    { section: "Official Govt IDs & Accounts", key: "ABC ID / APAAR ID", value: "1234-5678-9012", type: "text" },
    { section: "Official Govt IDs & Accounts", key: "DigiLocker ID", value: "bhargavesh_digi", type: "text" },
    { section: "Official Govt IDs & Accounts", key: "IRCTC User ID", value: "bhargav_rail", type: "text", isEncrypted: true },

    // 🏦 Family, Income & Banking
    { section: "Family, Income & Banking", key: "Father's Full Name", value: "Suresh Pandit", type: "text" },
    { section: "Family, Income & Banking", key: "Father's Occupation", value: "Government Service", type: "text" },
    { section: "Family, Income & Banking", key: "Father's Mobile Number", value: "9812345678", type: "text", isEncrypted: true },
    { section: "Family, Income & Banking", key: "Mother's Full Name", value: "Sunita Pandit", type: "text" },
    { section: "Family, Income & Banking", key: "Mother's Occupation", value: "Homemaker", type: "text" },
    { section: "Family, Income & Banking", key: "Annual Family Income (INR)", value: "₹8,50,000", type: "text" },
    { section: "Family, Income & Banking", key: "Primary Bank Name", value: "State Bank of India", type: "text" },
    { section: "Family, Income & Banking", key: "Bank Account Holder Name", value: "Bhargavesh", type: "text" },
    { section: "Family, Income & Banking", key: "Bank Account Number", value: "34891028491", type: "text", isEncrypted: true },
    { section: "Family, Income & Banking", key: "Bank IFSC Code", value: "SBIN0001234", type: "text" },
    { section: "Family, Income & Banking", key: "Bank Branch Name", value: "Rewari Main Branch", type: "text" },
    { section: "Family, Income & Banking", key: "UPI ID / VPA", value: "bhargavesh@sbi", type: "text" },

    // 📁 Document Files & Biometrics (File Upload + Smart Resizer)
    { section: "Document Files & Uploads", key: "Passport Size Photo (White Background)", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Passport Photo with Name & Date (SSC / UPSC)", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Scanned Signature (Black / Blue Ink)", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Left Thumb Impression (LTI)", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Class 10th Marksheet / Birth Certificate PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Class 12th Marksheet PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Graduation Degree / Marksheet PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Aadhaar Card PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "PAN Card Image / PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Category / EWS Certificate PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Domicile Certificate PDF", value: "", type: "file", fileName: null, fileSize: null },
    { section: "Document Files & Uploads", key: "Income Certificate PDF", value: "", type: "file", fileName: null, fileSize: null }
  ];
}
