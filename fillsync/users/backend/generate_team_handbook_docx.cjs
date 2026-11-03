const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType
} = require('docx');

// Helper for regular paragraphs
function p(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({
    text,
    font: 'Calibri',
    size: opts.size || 22, // 11pt
    color: opts.color || '222222',
    bold: opts.bold || false,
    italics: opts.italics || false
  })];

  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before || 80, after: opts.after || 80, line: 260 },
    children: runs
  });
}

// Heading 1
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 260, after: 120 },
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 28, // 14pt
        bold: true,
        color: '0F172A' // Slate 900
      })
    ]
  });
}

// Heading 2
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 24, // 12pt
        bold: true,
        color: '0D9488' // Teal 600
      })
    ]
  });
}

// Bullet item
function bullet(title, description) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 240 },
    children: [
      new TextRun({ text: title + ': ', font: 'Calibri', size: 22, bold: true, color: '1E293B' }),
      new TextRun({ text: description, font: 'Calibri', size: 22, color: '334155' })
    ]
  });
}

// Info / Callout Box
function calloutBox(title, body) {
  const cellBorder = { style: BorderStyle.SINGLE, size: 6, color: '99F6E4' }; // Light teal
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'F0FDFA', type: ShadingType.CLEAR }, // Teal 50
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            borders: { top: cellBorder, bottom: cellBorder, left: { style: BorderStyle.SINGLE, size: 24, color: '0D9488' }, right: cellBorder },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: '💡 ' + title, font: 'Calibri', size: 22, bold: true, color: '0F766E' })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 0, line: 240 },
                children: [new TextRun({ text: body, font: 'Calibri', size: 21, color: '134E4A' })]
              })
            ]
          })
        ]
      })
    ]
  });
}

// Table creator helper
function createTable(headers, rowsData) {
  const tableBorder = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
  const rows = [];

  // Header row
  rows.push(new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      shading: { fill: '0F172A', type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      borders: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
      children: [new Paragraph({
        children: [new TextRun({ text: h, font: 'Calibri', size: 20, bold: true, color: 'FFFFFF' })]
      })]
    }))
  }));

  // Data rows
  rowsData.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    rows.push(new TableRow({
      children: row.map((cellText, cellIdx) => new TableCell({
        shading: { fill: isEven ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        borders: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
        children: [new Paragraph({
          children: [new TextRun({
            text: cellText,
            font: 'Calibri',
            size: 20,
            bold: cellIdx === 0,
            color: '1E293B'
          })]
        })]
      }))
    }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows
  });
}

