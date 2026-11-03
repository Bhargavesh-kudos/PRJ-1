const fs = require('fs');
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

function p(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({
    text,
    font: 'Calibri',
    size: opts.size || 22,
    color: opts.color || '222222',
    bold: opts.bold || false,
    italics: opts.italics || false
  })];

  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before || 100, after: opts.after || 100, line: 260 },
    children: runs
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 28,
        bold: true,
        color: '1E3A8A'
      })
    ]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 24,
        bold: true,
        color: '2563EB'
      })
    ]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 22,
        bold: true,
        color: '0F172A'
      })
    ]
  });
}

function bullet(boldPrefix, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 50, after: 50, line: 240 },
    children: [
      new TextRun({ text: boldPrefix + ' ', bold: true, font: 'Calibri', size: 22, color: '111827' }),
      new TextRun({ text, font: 'Calibri', size: 22, color: '374151' })
    ]
  });
}

function createTable(headers, rowsData, widths = []) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      width: widths[i] ? { size: widths[i], type: WidthType.PERCENTAGE } : undefined,
      shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: h, bold: true, font: 'Calibri', size: 20, color: 'FFFFFF' })]
        })
      ]
    }))
  });

  const bodyRows = rowsData.map((row, rIdx) => {
    const isEven = rIdx % 2 === 0;
    return new TableRow({
      children: row.map((cellText, cIdx) => new TableCell({
        width: widths[cIdx] ? { size: widths[cIdx], type: WidthType.PERCENTAGE } : undefined,
        shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC', type: ShadingType.CLEAR },
        margins: { top: 90, bottom: 90, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: cIdx === 0 ? AlignmentType.LEFT : (cIdx === 1 ? AlignmentType.CENTER : AlignmentType.LEFT),
            spacing: { before: 0, after: 0 },
            children: [
              new TextRun({
                text: cellText,
                font: 'Calibri',
                size: 20,
                color: '334151',
                bold: cellText.startsWith('✅') || cellText.startsWith('FillSync')
              })
            ]
          })
        ]
      }))
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' }
    },
    rows: [headerRow, ...bodyRows]
  });
}

