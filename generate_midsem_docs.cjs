/**
 * ============================================================================
 * SCRIPT: generate_midsem_docs.cjs
 * PURPOSE: Generates both:
 *          1. FillSync_PRJ1_Mid_Sem_Report.docx (Word Document)
 *          2. FillSync_PRJ1_Mid_Sem_Presentation.pptx (PowerPoint Presentation)
 * Strictly adhering to the PRJ1 Mid-Term Evaluation Rubrics:
 * - Expected Deliverables for PRJ1 Mid Term Evaluation
 * - Literature Review (Comprehensiveness: 10 Marks | Research Gap: 5 Marks)
 * - Methodology (Objective/Problem Definition: 5 Marks | Proposed Methodology: 5 Marks)
 * ============================================================================
 */

const fs = require("fs");
const path = require("path");
const docx = require("./fillsync/users/backend/node_modules/docx");
const PptxGenJS = require("./fillsync/users/backend/node_modules/pptxgenjs");

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
} = docx;

// ----------------------------------------------------------------------------
// COLOR PALETTE & STYLES (Professional Minimalist Academic Palette)
// ----------------------------------------------------------------------------
const TEAL_COLOR = "0D9488";
const DARK_SLATE = "0F172A";
const MUTED_GRAY = "64748B";
const LIGHT_BG = "F8FAFC";
const BORDER_COLOR = "CBD5E1";