// Generate the complete document
async function generateDocx() {
  const doc = new Document({
    creator: 'FillSync Capstone Team',
    title: 'FillSync Project Master Guide & Team Handbook',
    description: 'Complete project explanation, features, architecture, and evaluation prep in simple English.',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: '222222' }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
          }
        },
        children: [
          // Title Section
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: 'FILLSYNC — PROJECT MASTER GUIDE',
                font: 'Calibri',
                size: 36, // 18pt
                bold: true,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 140 },
            children: [
              new TextRun({
                text: 'Smart Form Automation, Profile Management & Browser Extension System',
                font: 'Calibri',
                size: 24,
                color: '0D9488',
                bold: true
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [
              new TextRun({
                text: 'BML Munjal University | 5th Semester Capstone Project (PRJ-1)\nAcademic Year 2026',
                font: 'Calibri',
                size: 20,
                italics: true,
                color: '64748B'
              })
            ]
          }),

          calloutBox(
            'Purpose of this Handbook',
            'This guide explains everything about FillSync in simple, easy-to-understand English. Every team member should read this so that anyone can confidently explain the project, demonstrate its features, and answer professor questions during the mid-semester evaluation and viva.'
          ),

          p(''),

          // Section 1: What is FillSync?
          h1('1. What is FillSync in Simple Words?'),
          p(
            'FillSync is an intelligent web platform and Chrome Browser Extension that automatically fills out repetitive online application forms with just one single click.'
          ),
          p(
            'Think of all the online forms college students have to fill repeatedly: placement application forms, government job exams (UPSC, SSC, Banking, Railways), college admission portals, internship Google forms, and travel ticket booking forms (IRCTC train tickets, flight bookings, bus tickets).'
          ),
          p(
            'In all these forms, students have to type the exact same details again and again: name, father\'s name, mother\'s name, date of birth, Class 10/12 marks, Aadhaar number, PAN card, addresses, emergency contacts, photo, and signature. It takes 20 to 45 minutes per form, and simple typing errors can lead to application rejection or ticket cancellation.'
          ),
          p(
            'FillSync solves this problem completely: You save your verified data once in FillSync. When you open any application form on the internet, the FillSync Chrome Extension detects all form fields automatically and fills the entire form in 2 seconds with 100% accuracy.'
          ),

          p(''),

          // Section 2: Team Members & Roles
          h1('2. Team Members & Updated Roles'),
          p(
            'Here is the exact distribution of responsibilities across our 5-member team:'
          ),
          createTable(
            ['Team Member', 'Official Role', 'Key Responsibilities'],
            [
              [
                'Bhargavesh (Lead)',
                'Project Lead, Backend API & Data Security',
                'Overall project coordination, Node.js/Express REST backend, AES-256 data encryption, Razorpay payment gateway integration, Git repository maintainer.'
              ],
              [
                'Mayank Verma',
                'System Design & Frontend Architecture',
                'System architecture diagrams, data flow design, frontend component hierarchy, UI responsive layouts, and state management (with Neal).'
              ],
              [
                'Neal Soni',
                'Frontend UI/UX Engineering',
                'React + Vite development, interactive dashboards, Extension Simulator modal, Master Profile & Data Folders pages, and Tailwind styling.'
              ],
              [
                'Yash Yadav',
                'QA, Testing & Integration',
                'Multi-step form testing, automated DOM filling test cases, edge case handling, and cross-browser extension compatibility.'
              ],
              [
                'Nitin Rao',
                'Documentation & Research',
                'SRS document, Feasibility study report, PPT presentations, viva preparation content, and academic evaluation metrics.'
              ]
            ]
          ),

          p(''),

          // Section 3: Architecture & 5 Core Modules
          h1('3. How FillSync Works: The 5 Core Modules'),
          p(
            'FillSync is built using a modern, scalable 5-module architecture. Everything is organized inside the fillsync/ directory:'
          ),

          bullet(
            '1. User Frontend (React + Vite)',
            'The web dashboard located in users/frontend/. This is where users register, view their profiles, organize their data folders, upload documents, and manage their subscription.'
          ),
          bullet(
            '2. User Backend (Node.js + Express)',
            'The REST API server located in users/backend/ running on Port 5000. It handles user authentication (JWT), secure CRUD operations, and Razorpay payment order processing.'
          ),
          bullet(
            '3. Chromium Browser Extension (Manifest V3)',
            'Located in extension/. This is the real Chrome Extension that runs directly on web pages. It includes a popup UI, background service worker, and content scripts that inspect form fields and type data into them.'
          ),
          bullet(
            '4. SuperAdmin Portal',
            'Located in superadmin/. A separate administrative console for platform owners to monitor user growth, view security audit logs, track MRR revenue, and handle support tickets. Sensitive user data is masked so even admins cannot steal personal info.'
          ),
          bullet(
            '5. Shared Encrypted Database',
            'Located in shared-database/local_storage.json. Simulates a persistent database on localhost with AES-256 encryption for private phone numbers and addresses.'
          ),

          p(''),

          // Section 4: Key Features Breakdown
          h1('4. Key Features Explained in Detail'),
          p(
            'Here are the powerful features built into FillSync that make it stand out from basic autofill tools:'
          ),

          h2('Feature A: 3 Built-In Profiles with 220+ Pre-Configured Fields'),
          p(
            'Most password managers or browser autofills only remember your name, email, and one address. FillSync provides 3 dedicated, exhaustive profile categories containing over 220 fields:'
          ),
          bullet(
            'Travel Profile',
            'Covers IRCTC train tickets (berth preferences, coach choice, food choice, quota, Tatkal timing), Flight bookings (IATA airport codes, passport validity, frequent flyer, meal selection), and Bus bookings (boarding landmark, dropping point).'
          ),
          bullet(
            'Full 6-Passenger Family Roster',
            'Indian train and flight forms allow booking up to 6 passengers at once. FillSync has a complete roster for Passenger 1 through Passenger 6 (Name, Age, Gender, Berth, Meal, ID). The Chrome Extension auto-detects row 1, row 2, etc., and fills all 6 family members automatically!'
          ),
          bullet(
            'Frequent Journey Routes',
            'Pre-saves up to 3 common travel routes (e.g., Home to College, Delhi to Rewari, Delhi to Mumbai) so you never re-type station codes.'
          ),
          bullet(
            'Professional Profile',
            'Covers One-Time Registration (OTR), Class 10/12 roll numbers, passing year, board, CGPA, graduation degrees, GATE/CAT scores, work experience, and portfolio links.'
          ),
          bullet(
            'Government Exam Details',
            'Specifically crafted for SSC, UPSC, and Banking exams: reservation category (UR/OBC/SC/ST/EWS), certificate numbers, issuing authority (Tehsildar/SDM), domicile state, and physical identification marks.'
          ),
          bullet(
            'Personal Profile',
            'Aadhaar number (12 digits), PAN card (10 digits), Voter ID, Passport, blood group, permanent address, and correspondence address.'
          ),

          p(''),

          h2('Feature B: Smart Image & Document Resizer Studio (Built-In)'),
          p(
            'One of the biggest headaches for students in government exams and college forms is file size limits. A form will reject your photo if it is 55 KB instead of 20–50 KB, or reject your signature if it is 25 KB instead of 10–20 KB.'
          ),
          p(
            'FillSync solves this with a built-in Client-Side Image Resizer Studio located in the browser:'
          ),
          bullet(
            'Preset 1: Govt Exam Passport Photo',
            'Automatically scales images to 3.5cm x 4.5cm (350x450px) and compresses the file strictly between 20 KB and 50 KB.'
          ),
          bullet(
            'Preset 2: Signature Photo',
            'Scales signature scans to 3.5cm x 1.5cm (280x120px) with background contrast enhancement, compressed between 10 KB and 20 KB.'
          ),
          bullet(
            'Preset 3: Postcard Photo',
            'For NEET and defence entrance exams (4x6 inch, 50–100 KB).'
          ),
          bullet(
            'Preset 4: Academic Certificates',
            'Compresses marksheets and certificates to under 200 KB.'
          ),
          bullet(
            'Zero Server Upload (Privacy First)',
            'All image processing happens directly inside the user\'s browser using HTML5 Canvas. Photos are never uploaded to any third-party server, ensuring 100% privacy.'
          ),

          p(''),

          h2('Feature C: One-Click Chrome Extension Automation'),
          bullet(
            'Intelligent Field Matching',
            'Finds form fields using IDs, names, aria-labels, placeholder text, and surrounding labels. Even if a field is named "usr_dob", "birth_date", "DateOfBirth", or "dob", FillSync maps it correctly.'
          ),
          bullet(
            'Human-Like Typing Delays',
            'Government exam portals and IRCTC use bot detection algorithms. If a form is filled in 0.01 seconds, the site blocks the user. FillSync simulates real human keystrokes with randomized delays (30ms to 80ms) and triggers standard JavaScript input, change, and blur events.'
          ),
          bullet(
            'Multi-Step Form Automation',
            'For forms spread across multiple tabs or pages, FillSync fills Step 1, clicks "Next", detects when Step 2 DOM loads, and automatically fills Step 2.'
          ),

          p(''),

          h2('Feature D: Smart Templates & Dynamic {Variables}'),
          p(
            'For essay-type fields (like "Why do you want to join this college?", "Cover letter", or "Project description"), FillSync allows users to create Smart Templates with dynamic variables like {fullName}, {cgpa}, {collegeName}, and {skills}. The extension extracts real values from your profile and generates personalized cover letters on the fly.'
          ),

          p(''),

          h2('Feature E: Freemium Subscription & Real Banking Settlement'),
          p(
            'FillSync offers a realistic, highly attractive pricing model tailored for Indian students:'
          ),
          bullet(
            'Free Plan (Free Forever)',
            'Includes 3 built-in profiles, up to 2 custom folders, up to 5 smart templates, and single-passenger form filling.'
          ),
          bullet(
            'Premium Student Plan (₹99 for 3 Months)',
            'Priced at just ₹33/month (billed quarterly at ₹99 for 90 days). Unlocks unlimited folders, full 6-passenger family roster, the Image Resizer Studio, 19-document vault, and Gemini AI dynamic field mapping.'
          ),
          bullet(
            'Real Razorpay Settlement',
            'Integrated with Razorpay API. When deployed, payments made via UPI (Google Pay, PhonePe, Paytm, QR scan) or Cards settle directly into the developer\'s Indian bank account on a T+1 schedule.'
          ),
          bullet(
            'Academic Demo Fallback',
            'For localhost demonstrations and professor evaluations, FillSync includes an instant 1-click test upgrade mode that works offline without charging real money.'
          ),

          p(''),

          h2('Feature F: Enterprise-Grade Data Security'),
          bullet(
            'AES-256-CBC Encryption',
            'Sensitive personal fields (phone number, street address) are encrypted at rest using industry-standard AES-256 encryption before being saved to the database.'
          ),
          bullet(
            'Admin PII Masking',
            'Even the SuperAdmin cannot see full phone numbers or addresses. The admin dashboard masks them as "98****3210" to prevent misuse.'
          ),
          bullet(
            'Bcrypt Password Hashing',
            'User passwords are never stored in plaintext. They are salted and hashed using bcrypt (10 rounds).'
          ),
          bullet(
            'JWT Token Authentication',
            'All API requests are protected by secure JSON Web Tokens with strict role-based access control.'
          ),

          p(''),

          // Section 5: How to Run
          h1('5. How to Run FillSync Locally (Quick Steps)'),
          p(
            'Any team member can run the entire project on their laptop in 2 simple steps:'
          ),
          createTable(
            ['Method', 'Steps to Execute', 'Expected Outcome'],
            [
              [
                'Option 1 (Fastest)',
                '1. Open PRJ-1 folder in Windows Explorer.\n2. Double-click run.bat.',
                'Both Backend (Port 5000) and Frontend (Port 5173) start in one window.'
              ],
              [
                'Option 2 (VS Code)',
                '1. Open VS Code.\n2. Open Terminal (Ctrl + `).\n3. Type: .\\run.bat (or node fillsync/start-project.js).',
                'Starts live server logs in the integrated terminal.'
              ],
              [
                'Option 3 (Browser Extension)',
                '1. Open Chrome and go to chrome://extensions.\n2. Enable Developer Mode (top right).\n3. Click "Load unpacked".\n4. Select fillsync/extension folder.',
                'The FillSync extension icon appears in Chrome toolbar!'
              ]
            ]
          ),

          p(''),
          p('Login Credentials for Demo:'),
          bullet('SuperAdmin Login', 'Email: admin@fillsync.com | Password: Admin@123'),
          bullet('User Website URL', 'http://localhost:5173'),
          bullet('Backend API URL', 'http://localhost:5000'),

          p(''),

          // Section 6: Viva Questions & Answers
          h1('6. Likely Evaluation / Viva Questions & Answers'),
          p(
            'Here are answers to common questions professors and evaluators might ask:'
          ),

          bullet(
            'Q1: How is FillSync different from Google Chrome Autofill?',
            'Answer: Chrome Autofill only saves basic fields (Name, Email, 1 Address, Card). It cannot handle Indian-specific complex forms like IRCTC berth preferences, quota types, 6-passenger family rosters, Class 10/12 marks, caste certificates, or resize photos to strict 20-50 KB limits. FillSync handles all of these.'
          ),
          bullet(
            'Q2: How does the Chrome Extension match fields if the website uses strange IDs?',
            'Answer: FillSync uses a multi-layered heuristic matching algorithm. It first checks element ID and name attributes, then inspects aria-labels and placeholder text, and finally uses fuzzy synonym matching (e.g., matching "dob", "birth_date", "bday" to Date of Birth). In Premium mode, Gemini AI handles completely unfamiliar structures.'
          ),
          bullet(
            'Q3: Why did you build an in-browser image resizer instead of uploading to a server?',
            'Answer: Two reasons: Privacy and Speed. Uploading sensitive photos and signatures to an external server creates security risks. By using HTML5 Canvas client-side, the resizing happens in 0.2 seconds right on the user\'s machine without any network latency or privacy leakage.'
          ),
          bullet(
            'Q4: How do you prevent website bot detectors from blocking the auto-fill?',
            'Answer: We implemented human-like randomized typing delays (30ms to 80ms between keystrokes) and trigger genuine DOM input, change, and blur events, making the browser think a human is typing.'
          ),
          bullet(
            'Q5: How is user data protected against database theft?',
            'Answer: We use military-grade AES-256-CBC encryption with unique initialization vectors (IV). Even if someone steals the database file, private fields like phone numbers and home addresses cannot be decrypted without the secret key. Furthermore, the admin portal enforces PII masking.'
          ),

          p(''),
          calloutBox(
            'Summary Note for the Presentation',
            'When presenting, emphasize our 3 core differentiators: 1) Indian government and travel form specialization (6-passenger roster, 220+ fields), 2) Built-in photo/signature resizer studio, and 3) Bank-grade AES-256 encryption with client-side privacy.'
          )
        ]
      }
    ]
  });

  const outputPath = 'd:\\BMU\\5th sem\\PRJ-1\\FillSync_Project_Master_Guide_Team_Handbook.docx';
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully generated Word Document at:', outputPath);
}

generateDocx().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