async function generateReport() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } }
        },
        children: [
          // Header
          p('BML MUNJAL UNIVERSITY', { align: AlignmentType.CENTER, size: 30, bold: true, color: '1E3A8A', before: 200, after: 40 }),
          p('School of Engineering & Technology — Department of CSE', { align: AlignmentType.CENTER, size: 20, color: '64748B', before: 0, after: 180 }),
          p('PRJ-1 Mid-Term Evaluation Report (5th Semester)', { align: AlignmentType.CENTER, size: 24, bold: true, color: '2563EB', before: 0, after: 200 }),

          // Project Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
              left: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' },
              right: { style: BorderStyle.SINGLE, size: 8, color: '1E3A8A' }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 150, right: 150 },
                    children: [
                      p('Project Title:', { align: AlignmentType.CENTER, size: 18, color: '4B5563', before: 0, after: 30 }),
                      p('FillSync — Smart Form Automation & Profile Management System', { align: AlignmentType.CENTER, size: 24, bold: true, color: '1E3A8A', before: 0, after: 0 })
                    ]
                  })
                ]
              })
            ]
          }),

          p('', { before: 160, after: 60 }),

          // Team Members Table
          p('Project Team Members & Roles', { bold: true, size: 22, color: '1E3A8A', before: 120, after: 60 }),
          createTable(
            ['S.No.', 'Name', 'Assigned Roles'],
            [
              ['1', 'Bhargavesh', 'Project Lead, Backend API & Data Security (JWT Auth, Admin PII Masking)'],
              ['2', 'Mayank Verma', 'System Design & Frontend (Architecture & Frontend with Neal)'],
              ['3', 'Neal Soni', 'Frontend & UI/UX Design (React Interface & Literature Review)'],
              ['4', 'Yash Yadav', 'Browser Extension & DOM Automation (Manifest V3, 120ms Queue, Safety Halt)'],
              ['5', 'Nitin Rao', 'Database Management & Quality Testing (Persistence, Benchmark & Live Demo)']
            ],
            [10, 25, 65]
          ),

          p('', { before: 140, after: 60 }),

          // Deliverables Table
          p('Evaluation Deliverables (25 Marks)', { bold: true, size: 22, color: '1E3A8A', before: 120, after: 60 }),
          createTable(
            ['Deliverable', 'Marks', 'Coverage in this Report'],
            [
              ['1. Literature Review', '10 Marks', 'Section 1: 4 existing tool types and side-by-side comparison table.'],
              ['2. Research Gap', '5 Marks', 'Section 2: 5 clear gaps found in current tools.'],
              ['3. Objective / Problem Definition', '5 Marks', 'Section 3: Practical problem statement and 5 clear SMART goals.'],
              ['4. Proposed Methodology', '5 Marks', 'Section 4: 3-tier architecture, field matching steps, tools, and 20-site test.']
            ],
            [40, 20, 40]
          ),

          p('', { before: 200, after: 100 }),

          // -------------------------------------------------------------
          // SECTION 1: LITERATURE REVIEW
          // -------------------------------------------------------------
          h1('1. Literature Review (10 Marks)'),
          h2('1.1 Real-World Problem Context'),
          p('Every day, students and everyday web users spend hours typing identical details repeatedly:'),
          bullet('Job & Internship Applications:', 'Filling out 30 to 50 company portals (Workday, Greenhouse, Internshala), repeatedly entering full name, college roll number, CGPA, graduation year, LinkedIn, and GitHub links.'),
          bullet('High-Speed Travel Portals (IRCTC):', 'Booking Tatkal train tickets within 60 seconds. A manual delay of just 5 to 10 seconds typing passenger names and berths causes tickets to sell out.'),
          bullet('Cold Outreach Messages:', 'Copy-pasting the same networking message on LinkedIn and Gmail, manually replacing the HR name and company name by hand.'),

          h2('1.2 Analysis of Existing Tools'),
          h3('1. Built-in Browser Autofill (Google Chrome, Microsoft Edge)'),
          bullet('How it works:', 'Stores basic address and phone details. Fills inputs when it finds simple standard names like name="email".'),
          bullet('Major Drawbacks:', 'It only saves one flat list. It mixes up your travel details (IRCTC berth choices) with your job resume. Also, it fails on modern websites built with React where field IDs are randomly generated.'),

          h3('2. Password Managers (Bitwarden, 1Password)'),
          bullet('How it works:', 'Securely stores usernames and passwords for specific websites.'),
          bullet('Major Drawbacks:', 'They only handle login passwords. They cannot handle student resumes, travel preferences, or general web forms. Entries are locked to a single domain name.'),

          h3('3. Web Automation Bots (Selenium, Puppeteer)'),
          bullet('How it works:', 'Automated scripts that control a web browser using code.'),
          bullet('Major Drawbacks:', 'Requires programming knowledge. Bots type instantly in 0 milliseconds, which causes websites to flag the account as a bot and ban it. Also, trying to bypass CAPTCHAs violates website rules.'),

          h3('4. Generic Form Fillers (Basic Chrome Extensions)'),
          bullet('How it works:', 'Basic extensions that paste saved values into inputs.'),
          bullet('Major Drawbacks:', 'They do not support message templates with variables like {HR_Name}. They also run blindly and do not stop when a CAPTCHA or payment box appears on the screen.'),

          h2('1.3 Comparison Table: Existing Tools vs. FillSync'),
          createTable(
            ['Feature', 'Chrome Autofill', 'Bitwarden', 'Selenium Bots', 'Generic Fillers', 'FillSync (Ours)'],
            [
              ['Separate Profiles (Travel, Job, Personal)', '❌ No (Mixed)', '❌ No (Logins only)', '⚠️ Needs code', '❌ No', '✅ Yes (3 Built-in + Custom)'],
              ['Works on Modern React SPAs', '❌ Fails often', '❌ Fails often', '⚠️ Hardcoded', '❌ Static only', '✅ Yes (Reads labels + AI)'],
              ['Safe Typing Speed (Anti-Bot)', '❌ Instant', '❌ Instant', '❌ 0ms (Gets banned)', '❌ Instant', '✅ Yes (120ms human delay)'],
              ['Email Templates with {Variables}', '❌ No', '❌ No', '❌ No', '❌ No', '✅ Yes (Fills Gmail/LinkedIn)'],
              ['Stops Safely at CAPTCHAs', '❌ Ignores', '❌ Ignores', '❌ Violates rules', '❌ Ignores', '✅ Yes (Pauses for user)'],
              ['Admin Cannot See User Numbers', '❌ Plain text', '✅ Encrypted', '❌ Plain files', '⚠️ Plain text', '✅ Yes (Masked 98******10)']
            ],
            [25, 15, 15, 15, 15, 15]
          ),

          p('', { before: 200, after: 100 }),

          // -------------------------------------------------------------
          // SECTION 2: RESEARCH GAP
          // -------------------------------------------------------------
          h1('2. Research Gap (5 Marks)'),
          p('From our study of existing tools, we found 5 clear technical gaps that no existing tool solves properly:'),
          bullet('Gap 1: No Folder-Based Separation of Personas —', 'Existing tools save all data in one flat list. Users cannot keep their travel details (IRCTC berths/meals) separate from job details (CGPA, resume) and personal details.'),
          bullet('Gap 2: Autofill Fails on Modern React & JavaScript Forms —', 'Modern websites generate random field names (like id=":r1:"). Standard autofill looks only for static names and leaves these fields empty.'),
          bullet('Gap 3: No Connection Between Forms and Outreach Messages —', 'Students applying for jobs also send cold emails and LinkedIn connection notes. Today, users have to open external docs and manually edit blanks like {HR_Name}. No browser extension combines both workflows.'),
          bullet('Gap 4: Instant Typing Triggers Bot Bans —', 'Traditional automation scripts type values in 0 milliseconds, which modern websites detect as bot behavior. Also, attempting to bypass CAPTCHAs is unsafe and violates terms of service.'),
          bullet('Gap 5: Admins Can See Private User Phone Numbers —', 'Most form tools store phone numbers openly in their database, allowing website admins to view private user data in cleartext.'),

          p('', { before: 200, after: 100 }),

          // -------------------------------------------------------------
          // SECTION 3: OBJECTIVE & PROBLEM DEFINITION
          // -------------------------------------------------------------
          h1('3. Objective & Problem Definition (5 Marks)'),
          h2('3.1 Problem Definition'),
          p('“Filling online forms and sending repetitive application messages takes too much time and causes manual typing mistakes. Current browser autofill tools mix up personal and professional data and fail on modern React websites. Meanwhile, automated bots trigger account bans and violate website rules.”', { italics: true, color: '1E3A8A', bold: true }),

          h2('3.2 Our 5 Clear Goals'),
          bullet('Goal 1: Multi-Folder Data Separation —', 'Provide 3 default built-in folders (Travel, Job, Personal) and custom folders so users never mix up different details.'),
          bullet('Goal 2: Fast & Accurate Form Filling —', 'Build a Chrome extension that fills web forms in under 3 seconds with over 90% accuracy, even on dynamic modern websites.'),
          bullet('Goal 3: Smart Outreach Templates —', 'Allow users to save message templates with dynamic placeholders like {HR_Name} and {Company_Name} that insert directly into Gmail and LinkedIn.'),
          bullet('Goal 4: Anti-Bot Safe Typing —', 'Add a 120-millisecond delay between fields with native browser events so target websites treat it as normal human typing.'),
          bullet('Goal 5: Ethical Safety & Privacy —', 'Automatically pause at CAPTCHAs and payment gateways, and mask phone numbers (98******10) in admin views so user data is never leaked.'),

          p('', { before: 200, after: 100 }),

          // -------------------------------------------------------------
          // SECTION 4: PROPOSED METHODOLOGY
          // -------------------------------------------------------------
          h1('4. Proposed Methodology (5 Marks)'),
          h2('4.1 System Design (3 Parts)'),
          p('FillSync is built using 3 simple, connected parts:'),
          bullet('1. User Web Dashboard (React + Tailwind CSS):', 'Where the user logs in, sets up their Master Profile, creates folders (Travel, Job, Personal), and manages message templates.'),
          bullet('2. Backend Server (Node.js + Express):', 'Manages user accounts, issues secure JWT login tokens, and protects private data by masking phone numbers from admins.'),
          bullet('3. Chrome Extension (Manifest V3):', 'Sits in the browser, talks to the backend API, and safely fills forms on any active webpage in 1 click.'),

          h2('4.2 Core Methods Used'),
          bullet('Method 1: 3-Step Field Matching —', 'Step 1 checks standard names (name="phone"). Step 2 reads the label text next to the box. Step 3 uses Google Gemini AI fallback for confusing enterprise forms.'),
          bullet('Method 2: Human-Speed Event Queue —', 'Instead of dumping text in 0ms, the extension waits 120 milliseconds between fields and fires real browser input and change events so modern reactive forms recognize the text.'),
          bullet('Method 3: Ethical Safety Halt —', 'If the extension spots a CAPTCHA or a credit card payment box, it immediately pauses and asks the user to complete it manually.'),

          h2('4.3 Tools & Technology Used'),
          createTable(
            ['Part', 'Technology', 'Reason for Choice'],
            [
              ['Frontend Dashboard', 'React.js + Tailwind CSS', 'Fast, responsive interface that works smoothly on both laptops and mobile screens.'],
              ['Backend API', 'Node.js + Express.js', 'Lightweight, fast at handling API requests, and easy to run locally.'],
              ['Browser Extension', 'Chrome Manifest V3', 'The official, latest security standard required by Google Chrome.'],
              ['AI Fallback', 'Google Gemini API', 'Accurately identifies confusing form fields without needing complex models.'],
              ['Database Storage', 'Local JSON DB', 'Simple, reliable, runs offline for mid-term evaluation.'],
              ['Data Security', 'Bcrypt + Masking', 'Hashes passwords and hides phone numbers with stars (98******10).']
            ],
            [25, 30, 45]
          ),

          h2('4.4 Testing on 20 Real Websites'),
          p('We tested FillSync across 20 real websites in 4 categories:'),
          bullet('Travel (5 Sites):', 'IRCTC Tatkal, RedBus, MakeMyTrip, Indian Railways, Air India.'),
          bullet('Job Portals (5 Sites):', 'Workday, Greenhouse, Taleo, Internshala, LinkedIn EasyApply.'),
          bullet('Shopping (5 Sites):', 'Amazon India, Flipkart, Myntra, Nykaa, Shopify Stores.'),
          bullet('College & Govt Portals (5 Sites):', 'National Scholarship Portal, University Admissions, State ERPs.'),
          p('Results achieved: Form completion time reduced from 2 minutes down to under 3 seconds (over 75% time saved), 92% field accuracy, and 100% safe stop rate at CAPTCHAs.'),

          p('', { before: 200, after: 100 }),

          // -------------------------------------------------------------
          // SECTION 5: TEAM ROLES & SPEAKING GUIDE (5-7 MINS)
          // -------------------------------------------------------------
          h1('5. Team Roles & Presentation Guide (5 to 7 Minutes)'),
          p('Each member speaks for 1 to 1.5 minutes. Here is the concise flow:'),
          bullet('1. Bhargavesh (Project Lead, Backend API & Data Security) [~1 min]:', 'Introduces the project, explains real-world pain points (IRCTC, job forms), and explains backend API with JWT login and admin phone masking (98******10).'),
          bullet('2. Neal Soni (Frontend & UI/UX Design) [~1.5 min]:', 'Presents the Literature Review (4 existing tools: Chrome, Bitwarden, Selenium, generic fillers) and highlights the comparison table.'),
          bullet('3. Yash Yadav (Browser Extension & DOM Automation) [~1 min]:', 'Covers the 5 research gaps, our 5 clear goals, and explains how the Chrome extension automates forms safely.'),
          bullet('4. Mayank Verma (System Design & Frontend with Neal) [~1.5 min]:', 'Explains the 3-tier architecture, dashboard UI, folder organization (Travel/Job), and template editor with {Variables}.'),
          bullet('5. Nitin Rao (Database Management & Quality Testing) [~1.5 min]:', 'Presents the 20-website testing results (under 3s speed, 92% accuracy, 100% CAPTCHA safety) and leads the live demonstration.')
        ]
      }
    ]
  });

  const primaryPath = 'd:/BMU/5th sem/PRJ-1/FillSync_MidTerm_Evaluation_Report.docx';
  const fallbackPath = 'd:/BMU/5th sem/PRJ-1/FillSync_MidTerm_Report_Simple.docx';
  const buffer = await Packer.toBuffer(doc);
  try {
    fs.writeFileSync(primaryPath, buffer);
    console.log(`Report successfully written to ${primaryPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.log(`Primary file is currently open in Word. Writing to ${fallbackPath}...`);
      fs.writeFileSync(fallbackPath, buffer);
      console.log(`Report successfully written to ${fallbackPath}`);
    } else {
      throw err;
    }
  }
}

generateReport().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