// ============================================================================
// PART 1: WORD DOCUMENT GENERATION (.docx)
// ============================================================================
function createWordDocument() {
  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR }
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22, color: DARK_SLATE } // 11pt
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } // 1 inch margins
          }
        },
        children: [
          // TITLE HEADER
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "PROJECT - 1 (PRJ-1) : MID-TERM EVALUATION REPORT",
                bold: true,
                size: 28,
                color: TEAL_COLOR
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "FillSync — Smart Multi-Domain Form Automation & Profile Vault",
                bold: true,
                size: 24,
                color: DARK_SLATE
              })
            ]
          }),

          // STUDENT & COURSE METADATA TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "Project Title", bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun("FillSync: Smart Multi-Domain Form Automation & Profile Vault")] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Course & Semester", bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun("B.Tech Computer Science & Engineering — 5th Semester (PRJ-1)")] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Evaluation Type", bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun("Mid-Term Evaluation (Deliverables, Literature Review, Methodology)")] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Live Deployments", bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun("Web Application: https://fillsync-web-mocha.vercel.app\n"),
                          new TextRun("Live API: https://fillsync-api.onrender.com/api\n"),
                          new TextRun("Testing Sandbox: https://fillsync-web-mocha.vercel.app/test-form.html")
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 1: EXPECTED DELIVERABLES
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: "1. Expected Deliverables for PRJ1 Mid-Term Evaluation",
                bold: true,
                color: TEAL_COLOR
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "As per the course guidelines, the mid-term evaluation focuses on problem definition, existing literature analysis, research gaps, architectural design, and an initial functional prototype. The expected deliverables achieved are:"
              )
            ]
          }),

          // Bullet points of deliverables
          createBulletPoint("Deliverable 1: Comprehensive Literature Review & Gap Analysis", "Systematic review of existing web autofill solutions, password managers, RPA tools, and domain-specific scripts."),
          createBulletPoint("Deliverable 2: Complete Software Architecture & System Design", "Layered full-stack architecture comprising a React client, Node/Express REST API, and Chrome Manifest V3 content script."),
          createBulletPoint("Deliverable 3: Data Vault & AES-256 Field Encryption Scheme", "Categorized profile storage (Personal, Professional, Travel) with bank-grade AES-256-CBC encryption for sensitive PII (Aadhaar, PAN, phone)."),
          createBulletPoint("Deliverable 4: Working Chrome Extension & DOM Injection Prototype", "Functional browser extension that detects web form elements and injects data with human-like delays."),
          createBulletPoint("Deliverable 5: Live Cloud Deployment & Testing Sandbox", "Frontend hosted on Vercel, API backend hosted on Render, and an interactive test sandbox (test-form.html) for live demonstration."),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 2: LITERATURE REVIEW
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: "2. Literature Review",
                bold: true,
                color: TEAL_COLOR
              })
            ]
          }),

          // SUB-SECTION 2.1: COMPREHENSIVENESS (10 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 120, after: 100 },
            children: [
              new TextRun({
                text: "2.1 Comprehensiveness of the Literature Review (10 Marks)",
                bold: true,
                color: DARK_SLATE
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "We examined four major classes of systems currently used by individuals and businesses to fill online forms. Each system was evaluated based on data flexibility, multi-passenger handling, dropdown matching, and data security:"
              )
            ]
          }),

          createSubHeading("Class A: Native Browser Autofill (Google Chrome, MS Edge, Apple Safari)"),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun(
                "Browsers include built-in address and credit card autofill. They rely on standard HTML autocomplete attributes (e.g., autocomplete='email'). While fast and convenient, they have severe limitations: they only support a single personal identity (cannot maintain separate profiles for travel vs. jobs), cannot fill complex multi-row tables (e.g. 4 passengers in train/flight booking), and fail when websites use custom names or non-standard form fields."
              )
            ]
          }),

          createSubHeading("Class B: Commercial Password Managers (Bitwarden, 1Password, LastPass)"),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun(
                "Password managers store login credentials, identity cards, and credit cards in an encrypted vault. While security is strong, their form-filling capability is strictly designed for login pages and basic checkout screens. They do not handle Indian academic/government application forms (which require 10th/12th roll numbers, father's name, caste categories, APAAR/ABC IDs) and cannot handle multi-step portals."
              )
            ]
          }),

          createSubHeading("Class C: Robotic Process Automation & Headless Bots (Selenium, Puppeteer, UiPath)"),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun(
                "RPA systems automate web interactions via headless browsers or desktop agents. While powerful for enterprise batch processing, they are completely unsuited for everyday consumers: they require programming scripts, break whenever website HTML changes, and get immediately blocked by anti-bot web application firewalls (WAFs) and CAPTCHAs."
              )
            ]
          }),

          createSubHeading("Class D: Niche Script Extensions (IRCTC Tatkal Scripts, Exam Extension Tools)"),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "Independent developers have built small scripts for specific portals like IRCTC train booking. However, these tools are hard-coded to a single website URL, store raw user credentials in plain text in the browser without encryption, and become completely useless as soon as the target website updates its DOM structure."
              )
            ]
          }),

          // COMPARATIVE ANALYSIS TABLE
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({ text: "Table 1: Comprehensive Comparison of Existing Solutions vs. FillSync", bold: true })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Feature / Metric", 24),
                  createTableHeaderCell("Browser Autofill", 19),
                  createTableHeaderCell("Password Managers", 19),
                  createTableHeaderCell("RPA (Selenium/UiPath)", 19),
                  createTableHeaderCell("FillSync (Proposed)", 19)
                ]
              }),
              createTableRow("Multi-Domain Profiles", "No (Flat single profile)", "Limited to 1 identity", "Requires code changes", "Yes (Travel, Job, Personal)"),
              createTableRow("Multi-Passenger Tables", "No (1 person only)", "No", "Scripted per portal", "Yes (1 to 6 Passengers)"),
              createTableRow("Smart Dropdown Select", "Exact match only", "Basic matching", "Rigid XPaths", "Fuzzy + Synonym Matching"),
              createTableRow("Sensitive Data Encryption", "OS Keystore only", "Encrypted Vault", "Plaintext in config files", "AES-256-CBC Field Encryption"),
              createTableRow("Anti-Bot Human Delays", "None (Instant dump)", "None", "Detected as headless", "Simulated Human Typing"),
              createTableRow("Dynamic Smart Templates", "No", "No", "Custom template engines", "Yes (With prompt variables)")
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // SUB-SECTION 2.2: RESEARCH GAP (5 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 140, after: 100 },
            children: [
              new TextRun({
                text: "2.2 Research Gap (5 Marks)",
                bold: true,
                color: DARK_SLATE
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "From our literature review, we identified five critical research and technical gaps in existing form-filling technologies:"
              )
            ]
          }),

          createGapPoint("1. Flat Storage vs. Multi-Domain Real-Life Needs", "Current autofills store only one flat name, phone, and address. In reality, a user needs completely different data sets depending on the context: a Job Application requires academic roll numbers and CGPA; an IRCTC booking requires boarding station and berth choices; a Govt Exam requires caste category and parent names."),
          createGapPoint("2. Complete Failure on Multi-Row Passenger Tables", "No general-purpose autofill tool can populate repeating tables (e.g. Passenger 1 Name/Age/Gender, Passenger 2 Name/Age/Gender) in travel booking sites. Users are forced to manually type family details during fast-expiring Tatkal ticket windows."),
          createGapPoint("3. Dropdown Rigidness (<select> & Radio Options)", "Existing tools only match exact string values. If a form uses 'UR' instead of 'General', or 'SL' instead of 'Sleeper Class', traditional tools fail completely. There is a lack of synonym dictionaries and closest-neighbor fuzzy matching."),
          createGapPoint("4. Security & Privacy vs. Cloud Convenience Dilemma", "Users must choose between convenient browser extensions that store data unencrypted or rigid password managers that cannot fill local Indian forms. A secure system with field-level transparent AES-256 encryption is missing."),
          createGapPoint("5. Lack of Dynamic Smart Templates with Variables", "When applying to jobs or networking, users constantly rewrite boilerplate emails. No autofill solution integrates variable-injected text templates (e.g. {Company}, {Role}, {Skill}) that can be populated on the fly into any web text area."),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 3: METHODOLOGY
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: "3. Methodology",
                bold: true,
                color: TEAL_COLOR
              })
            ]
          }),

          // SUB-SECTION 3.1: OBJECTIVES & PROBLEM DEFINITION (5 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 120, after: 100 },
            children: [
              new TextRun({
                text: "3.1 Objective / Problem Definition (5 Marks)",
                bold: true,
                color: DARK_SLATE
              })
            ]
          }),

          createSubHeading("A. Problem Definition"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "Students and professionals in India repeatedly type the same 20 to 50 personal, academic, and identification details across dozens of web portals every month (college placements, UPSC/SSC registration, CUET/JEE admissions, visa forms, and IRCTC train bookings). This repetitive manual typing leads to high typing fatigue, data entry errors (e.g., mistyped roll numbers or Aadhaar numbers), missed application deadlines, and lost tickets during Tatkal booking windows. Existing autofill tools fail on complex Indian portals due to custom field names, multi-passenger tables, and dropdown selection boxes."
              )
            ]
          }),

          createSubHeading("B. Project Objectives"),
          createBulletPoint("Objective 1: Multi-Domain Categorized Profile Vault", "Design and implement a structured vault organizing 220+ fields into domain-specific profiles (Personal, Professional, Travel) plus unlimited custom folders."),
          createBulletPoint("Objective 2: Intelligent DOM Injection Engine", "Build a lightweight Chrome Extension (Manifest V3) that inspects web pages, maps synonyms, and fills inputs, textareas, and radio buttons in one click."),
          createBulletPoint("Objective 3: Fuzzy Dropdown (<select>) Matcher", "Develop an algorithm that matches and selects the exact or closest matching option in dropdown menus using synonym maps and string similarity."),
          createBulletPoint("Objective 4: Multi-Passenger Tatkal Roster Automation", "Support automated filling of up to 6 passengers simultaneously into repeating table rows for train and flight booking platforms."),
          createBulletPoint("Objective 5: Bank-Grade Data Security (AES-256)", "Enforce AES-256-CBC encryption for all sensitive user data at rest with random IVs and zero-knowledge admin masking."),

          new Paragraph({ spacing: { after: 160 } }),

          // SUB-SECTION 3.2: PROPOSED METHODOLOGY (5 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 120, after: 100 },
            children: [
              new TextRun({
                text: "3.2 Proposed Methodology (Tools / Techniques / Methods / Data Set) (5 Marks)",
                bold: true,
                color: DARK_SLATE
              })
            ]
          }),

          createSubHeading("A. Tools & Technology Stack"),
          createBulletPoint("Frontend Web Portal", "React.js, Tailwind CSS, Vite. Deployed globally on Vercel with responsive mobile/desktop UI."),
          createBulletPoint("Backend API Server", "Node.js, Express.js. RESTful API architecture deployed on Render with JWT token authentication."),
          createBulletPoint("Browser Extension", "Chrome Extension Manifest V3. Content script (domInjector.js) for DOM access and popup UI (popup.js) for profile selection."),
          createBulletPoint("Security & Encryption", "Node.js Crypto module: AES-256-CBC with SHA-256 key derivation and random 16-byte IVs; bcrypt for password hashing."),

          createSubHeading("B. Techniques & Methods"),
          createBulletPoint("1. Smart Synonym Matching Dictionary", "The extension tokenizes input descriptors (name, id, placeholder, label) and matches them against an extensive keyword dictionary covering 50+ common form field variants (e.g., father_name, fathername, candidate_father)."),
          createBulletPoint("2. Closest Nearest Option Algorithm for Dropdowns", "When encountering an HTML <select> dropdown, the algorithm first checks exact text/value, then checks standard Indian synonym maps (e.g., UR -> General, SL -> Sleeper), and finally applies character overlap similarity to choose the nearest matching option."),
          createBulletPoint("3. Sequential & Indexed Multi-Row Table Injection", "For passenger booking forms, the engine maps both indexed forms (passengerName[0], passengerAge[0]) and sequential table rows, allowing all passengers (1 to 6) to be filled in order."),
          createBulletPoint("4. Human-Like Keystroke Delays & Native Event Dispatch", "Rather than setting raw DOM values instantly, FillSync triggers native 'input' and 'change' events with 120ms delays (or 15ms Turbo mode) to ensure modern frameworks (React/Angular) detect state changes."),

          createSubHeading("C. Data Set & Schema Design"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "FillSync is grounded in an exhaustive schema of 220+ verified real-world fields derived from analyzing active Indian application portals:"
              )
            ]
          }),
          createBulletPoint("Personal Profile Schema (65+ Fields)", "Candidate Name, DOB, Gender, Blood Group, Father/Mother Name, Category/Caste, Full Address, Pin Code, Aadhaar, PAN, Passport, Voter ID, Driving License."),
          createBulletPoint("Professional & Academic Schema (80+ Fields)", "10th/12th Board Roll Numbers, Passing Years, College Name, Degree, CGPA, Percentage, APAAR/ABC ID, DigiLocker ID, Portfolio Link, Skills."),
          createBulletPoint("Travel & IRCTC Schema (75+ Fields)", "Origin Station, Destination, Boarding Point, IRCTC User ID, Quota, Class, Passenger 1-6 details (Full Name, Age, Gender, Berth Preference, Meal Preference)."),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 4: CONCLUSION & PROGRESS SUMMARY
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: "4. Current Status & Deliverables Summary",
                bold: true,
                color: TEAL_COLOR
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "All planned mid-term deliverables have been completed, verified, and deployed live:"
              )
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Mid-Term Milestone", 35),
                  createTableHeaderCell("Implementation Status", 25),
                  createTableHeaderCell("Verification Method", 40)
                ]
              }),
              createTableRow("Literature Review & Gap Analysis", "100% Completed", "Documented in report & presentation"),
              createTableRow("Core Architecture & Encrypted DB", "100% Completed", "AES-256-CBC with SHA-256 keys active"),
              createTableRow("Chrome Extension (Manifest V3)", "100% Completed", "domInjector.js with smart select & fuzzy match"),
              createTableRow("Live Web Application", "100% Completed", "Deployed on Vercel: fillsync-web-mocha.vercel.app"),
              createTableRow("Testing & Validation Sandbox", "100% Completed", "Deployed at /test-form.html with real-world forms")
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: "— End of PRJ-1 Mid-Term Evaluation Report —",
                bold: true,
                color: MUTED_GRAY,
                size: 20
              })
            ]
          })
        ]
      }
    ]
  });

  return doc;
}

// Helper functions for Word Doc
function createBulletPoint(title, text) {
  return new Paragraph({
    spacing: { after: 80 },
    bullet: { level: 0 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: DARK_SLATE }),
      new TextRun({ text })
    ]
  });
}

function createGapPoint(title, text) {
  return new Paragraph({
    spacing: { after: 80 },
    bullet: { level: 0 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: TEAL_COLOR }),
      new TextRun({ text })
    ]
  });
}

function createSubHeading(title) {
  return new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [
      new TextRun({ text: title, bold: true, size: 22, color: DARK_SLATE })
    ]
  });
}

function createTableHeaderCell(text, widthPercent) {
  return new TableCell({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: TEAL_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL_COLOR },
      left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR }
    },
    shading: { fill: "0F172A", type: ShadingType.CLEAR },
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })]
      })
    ]
  });
}

function createTableRow(col1, col2, col3, col4, col5) {
  const border = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR }
  };
  return new TableRow({
    children: [
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col1, bold: true, size: 19 })] })] }),
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col2, size: 19 })] })] }),
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col3, size: 19 })] })] }),
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col4, size: 19 })] })] }),
      new TableCell({
        borders: border,
        shading: { fill: "F0FDFA", type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: col5, bold: true, color: TEAL_COLOR, size: 19 })] })]
      })
    ]
  });
}

// ============================================================================
// PART 2: POWERPOINT PRESENTATION GENERATION (.pptx)
// ============================================================================
function createPowerPointPresentation() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Bhargavesh";
  pptx.title = "FillSync — PRJ-1 Mid Term Presentation";

  // Common Header Template for Content Slides
  function addHeader(slide, title, category) {
    // Top Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.9,
      fill: { color: "0F172A" }
    });

    slide.addText(category ? `${category.toUpperCase()} — PRJ-1 MID-TERM` : "PRJ-1 MID-TERM EVALUATION", {
      x: 0.6,
      y: 0.15,
      w: 8.5,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: "0D9488"
    });

    slide.addText(title, {
      x: 0.6,
      y: 0.38,
      w: 11.5,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: "FFFFFF"
    });

    // Subtle bottom rule
    slide.addShape(pptx.ShapeType.line, {
      x: 0,
      y: 0.9,
      w: "100%",
      h: 0,
      line: { color: "0D9488", width: 2.5 }
    });
  }

  // SLIDE 1: TITLE SLIDE (Dark Premium Theme)
  {
    const s1 = pptx.addSlide();
    s1.background = { color: "0F172A" };

    s1.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.2,
      w: 1.8,
      h: 0.35,
      fill: { color: "0D9488" },
      radius: 4
    });
    s1.addText("PRJ-1 MID-TERM EVALUATION", {
      x: 0.8,
      y: 1.2,
      w: 1.8,
      h: 0.35,
      fontSize: 9,
      bold: true,
      color: "FFFFFF",
      align: "center"
    });

    s1.addText("FillSync: Smart Multi-Domain Form Automation\n& Categorized Profile Vault", {
      x: 0.8,
      y: 1.8,
      w: 11.5,
      h: 1.8,
      fontSize: 32,
      bold: true,
      color: "FFFFFF"
    });

    s1.addText("Automating College Admissions, Job Placements, UPSC/Govt Exams, and IRCTC Tatkal Bookings", {
      x: 0.8,
      y: 3.7,
      w: 11.5,
      h: 0.5,
      fontSize: 15,
      color: "94A3B8"
    });

    // Metadata Card
    s1.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 4.6,
      w: 11.5,
      h: 1.8,
      fill: { color: "1E293B" },
      line: { color: "334155", width: 1 },
      radius: 6
    });

    s1.addText(
      "Student: Bhargavesh  |  Degree: B.Tech Computer Science & Engineering (5th Semester)\n" +
      "Course: Project - 1 (PRJ-1)  |  Live App: fillsync-web-mocha.vercel.app  |  Status: 100% Deployed",
      {
        x: 1.1,
        y: 4.9,
        w: 11.0,
        h: 1.2,
        fontSize: 13,
        color: "E2E8F0"
      }
    );
  }

  // SLIDE 2: EXPECTED DELIVERABLES FOR PRJ-1 MID TERM
  {
    const s2 = pptx.addSlide();
    addHeader(s2, "Expected Deliverables for PRJ-1 Mid-Term Evaluation", "Deliverables Overview");

    const deliverables = [
      { num: "01", title: "Comprehensive Literature Review", desc: "Detailed analysis of 4 classes of existing autofill systems with a comparative feature matrix and 5 documented research gaps." },
      { num: "02", title: "System Architecture & Security Model", desc: "Three-tier architecture (Client Web Portal, Node.js REST API, Chrome Extension) with AES-256-CBC field encryption for PII." },
      { num: "03", title: "Working Manifest V3 Chrome Extension", desc: "Functional browser extension with DOM injector, smart synonym dictionary, and multi-passenger sequential table filler." },
      { num: "04", title: "Fuzzy Dropdown & Radio Button Matcher", desc: "Algorithmic selection of closest matching options in HTML <select> dropdowns and radio buttons using token similarity." },
      { num: "05", title: "Live Deployments & Interactive Sandbox", desc: "Vercel frontend (fillsync-web-mocha.vercel.app), Render API backend, and an interactive test form (test-form.html) for live viva testing." }
    ];

    deliverables.forEach((d, i) => {
      const yPos = 1.2 + i * 1.05;
      s2.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 0.9,
        fill: { color: "F8FAFC" },
        line: { color: "E2E8F0", width: 1 },
        radius: 6
      });

      s2.addShape(pptx.ShapeType.rect, {
        x: 1.0,
        y: yPos + 0.15,
        w: 0.6,
        h: 0.6,
        fill: { color: "0D9488" },
        radius: 4
      });
      s2.addText(d.num, {
        x: 1.0,
        y: yPos + 0.15,
        w: 0.6,
        h: 0.6,
        fontSize: 12,
        bold: true,
        color: "FFFFFF",
        align: "center"
      });

      s2.addText(d.title, {
        x: 1.8,
        y: yPos + 0.12,
        w: 10.0,
        h: 0.3,
        fontSize: 13,
        bold: true,
        color: "0F172A"
      });
      s2.addText(d.desc, {
        x: 1.8,
        y: yPos + 0.42,
        w: 10.0,
        h: 0.4,
        fontSize: 11,
        color: "64748B"
      });
    });
  }

  // SLIDE 3: LITERATURE REVIEW — COMPREHENSIVENESS (10 MARKS)
  {
    const s3 = pptx.addSlide();
    addHeader(s3, "Comprehensiveness of Literature Review (10 Marks)", "Literature Review");

    const categories = [
      {
        title: "1. Browser Built-In Autofill (Chrome, Edge, Safari)",
        points: ["Relies strictly on standard HTML autocomplete tags", "Single flat identity (cannot separate Job vs. Travel profiles)", "Fails completely on multi-row tables & custom form names"]
      },
      {
        title: "2. Password Managers (Bitwarden, 1Password, LastPass)",
        points: ["Designed for login credentials and credit cards", "Cannot store Indian academic/govt fields (Roll No., Caste, APAAR)", "No support for multi-step application journeys"]
      },
      {
        title: "3. Robotic Process Automation (Selenium, Puppeteer)",
        points: ["Requires writing code and custom XPath scripts", "Fragile: breaks immediately when website UI updates", "Blocked by Anti-Bot Firewalls & CAPTCHA mechanisms"]
      },
      {
        title: "4. Niche Tatkal Scripts & Single-Portal Extensions",
        points: ["Hard-coded to single websites (e.g. IRCTC only)", "Stores user passwords and cards unencrypted in plaintext", "Zero adaptability across university or job portals"]
      }
    ];

    categories.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + col * 5.9;
      const yPos = 1.3 + row * 2.6;

      s3.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 5.6,
        h: 2.3,
        fill: { color: "F8FAFC" },
        line: { color: "CBD5E1", width: 1 },
        radius: 6
      });

      s3.addText(c.title, {
        x: xPos + 0.3,
        y: yPos + 0.15,
        w: 5.0,
        h: 0.5,
        fontSize: 12,
        bold: true,
        color: "0F766E"
      });

      const bulletText = c.points.map((p) => `• ${p}`).join("\n");
      s3.addText(bulletText, {
        x: xPos + 0.3,
        y: yPos + 0.7,
        w: 5.0,
        h: 1.4,
        fontSize: 11,
        color: "334155",
        lineSpacing: 18
      });
    });
  }

  // SLIDE 4: LITERATURE REVIEW — COMPARISON MATRIX (10 MARKS)
  {
    const s4 = pptx.addSlide();
    addHeader(s4, "Comparative Matrix: Existing Systems vs. FillSync (10 Marks)", "Literature Review");

    const tableHeaders = [
      { text: "Evaluation Criteria", options: { bold: true, fill: "0F172A", color: "FFFFFF" } },
      { text: "Browser Autofill", options: { bold: true, fill: "0F172A", color: "FFFFFF" } },
      { text: "Password Managers", options: { bold: true, fill: "0F172A", color: "FFFFFF" } },
      { text: "RPA Automation", options: { bold: true, fill: "0F172A", color: "FFFFFF" } },
      { text: "FillSync (Proposed)", options: { bold: true, fill: "0D9488", color: "FFFFFF" } }
    ];

    const tableRows = [
      tableHeaders,
      ["Profile Architecture", "Single flat identity", "Limited 1-person card", "Scripted per site", "Categorized (Job, Travel, Personal)"],
      ["Multi-Passenger Tables", "Unsupported", "Unsupported", "Requires custom code", "1 to 6 Passengers Automated"],
      ["Smart Dropdown Selection", "Exact value match only", "Basic field mapping", "Rigid XPaths", "Fuzzy + Synonym Nearest Match"],
      ["Data Encryption at Rest", "OS Protected storage", "Encrypted Cloud Vault", "Plaintext configs", "AES-256-CBC Field Encryption"],
      ["Anti-Bot Detection", "Instant dump (flagged)", "Instant dump", "Detected as headless", "Simulated Human Typing Delays"],
      ["Dynamic Smart Templates", "No", "No", "External script engine", "Built-in with Variable Prompts"]
    ];

    s4.addTable(tableRows, {
      x: 0.8,
      y: 1.3,
      w: 11.5,
      h: 5.0,
      colW: [2.5, 2.2, 2.2, 2.2, 2.4],
      fontSize: 11,
      border: { color: "CBD5E1", pt: 1 },
      align: "left",
      valign: "middle"
    });
  }

  // SLIDE 5: RESEARCH GAP (5 MARKS)
  {
    const s5 = pptx.addSlide();
    addHeader(s5, "Research Gaps Identified in Existing Literature (5 Marks)", "Research Gap");

    const gaps = [
      {
        num: "Gap 1",
        title: "Flat Storage vs. Multi-Domain Context",
        desc: "Current tools lack domain awareness: they cannot maintain separate profiles for Job Search, University Admissions, and Travel Booking under one user."
      },
      {
        num: "Gap 2",
        title: "Absence of Multi-Passenger Table Handling",
        desc: "No consumer autofill can handle multi-row tabular forms (IRCTC Tatkal / flight bookings) for 1 to 6 passengers simultaneously."
      },
      {
        num: "Gap 3",
        title: "Rigid Dropdown Selection (<select> & Radio)",
        desc: "Existing autofill fails when websites use acronyms or non-standard options (e.g. 'UR' for 'General', 'SL' for 'Sleeper', 'M' for 'Male')."
      },
      {
        num: "Gap 4",
        title: "Security vs. Usability Trade-Off",
        desc: "Browser extensions either store plaintext data or rely on closed proprietary password managers that do not transparently encrypt PII fields."
      },
      {
        num: "Gap 5",
        title: "Lack of Dynamic Prompt-Driven Templates",
        desc: "Users must repeatedly re-type cover letters and outreach emails because existing tools lack dynamic variable-injected templates."
      }
    ];

    gaps.forEach((g, i) => {
      const yPos = 1.25 + i * 1.05;
      s5.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 0.9,
        fill: { color: "F8FAFC" },
        line: { color: "0D9488", width: 1.5 },
        radius: 6
      });

      s5.addText(g.num, {
        x: 1.1,
        y: yPos + 0.15,
        w: 1.2,
        h: 0.6,
        fontSize: 14,
        bold: true,
        color: "0F766E"
      });

      s5.addText(g.title, {
        x: 2.4,
        y: yPos + 0.12,
        w: 9.6,
        h: 0.3,
        fontSize: 13,
        bold: true,
        color: "0F172A"
      });

      s5.addText(g.desc, {
        x: 2.4,
        y: yPos + 0.42,
        w: 9.6,
        h: 0.4,
        fontSize: 11,
        color: "475569"
      });
    });
  }

  // SLIDE 6: OBJECTIVE & PROBLEM DEFINITION (5 MARKS)
  {
    const s6 = pptx.addSlide();
    addHeader(s6, "Objective & Problem Definition (5 Marks)", "Methodology");

    // Problem Definition Box
    s6.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.3,
      w: 11.5,
      h: 1.6,
      fill: { color: "FEF2F2" },
      line: { color: "FECACA", width: 1 },
      radius: 6
    });
    s6.addText("PROBLEM DEFINITION", {
      x: 1.1,
      y: 1.45,
      w: 10.8,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: "DC2626"
    });
    s6.addText(
      "Filling online application forms in India (UPSC, SSC, college admissions, job applications, and IRCTC train tickets) is repetitive, time-consuming, and error-prone. Users must repeatedly type 30+ personal and academic details across dozens of portals under strict time deadlines. Existing autofills break on custom fields, fail on multi-passenger rows, and lack localized Indian synonym awareness.",
      {
        x: 1.1,
        y: 1.75,
        w: 10.8,
        h: 0.95,
        fontSize: 11.5,
        color: "7F1D1D"
      }
    );

    // Objectives Box
    s6.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 3.1,
      w: 11.5,
      h: 3.3,
      fill: { color: "F0FDFA" },
      line: { color: "CCFBF1", width: 1 },
      radius: 6
    });
    s6.addText("PROJECT OBJECTIVES", {
      x: 1.1,
      y: 3.25,
      w: 10.8,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: "0F766E"
    });

    const objectives = [
      "1. Build a Categorized Profile Vault organizing 220+ real-world fields into domain-specific profiles (Travel, Job, Personal).",
      "2. Develop a Manifest V3 Chrome Extension with an intelligent DOM injection engine for automated 1-click form population.",
      "3. Implement Smart Synonym & Fuzzy Dropdown (<select>) Matching to automatically select the nearest option on non-standard forms.",
      "4. Support Multi-Passenger Tatkal Roster Automation (Passengers 1 to 6) for repeating table rows in railway & flight booking.",
      "5. Enforce Bank-Grade AES-256-CBC Field Encryption at rest with zero-knowledge admin masking to protect user PII."
    ];

    s6.addText(objectives.join("\n\n"), {
      x: 1.1,
      y: 3.65,
      w: 10.8,
      h: 2.6,
      fontSize: 11.5,
      color: "115E59"
    });
  }

  // SLIDE 7: PROPOSED METHODOLOGY — ARCHITECTURE & TOOLS (5 MARKS)
  {
    const s7 = pptx.addSlide();
    addHeader(s7, "Proposed Methodology — System Architecture & Tools (5 Marks)", "Methodology");

    const layers = [
      {
        title: "Tier 1: Frontend Client Portal",
        tools: "React 18 • Vite • Tailwind CSS",
        host: "Hosted on Vercel Production",
        points: ["Master Profile management (220+ fields)", "Categorized Data Folders (Travel, Professional, Personal)", "Extension simulator and 1-click installer"]
      },
      {
        title: "Tier 2: Backend REST API Server",
        tools: "Node.js • Express.js • JWT Auth",
        host: "Hosted on Render Cloud API",
        points: ["RESTful endpoints for auth, profiles, folders, templates", "Stateless JWT token verification (7-day validity)", "Encrypted persistent database management"]
      },
      {
        title: "Tier 3: Browser Automation Extension",
        tools: "Chrome Manifest V3 • domInjector.js",
        host: "Runs in Isolated Browser Context",
        points: ["Active Tab DOM scanner (inputs, textareas, selects, radios)", "Human-like typing simulator (120ms delay / 15ms turbo)", "Automatic halt at CAPTCHAs & payment gateways"]
      }
    ];

    layers.forEach((l, i) => {
      const xPos = 0.8 + i * 3.95;
      s7.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 1.3,
        w: 3.7,
        h: 5.1,
        fill: { color: "F8FAFC" },
        line: { color: "CBD5E1", width: 1 },
        radius: 6
      });

      s7.addText(l.title, {
        x: xPos + 0.25,
        y: 1.5,
        w: 3.2,
        h: 0.6,
        fontSize: 13,
        bold: true,
        color: "0F766E"
      });

      s7.addText(l.tools, {
        x: xPos + 0.25,
        y: 2.1,
        w: 3.2,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: "0F172A"
      });

      s7.addText(l.host, {
        x: xPos + 0.25,
        y: 2.45,
        w: 3.2,
        h: 0.35,
        fontSize: 10,
        color: "0D9488"
      });

      const bullets = l.points.map((p) => `• ${p}`).join("\n\n");
      s7.addText(bullets, {
        x: xPos + 0.25,
        y: 2.9,
        w: 3.2,
        h: 3.2,
        fontSize: 11,
        color: "475569"
      });
    });
  }

  // SLIDE 8: PROPOSED METHODOLOGY — CORE ALGORITHMS & TECHNIQUES (5 MARKS)
  {
    const s8 = pptx.addSlide();
    addHeader(s8, "Proposed Methodology — Core Techniques & Algorithms (5 Marks)", "Methodology");

    const techniques = [
      {
        title: "1. Smart Synonym Resolution Engine",
        desc: "Tokenizes input name, ID, and placeholder into stems and evaluates against a dictionary of 50+ localized variations (e.g., father_name -> fathername, candidate_father, fathers_name)."
      },
      {
        title: "2. Closest Nearest Option Matching (<select> Dropdowns)",
        desc: "Evaluates dropdown options through a 4-stage pipeline: (1) Exact match, (2) Synonym dictionary (UR -> General, SL -> Sleeper), (3) Substring inclusion, and (4) Character overlap ratio to pick the closest match."
      },
      {
        title: "3. Sequential & Indexed Multi-Passenger Roster",
        desc: "Handles travel portals using both indexed arrays (passengerName[0], passengerAge[0]) and unindexed repeating rows, allowing Passengers 1 through 6 to be filled in order without collisions."
      },
      {
        title: "4. Military-Grade AES-256-CBC Field Encryption",
        desc: "Encrypts sensitive PII (Aadhaar, PAN, phone, address) before saving to disk using AES-256-CBC with SHA-256 derived keys and random 16-byte IVs; masks details on the admin dashboard."
      }
    ];

    techniques.forEach((t, i) => {
      const yPos = 1.25 + i * 1.32;
      s8.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 1.15,
        fill: { color: "F8FAFC" },
        line: { color: "0D9488", width: 1.5 },
        radius: 6
      });

      s8.addText(t.title, {
        x: 1.1,
        y: yPos + 0.15,
        w: 10.8,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: "0F766E"
      });

      s8.addText(t.desc, {
        x: 1.1,
        y: yPos + 0.48,
        w: 10.8,
        h: 0.55,
        fontSize: 11,
        color: "334155"
      });
    });
  }

  // SLIDE 9: DATA SET & REAL-WORLD SCHEMAS (5 MARKS)
  {
    const s9 = pptx.addSlide();
    addHeader(s9, "Proposed Methodology — Data Sets & Schema Design (5 Marks)", "Methodology");

    const datasets = [
      {
        name: "Personal Profile (65+ Fields)",
        desc: "Identity, Demographic & Contact Data",
        fields: "Full Name, Email, Phone (AES-256), DOB, Gender, Category (UR/OBC/SC/ST), Father's Name, Mother's Name, Blood Group, Permanent Address, Street, City, State, PIN Code, Aadhaar No. (Encrypted), PAN Card, Passport No., Voter ID, Driving License."
      },
      {
        name: "Professional & Academic (80+ Fields)",
        desc: "College Placements & Govt Exam Records",
        fields: "10th Roll No., 10th Passing Year, 12th Roll No., 12th Passing Year, College Name, Degree/Stream, Current CGPA, Percentage, Year of Graduation, APAAR / ABC ID, DigiLocker ID, Domicile State, Exam Centre Preferences, Skills, Portfolio URL."
      },
      {
        name: "Travel & IRCTC Profile (75+ Fields)",
        desc: "Train & Flight Tatkal Booking Roster",
        fields: "IRCTC Username, Origin Station (NDLS), Destination Station, Boarding Station, Travel Class (SL/3A/2A), Quota (General/Tatkal), Passenger 1 to 6 Details (Full Name, Age, Gender, Berth Preference, Meal Preference, Travel Insurance)."
      }
    ];

    datasets.forEach((ds, i) => {
      const xPos = 0.8 + i * 3.95;
      s9.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 1.3,
        w: 3.7,
        h: 5.1,
        fill: { color: "F8FAFC" },
        line: { color: "CBD5E1", width: 1 },
        radius: 6
      });

      s9.addText(ds.name, {
        x: xPos + 0.25,
        y: 1.5,
        w: 3.2,
        h: 0.5,
        fontSize: 13,
        bold: true,
        color: "0F766E"
      });

      s9.addText(ds.desc, {
        x: xPos + 0.25,
        y: 2.05,
        w: 3.2,
        h: 0.4,
        fontSize: 10.5,
        color: "64748B"
      });

      s9.addShape(pptx.ShapeType.line, {
        x: xPos + 0.25,
        y: 2.5,
        w: 3.2,
        h: 0,
        line: { color: "E2E8F0", width: 1 }
      });

      s9.addText("Exemplary Fields Included:", {
        x: xPos + 0.25,
        y: 2.65,
        w: 3.2,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: "0F172A"
      });

      s9.addText(ds.fields, {
        x: xPos + 0.25,
        y: 3.0,
        w: 3.2,
        h: 3.1,
        fontSize: 10.5,
        color: "334155"
      });
    });
  }

  // SLIDE 10: CURRENT WORKING STATUS & LIVE DEMO
  {
    const s10 = pptx.addSlide();
    addHeader(s10, "Current Working Status & Live Deployment (Ready for Viva Demo)", "Implementation Status");

    const links = [
      { label: "Production Web Portal", val: "https://fillsync-web-mocha.vercel.app", note: "Live on Vercel: Responsive Dashboard, Profile Editor & Folder Manager" },
      { label: "Backend REST API", val: "https://fillsync-api.onrender.com/api", note: "Live on Render: JWT Authentication & AES-256 Encrypted Persistent DB" },
      { label: "Testing & Validation Sandbox", val: "https://fillsync-web-mocha.vercel.app/test-form.html", note: "Ready-to-test multi-domain web forms (Placement, Govt Exam, IRCTC)" },
      { label: "Chrome Extension (Manifest V3)", val: "1-Click Download (.zip) from Navbar", note: "Fully packaged with smart select dropdown & radio auto-filling" }
    ];

    links.forEach((l, i) => {
      const yPos = 1.3 + i * 1.3;
      s10.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 1.15,
        fill: { color: "F8FAFC" },
        line: { color: "0D9488", width: 1.5 },
        radius: 6
      });

      s10.addText(l.label, {
        x: 1.1,
        y: yPos + 0.12,
        w: 3.5,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: "0F766E"
      });

      s10.addText(l.val, {
        x: 4.8,
        y: yPos + 0.12,
        w: 7.0,
        h: 0.35,
        fontSize: 12,
        bold: true,
        color: "0284C7"
      });

      s10.addText(l.note, {
        x: 1.1,
        y: yPos + 0.5,
        w: 10.8,
        h: 0.45,
        fontSize: 11,
        color: "475569"
      });
    });
  }

  // SLIDE 11: CONCLUSION & NEXT STEPS
  {
    const s11 = pptx.addSlide();
    s11.background = { color: "0F172A" };

    s11.addText("PRJ-1 MID-TERM EVALUATION", {
      x: 0.8,
      y: 1.0,
      w: 11.5,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: "0D9488"
    });

    s11.addText("Conclusion & Road to End-Term Deliverables", {
      x: 0.8,
      y: 1.4,
      w: 11.5,
      h: 0.8,
      fontSize: 26,
      bold: true,
      color: "FFFFFF"
    });

    const nextSteps = [
      "✓ Mid-Term Milestone Met: Literature review completed, research gaps identified, architecture designed, and prototype deployed.",
      "✓ Core Innovation: Multi-domain categorized profiles, 1-click 6-passenger roster filling, and closest-neighbor dropdown selection.",
      "✓ Bank-Grade Security: Transparent AES-256 field encryption for sensitive PII at rest with zero-knowledge admin masking.",
      "→ Next Milestone (End-Term): Integration of Google Gemini API for zero-shot dynamic semantic mapping across unforeseen portals.",
      "→ Next Milestone (End-Term): Multi-step automated page advancement and document upload vault for PDFs and signature photos."
    ];

    s11.addText(nextSteps.join("\n\n"), {
      x: 0.8,
      y: 2.5,
      w: 11.5,
      h: 3.6,
      fontSize: 13,
      color: "CBD5E1"
    });
  }

  return pptx;
}

// ============================================================================
// MAIN GENERATOR EXECUTION
// ============================================================================
async function run() {
  const outputDocxPath = path.resolve(__dirname, "FillSync_PRJ1_Mid_Sem_Report.docx");
  const outputPptxPath = path.resolve(__dirname, "FillSync_PRJ1_Mid_Sem_Presentation.pptx");

  console.log("Generating Word Document...");
  const doc = createWordDocument();
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputDocxPath, buffer);
  console.log("✓ Saved Word Document:", outputDocxPath);

  console.log("Generating PowerPoint Presentation...");
  const pptx = createPowerPointPresentation();
  await pptx.writeFile({ fileName: outputPptxPath });
  console.log("✓ Saved PowerPoint Presentation:", outputPptxPath);

  console.log("==========================================================");
  console.log("Both files generated successfully with rubrics alignment!");
  console.log("==========================================================");
}

run().catch((err) => {
  console.error("Error generating files:", err);
  process.exit(1);
});
