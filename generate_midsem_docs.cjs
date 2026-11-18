/**
 * ============================================================================
 * SCRIPT: generate_midsem_docs.cjs
 * PURPOSE: Generates clean, normal, human-like student deliverables for PRJ-1:
 *          1. FillSync_PRJ1_Mid_Sem_Report.docx (Word Document)
 *          2. FillSync_PRJ1_Mid_Sem_Presentation.pptx (PowerPoint Presentation)
 *
 * Style: Clean academic student style (White background, simple standard fonts,
 *        normal readable bullet points, zero artificial over-decoration).
 *
 * Rubrics Strictly Covered:
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

// Simple, standard student color styling
const COLOR_TITLE = "1E3A8A"; // Classic Navy Blue
const COLOR_BODY = "111827";  // Standard Dark Slate/Black
const COLOR_MUTED = "4B5563"; // Standard Gray
const BORDER_GRAY = "9CA3AF"; // Normal Gray Border

// ============================================================================
// PART 1: WORD DOCUMENT GENERATION (.docx)
// ============================================================================
function createWordDocument() {
  const normalBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY }
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 24, color: COLOR_BODY } // 12pt standard
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
          // Header / Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "PROJECT-1 (PRJ-1) MID TERM EVALUATION REPORT",
                bold: true,
                size: 32, // 16pt
                color: COLOR_TITLE
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "FillSync: Multi-Domain Web Form Automation & Profile Management System",
                bold: true,
                size: 26, // 13pt
                color: COLOR_BODY
              })
            ]
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: normalBorder,
                    shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "Project Title", bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: normalBorder,
                    width: { size: 72, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "FillSync — Smart Multi-Domain Form Autofill & Profile Vault", size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: normalBorder,
                    shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Course & Semester", bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: normalBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: "B.Tech Computer Science & Engineering — 5th Semester (PRJ-1)", size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: normalBorder,
                    shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Evaluation Type", bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: normalBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: "Mid-Term Evaluation (Deliverables, Literature Review, Methodology)", size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: normalBorder,
                    shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Project Links", bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: normalBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Web Portal: https://fillsync-web-mocha.vercel.app\n", size: 22 }),
                          new TextRun({ text: "Live API: https://fillsync-api.onrender.com/api\n", size: 22 }),
                          new TextRun({ text: "Test Sandbox: https://fillsync-web-mocha.vercel.app/test-form.html", size: 22 })
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
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: "1. Expected Deliverables for PRJ-1 Mid Term Evaluation",
                bold: true,
                color: COLOR_TITLE,
                size: 28
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "As required for the mid-term stage of PRJ-1, the project has focused on setting up clear requirements, studying existing tools, identifying research gaps, designing the system architecture, and creating a working prototype. Below are the key deliverables completed so far:"
              )
            ]
          }),

          createDocBullet("Literature Review and Comparison", "Studied existing web autofill tools, browser built-ins, and password managers, and identified what features they lack."),
          createDocBullet("Research Gap Identification", "Documented the core problems where traditional tools fail, specifically multi-domain profile storage, multi-passenger booking tables, and dropdown selection."),
          createDocBullet("System Architecture and Database Design", "Designed a 3-tier architecture with a React frontend, Node/Express REST API backend, and a Chrome Extension (Manifest V3)."),
          createDocBullet("AES-256 Data Encryption Scheme", "Implemented bank-grade field-level encryption (AES-256-CBC) to protect sensitive user details like Aadhaar, PAN, and phone numbers."),
          createDocBullet("Working Extension & Auto-Injection Prototype", "Built a functional browser extension that inspects web pages and fills input boxes, text areas, and dropdowns in 1 click."),
          createDocBullet("Live Web Deployment and Testing Page", "Deployed the web dashboard on Vercel, backend on Render, and built an interactive test form (test-form.html) for easy demonstration."),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 2: LITERATURE REVIEW
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: "2. Literature Review",
                bold: true,
                color: COLOR_TITLE,
                size: 28
              })
            ]
          }),

          // SUB-SECTION 2.1: COMPREHENSIVENESS (10 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 140, after: 100 },
            children: [
              new TextRun({
                text: "2.1 Comprehensiveness of the Literature Review (10 Marks)",
                bold: true,
                color: COLOR_BODY,
                size: 26
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "To understand the current state of form autofill technology, we reviewed four major types of tools that people currently use to fill online forms:"
              )
            ]
          }),

          createDocSubHeading("1. Native Browser Autofill (Google Chrome, Microsoft Edge, Safari)"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "Modern browsers have built-in autofill for basic contact details (name, email, phone) and saved credit cards. They depend heavily on standard HTML attributes (like autocomplete='email'). While they work well for standard online shopping checkouts, they have major limitations: they only store a single flat profile, cannot handle specialized Indian application forms (which ask for 10th/12th marks, roll numbers, caste categories, and father's name), and cannot fill repeating tables like booking train tickets for multiple family members."
              )
            ]
          }),

          createDocSubHeading("2. Commercial Password Managers (Bitwarden, 1Password, LastPass)"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "Password managers store login passwords, identity documents, and payment cards in an encrypted vault. While their security is strong, their form-filling feature is limited to login screens and basic checkout pages. They do not support custom domain-specific data sets (such as travel preferences, academic histories, or job application data) and cannot handle multi-step government or college admission portals."
              )
            ]
          }),

          createDocSubHeading("3. Robotic Process Automation & Browser Automation (Selenium, Puppeteer, UiPath)"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "RPA software and headless browser scripts can automate almost any web form by writing custom code. However, they are meant for automated back-office tasks, not everyday students or consumers. They require technical programming knowledge, break whenever a website updates its HTML structure, and are frequently blocked by website anti-bot protections and CAPTCHAs."
              )
            ]
          }),

          createDocSubHeading("4. Specialized Booking Scripts (IRCTC Tatkal Helper Extensions)"),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "Some developers have published small browser extensions designed solely for specific sites like IRCTC train booking. However, these tools are hardcoded to a single website, store raw user credentials in plain text without proper encryption, and stop working as soon as the target website changes its form layout."
              )
            ]
          }),

          // Table Comparison
          new Paragraph({
            spacing: { before: 120, after: 80 },
            children: [
              new TextRun({ text: "Table 1: Comparison of Existing Solutions with FillSync", bold: true, size: 24 })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createDocHeaderCell("Features", 25),
                  createDocHeaderCell("Browser Autofill", 18),
                  createDocHeaderCell("Password Managers", 19),
                  createDocHeaderCell("RPA (Selenium)", 19),
                  createDocHeaderCell("FillSync (Our System)", 19)
                ]
              }),
              createDocRow("Multiple Profiles", "No (Only 1 profile)", "Limited to 1 identity", "Requires code change", "Yes (Travel, Job, Personal)"),
              createDocRow("Multi-Person Forms", "No (1 person only)", "No", "Custom scripts needed", "Yes (1 to 6 Passengers)"),
              createDocRow("Dropdown Matching", "Exact match only", "Basic matching", "Rigid XPaths", "Fuzzy + Synonym Matching"),
              createDocRow("Sensitive Data Security", "Browser vault only", "Encrypted Vault", "Plaintext in scripts", "AES-256-CBC Encryption"),
              createDocRow("Ease of Use", "Easy", "Moderate", "Hard (Needs coding)", "Very Easy (1-Click)"),
              createDocRow("Dynamic Templates", "No", "No", "Custom scripts", "Yes (Variable Templates)")
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
                color: COLOR_BODY,
                size: 26
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "Based on the literature review, we identified five clear gaps where current solutions fail:"
              )
            ]
          }),

          createDocGapItem("Gap 1: Single Profile vs. Multiple Real-World Roles", "Users need different sets of data in different situations. A job portal needs college roll numbers and CGPA; a train ticket needs berth preferences and station codes; a government form needs caste categories and parent names. Existing autofills force all this into one flat, messy profile."),
          createDocGapItem("Gap 2: Inability to Handle Repeating Tables (Multiple Passengers)", "When booking travel for a family (like on IRCTC), users must enter details for 2 to 6 passengers into repeating table rows. No popular autofill tool can populate multiple passenger rows automatically, forcing slow manual typing during fast-expiring booking windows."),
          createDocGapItem("Gap 3: Rigid Dropdown (<select>) Selection", "Existing tools only match dropdown options if the website's text matches word-for-word. If an exam form uses 'UR' instead of 'General', or a travel site uses 'SL' instead of 'Sleeper', traditional autofill fails completely. Smart synonym matching is missing."),
          createDocGapItem("Gap 4: Lack of Integrated Text Templates with Variables", "When applying for jobs or emailing professors, users repeatedly copy-paste boilerplate text and manually change names and roles. Autofill tools focus only on short form inputs and completely ignore multi-line template injection with dynamic variables."),
          createDocGapItem("Gap 5: Security vs. Usability Trade-off", "Tools either offer zero encryption (saving plaintext data in browser extensions) or are too rigid (like enterprise password managers that don't support custom fields). A simple, transparently encrypted vault tailored for students and everyday users does not exist."),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 3: METHODOLOGY
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: "3. Methodology",
                bold: true,
                color: COLOR_TITLE,
                size: 28
              })
            ]
          }),

          // SUB-SECTION 3.1: OBJECTIVES & PROBLEM DEFINITION (5 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 140, after: 100 },
            children: [
              new TextRun({
                text: "3.1 Objective / Problem Definition (5 Marks)",
                bold: true,
                color: COLOR_BODY,
                size: 26
              })
            ]
          }),

          createDocSubHeading("A. Problem Definition"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "Students and working professionals frequently apply for internships, government exams (UPSC, SSC, State PSC), university admissions, and book train/flight tickets. Each form requires typing 20 to 50 personal, academic, and identification details repeatedly. This repetitive manual work causes high typing fatigue, leads to mistakes in critical numbers (like Aadhaar or Board roll numbers), and causes users to lose seats during time-critical windows like IRCTC Tatkal booking. Existing browser autofills fail on these portals because Indian portals use non-standard field names, complex dropdowns, and multi-row tables."
              )
            ]
          }),

          createDocSubHeading("B. Project Objectives"),
          createDocBullet("Objective 1: Multi-Domain Profile Vault", "Create an organized vault separating user data into 3 clear domains: Personal (contact & IDs), Professional (10th/12th/College marks), and Travel (stations & berth preferences), plus custom folders."),
          createDocBullet("Objective 2: 1-Click Chrome Extension Automation", "Develop a lightweight browser extension that automatically scans web pages and fills input boxes, text areas, and checkboxes in one click."),
          createDocBullet("Objective 3: Smart Synonym & Fuzzy Dropdown Matcher", "Build a matching algorithm that maps common variations (e.g., 'UR' -> 'General', 'DOB' -> 'Date of Birth') and selects the closest matching option in dropdown lists."),
          createDocBullet("Objective 4: Multi-Passenger Table Filling", "Support automated filling of up to 6 passengers into repeating table rows for travel booking sites."),
          createDocBullet("Objective 5: Bank-Grade Data Security", "Protect all sensitive identification data using AES-256-CBC encryption at rest, ensuring that confidential numbers are never stored in plain text."),

          new Paragraph({ spacing: { after: 180 } }),

          // SUB-SECTION 3.2: PROPOSED METHODOLOGY (5 MARKS)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 140, after: 100 },
            children: [
              new TextRun({
                text: "3.2 Proposed Methodology (Tools / Techniques / Methods / Data Set) (5 Marks)",
                bold: true,
                color: COLOR_BODY,
                size: 26
              })
            ]
          }),

          createDocSubHeading("A. Tools & Technology Stack"),
          createDocBullet("Frontend Portal", "Built using React.js and Tailwind CSS with Vite for fast performance. Deployed on Vercel."),
          createDocBullet("Backend API Server", "Built with Node.js and Express.js providing REST APIs with JSON Web Token (JWT) session security. Deployed on Render."),
          createDocBullet("Browser Extension", "Chrome Extension using Manifest V3 standards. Uses a content script (domInjector.js) to inspect the DOM and a popup UI (popup.js) for user interaction."),
          createDocBullet("Security & Encryption", "Node.js Crypto module using AES-256-CBC with SHA-256 key hashing and 16-byte initialization vectors (IVs) for data security."),

          createDocSubHeading("B. Techniques & Methods"),
          createDocBullet("1. Synonym Mapping Dictionary", "The extension tokenizes field names, labels, IDs, and placeholders, comparing them against a dictionary of 50+ common Indian form variations (e.g., 'father_name', 'fatherName', 'father', 'parent_name')."),
          createDocBullet("2. Dropdown Matching Algorithm", "For HTML <select> elements, the system tests 3 levels: (1) exact text/value match, (2) synonym lookup (e.g. 'UR' matches 'General'), and (3) fuzzy substring similarity to pick the closest valid option."),
          createDocBullet("3. Multi-Row Table Mapping", "For passenger booking forms, the injector handles both array-indexed field names (passenger[0].name, passenger[1].name) and sequential rows in an HTML table, filling up to 6 passengers in order."),
          createDocBullet("4. Human-Like Keystroke Delays & Native Events", "Instead of dumping values instantaneously (which triggers bot detectors or gets ignored by modern React/Angular forms), the extension dispatches native 'input' and 'change' events with realistic delays (120ms standard, 15ms turbo)."),

          createDocSubHeading("C. Data Set & Schema Design"),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                "Rather than arbitrary test data, FillSync is based on a real-world schema of 220+ verified fields collected by analyzing active Indian portals (UPSC, SSC, JEE, NTA, IRCTC, and redBus):"
              )
            ]
          }),
          createDocBullet("Personal Schema (65+ Fields)", "Full Name, DOB, Gender, Blood Group, Father/Mother Name, Caste/Category, Address, Aadhaar, PAN, Passport, Voter ID, Driving License."),
          createDocBullet("Professional Schema (80+ Fields)", "10th/12th Board Roll Numbers, Passing Years, College Name, Degree, Branch, CGPA, Percentage, DigiLocker ID, Portfolio Link, Skills."),
          createDocBullet("Travel Schema (75+ Fields)", "Origin Station, Destination, Boarding Station, IRCTC Username, Quota, Class, and Passengers 1 to 6 (Name, Age, Gender, Berth, Meal)."),

          new Paragraph({ spacing: { after: 200 } }),

          // SECTION 4: CONCLUSION
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: "4. Current Status & Summary",
                bold: true,
                color: COLOR_TITLE,
                size: 28
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun(
                "All planned deliverables for the mid-term stage have been completed. The system is functional and deployed live for demonstration:"
              )
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createDocHeaderCell("Milestone / Deliverable", 35),
                  createDocHeaderCell("Current Status", 25),
                  createDocHeaderCell("Verification / Result", 40)
                ]
              }),
              createDocRow("Literature Review & Gap Analysis", "Completed", "Documented in report & slides"),
              createDocRow("System Architecture & Database", "Completed", "Full-stack system running on Vercel & Render"),
              createDocRow("Chrome Extension (Manifest V3)", "Completed", "Working popup & domInjector.js"),
              createDocRow("Smart Dropdown & Table Autofill", "Completed", "Tested on test-form.html sandbox"),
              createDocRow("AES-256 Field Encryption", "Completed", "Active in backend for all sensitive IDs")
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "— End of PRJ-1 Mid-Term Report —",
                bold: true,
                color: COLOR_MUTED,
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

// Helpers for Word Doc
function createDocBullet(title, text) {
  return new Paragraph({
    spacing: { after: 80 },
    bullet: { level: 0 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: COLOR_BODY, size: 24 }),
      new TextRun({ text, size: 24 })
    ]
  });
}

function createDocGapItem(title, text) {
  return new Paragraph({
    spacing: { after: 80 },
    bullet: { level: 0 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: COLOR_TITLE, size: 24 }),
      new TextRun({ text, size: 24 })
    ]
  });
}

function createDocSubHeading(title) {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    children: [
      new TextRun({ text: title, bold: true, size: 24, color: COLOR_BODY })
    ]
  });
}

function createDocHeaderCell(text, widthPercent) {
  return new TableCell({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_TITLE },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_TITLE },
      left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
      right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY }
    },
    shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: COLOR_TITLE, size: 22 })]
      })
    ]
  });
}

function createDocRow(col1, col2, col3, col4, col5) {
  const border = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY }
  };
  return new TableRow({
    children: [
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col1, bold: true, size: 20 })] })] }),
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col2, size: 20 })] })] }),
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col3, size: 20 })] })] }),
      new TableCell({ borders: border, children: [new Paragraph({ children: [new TextRun({ text: col4, size: 20 })] })] }),
      new TableCell({
        borders: border,
        shading: { fill: "EFF6FF", type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: col5, bold: true, color: COLOR_TITLE, size: 20 })] })]
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

  // Standard Clean Student Header (White background, Navy header bar)
  function addSlideHeader(slide, title, category) {
    // Header Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.9,
      fill: { color: "1E3A8A" } // Classic Navy
    });

    slide.addText(category ? `${category.toUpperCase()} — PRJ-1 MID-TERM` : "PRJ-1 MID-TERM EVALUATION", {
      x: 0.8,
      y: 0.15,
      w: 8.5,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: "93C5FD" // Light Blue
    });

    slide.addText(title, {
      x: 0.8,
      y: 0.38,
      w: 11.5,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: "FFFFFF"
    });
  }

  // SLIDE 1: TITLE SLIDE (Clean White Academic Style)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };

    // Navy Accent Band on Left
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.4,
      h: "100%",
      fill: { color: "1E3A8A" }
    });

    slide.addText("PROJECT-1 (PRJ-1) : MID-TERM EVALUATION", {
      x: 1.0,
      y: 1.2,
      w: 11.0,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: "1E3A8A"
    });

    slide.addText("FillSync: Multi-Domain Web Form Automation & Profile Vault", {
      x: 1.0,
      y: 1.7,
      w: 11.2,
      h: 1.2,
      fontSize: 26,
      bold: true,
      color: "111827"
    });

    slide.addText("A smart browser extension and secure profile vault to eliminate repetitive manual form typing across college, job, government, and travel portals.", {
      x: 1.0,
      y: 3.0,
      w: 10.5,
      h: 0.8,
      fontSize: 14,
      color: "4B5563"
    });

    // Student Info Box
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.0,
      y: 4.2,
      w: 11.0,
      h: 2.2,
      fill: { color: "F3F4F6" },
      line: { color: "CBD5E1", width: 1 }
    });

    slide.addText([
      { text: "Course: ", options: { bold: true, color: "111827" } },
      { text: "B.Tech Computer Science & Engineering (5th Semester)\n", options: { color: "374151" } },
      { text: "Student Name: ", options: { bold: true, color: "111827" } },
      { text: "Bhargavesh\n", options: { color: "374151" } },
      { text: "Project Guide: ", options: { bold: true, color: "111827" } },
      { text: "Faculty Mentor (PRJ-1)\n", options: { color: "374151" } },
      { text: "Live Deployments: ", options: { bold: true, color: "111827" } },
      { text: "Web: fillsync-web-mocha.vercel.app  |  API: fillsync-api.onrender.com", options: { color: "1E3A8A" } }
    ], {
      x: 1.3,
      y: 4.4,
      w: 10.4,
      h: 1.8,
      fontSize: 13,
      lineSpacing: 24
    });
  }

  // SLIDE 2: EXPECTED DELIVERABLES FOR PRJ-1 MID TERM
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Expected Deliverables for PRJ-1 Mid Term Evaluation", "Deliverables");

    slide.addText("As per course requirements, all planned mid-term deliverables have been completed:", {
      x: 0.8,
      y: 1.2,
      w: 11.5,
      h: 0.4,
      fontSize: 13,
      color: "4B5563"
    });

    const deliverables = [
      { num: "1", title: "Comprehensive Literature Review", desc: "Systematic analysis of browser autofills, password managers, and RPA scripts with a comparison matrix." },
      { num: "2", title: "Research Gap Identification", desc: "Detailed breakdown of where current tools fail (multi-passenger tables, dropdowns, and multi-domain vaults)." },
      { num: "3", title: "Full System Architecture & Database Design", desc: "Layered architecture: React frontend on Vercel, Node.js REST API on Render, Chrome Extension (Manifest V3)." },
      { num: "4", title: "AES-256 Field Encryption Scheme", desc: "Bank-grade field-level encryption for sensitive user data (Aadhaar, PAN, phone) with random IVs." },
      { num: "5", title: "Working Chrome Extension Prototype", desc: "Functional browser extension with smart synonym detection, fuzzy dropdown selection, and 1-click form fill." }
    ];

    deliverables.forEach((item, idx) => {
      const yPos = 1.7 + idx * 0.95;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 0.82,
        fill: { color: "F9FAFB" },
        line: { color: "E5E7EB", width: 1 }
      });

      slide.addShape(pptx.shapes.OVAL, {
        x: 1.0,
        y: yPos + 0.16,
        w: 0.5,
        h: 0.5,
        fill: { color: "1E3A8A" }
      });

      slide.addText(item.num, {
        x: 1.0,
        y: yPos + 0.16,
        w: 0.5,
        h: 0.5,
        fontSize: 12,
        bold: true,
        color: "FFFFFF",
        align: "center",
        valign: "middle"
      });

      slide.addText([
        { text: item.title + " : ", options: { bold: true, color: "111827", fontSize: 13 } },
        { text: item.desc, options: { color: "4B5563", fontSize: 12 } }
      ], {
        x: 1.7,
        y: yPos + 0.1,
        w: 10.4,
        h: 0.62,
        valign: "middle"
      });
    });
  }

  // SLIDE 3: LITERATURE REVIEW - COMPREHENSIVENESS (10 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Literature Review — Comprehensiveness (10 Marks)", "Literature Review");

    slide.addText("We evaluated the 4 major existing approaches to form automation:", {
      x: 0.8,
      y: 1.1,
      w: 11.5,
      h: 0.35,
      fontSize: 13,
      color: "4B5563"
    });

    const reviews = [
      {
        title: "1. Native Browser Autofill (Chrome, Edge, Safari)",
        points: "• Stores only basic contact and card info using standard HTML autocomplete tags.\n• Limitation: Flat single profile. Cannot handle complex Indian application forms or multiple passengers."
      },
      {
        title: "2. Password Managers (Bitwarden, 1Password)",
        points: "• Strong encrypted vault for logins and credit cards.\n• Limitation: Designed only for login forms and basic checkouts; no support for academic marks, roll numbers, or multi-step portals."
      },
      {
        title: "3. Robotic Process Automation (Selenium, UiPath)",
        points: "• Powerful headless browser scripting for business automation.\n• Limitation: Requires programming knowledge, breaks whenever website HTML changes, and blocked by anti-bot firewalls."
      },
      {
        title: "4. Specialized IRCTC Tatkal Extensions",
        points: "• Niche browser scripts built only for a single portal.\n• Limitation: Stores user passwords in plain text in the browser; completely useless on any other website."
      }
    ];

    reviews.forEach((r, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + col * 5.9;
      const yPos = 1.55 + row * 2.5;

      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 5.6,
        h: 2.3,
        fill: { color: "F9FAFB" },
        line: { color: "CBD5E1", width: 1 }
      });

      slide.addText(r.title, {
        x: xPos + 0.2,
        y: yPos + 0.15,
        w: 5.2,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: "1E3A8A"
      });

      slide.addText(r.points, {
        x: xPos + 0.2,
        y: yPos + 0.6,
        w: 5.2,
        h: 1.5,
        fontSize: 11,
        color: "374151",
        lineSpacing: 18
      });
    });
  }

  // SLIDE 4: COMPARISON MATRIX (10 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Literature Review — Comparison Matrix", "Literature Review");

    const rows = [
      [
        { text: "Feature", options: { bold: true, fill: "1E3A8A", color: "FFFFFF", fontSize: 11 } },
        { text: "Browser Autofill", options: { bold: true, fill: "F3F4F6", color: "111827", fontSize: 11 } },
        { text: "Password Mgrs", options: { bold: true, fill: "F3F4F6", color: "111827", fontSize: 11 } },
        { text: "RPA (Selenium)", options: { bold: true, fill: "F3F4F6", color: "111827", fontSize: 11 } },
        { text: "FillSync (Proposed)", options: { bold: true, fill: "EFF6FF", color: "1E3A8A", fontSize: 11 } }
      ],
      [
        { text: "Domain Profiles", options: { bold: true, fontSize: 10 } },
        { text: "No (Flat profile)", options: { fontSize: 10 } },
        { text: "Single identity", options: { fontSize: 10 } },
        { text: "Needs scripting", options: { fontSize: 10 } },
        { text: "Yes (Personal, Job, Travel)", options: { bold: true, color: "1E3A8A", fontSize: 10 } }
      ],
      [
        { text: "Multi-Passenger Tables", options: { bold: true, fontSize: 10 } },
        { text: "No (1 person only)", options: { fontSize: 10 } },
        { text: "No", options: { fontSize: 10 } },
        { text: "Custom code per site", options: { fontSize: 10 } },
        { text: "Yes (1 to 6 Passengers)", options: { bold: true, color: "1E3A8A", fontSize: 10 } }
      ],
      [
        { text: "Smart Dropdown Select", options: { bold: true, fontSize: 10 } },
        { text: "Exact match only", options: { fontSize: 10 } },
        { text: "Basic match", options: { fontSize: 10 } },
        { text: "Rigid XPaths", options: { fontSize: 10 } },
        { text: "Fuzzy + Synonym Matching", options: { bold: true, color: "1E3A8A", fontSize: 10 } }
      ],
      [
        { text: "Sensitive Data Security", options: { bold: true, fontSize: 10 } },
        { text: "Browser keystore", options: { fontSize: 10 } },
        { text: "Encrypted Vault", options: { fontSize: 10 } },
        { text: "Plaintext config files", options: { fontSize: 10 } },
        { text: "AES-256-CBC Field Encryption", options: { bold: true, color: "1E3A8A", fontSize: 10 } }
      ],
      [
        { text: "Variable Templates", options: { bold: true, fontSize: 10 } },
        { text: "No", options: { fontSize: 10 } },
        { text: "No", options: { fontSize: 10 } },
        { text: "Requires custom setup", options: { fontSize: 10 } },
        { text: "Yes ({Company}, {Role})", options: { bold: true, color: "1E3A8A", fontSize: 10 } }
      ]
    ];

    slide.addTable(rows, {
      x: 0.8,
      y: 1.4,
      w: 11.5,
      h: 4.8,
      border: { color: "CBD5E1", pt: 1 },
      align: "center",
      valign: "middle"
    });
  }

  // SLIDE 5: RESEARCH GAP (5 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Research Gap Analysis (5 Marks)", "Research Gap");

    slide.addText("Key research and technical gaps identified in existing literature:", {
      x: 0.8,
      y: 1.15,
      w: 11.5,
      h: 0.35,
      fontSize: 13,
      color: "4B5563"
    });

    const gaps = [
      { title: "Gap 1: Single Flat Profile vs. Multi-Domain Realities", desc: "Existing autofills cram all data into one flat profile. A user needs completely different data sets for a job form (CGPA, Roll No) vs a travel booking (Berth preference, Boarding station)." },
      { title: "Gap 2: Complete Failure on Repeating Tables (Multiple Passengers)", desc: "No popular tool can automatically fill details for 2 to 6 passengers into repeating table rows on travel sites like IRCTC, forcing frantic manual typing during Tatkal hours." },
      { title: "Gap 3: Rigid Dropdown (<select>) Matching", desc: "Traditional tools fail when websites use acronyms or synonyms in dropdowns (e.g., 'UR' instead of 'General', or 'SL' instead of 'Sleeper Class'). Synonym mapping is missing." },
      { title: "Gap 4: No Dynamic Template Injection with Variables", desc: "Job applicants repeatedly type cover letter and outreach emails. Current autofill solutions only fill short inputs and completely ignore multi-line template injection with dynamic variables." },
      { title: "Gap 5: Security vs. Usability Trade-off", desc: "Users are forced to choose between extensions that store data unencrypted in plain text, or complex password managers that do not support custom Indian application fields." }
    ];

    gaps.forEach((g, idx) => {
      const yPos = 1.6 + idx * 0.98;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 0.85,
        fill: { color: "F9FAFB" },
        line: { color: "E5E7EB", width: 1 }
      });

      slide.addText(g.title, {
        x: 1.0,
        y: yPos + 0.08,
        w: 11.0,
        h: 0.32,
        fontSize: 12,
        bold: true,
        color: "1E3A8A"
      });

      slide.addText(g.desc, {
        x: 1.0,
        y: yPos + 0.38,
        w: 11.0,
        h: 0.42,
        fontSize: 11,
        color: "374151"
      });
    });
  }

  // SLIDE 6: OBJECTIVE & PROBLEM DEFINITION (5 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Objective / Problem Definition (5 Marks)", "Methodology");

    // Left Column: Problem Definition
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.3,
      w: 5.5,
      h: 5.1,
      fill: { color: "FEF2F2" }, // Soft Red Accent
      line: { color: "FECACA", width: 1 }
    });

    slide.addText("Problem Definition", {
      x: 1.1,
      y: 1.5,
      w: 4.9,
      h: 0.4,
      fontSize: 15,
      bold: true,
      color: "991B1B"
    });

    slide.addText([
      { text: "• Repetitive Manual Typing: ", options: { bold: true } },
      { text: "Students and professionals type the same 20 to 50 details repeatedly across placement portals, exam registrations, and travel booking forms.\n\n" },
      { text: "• High Fatigue & Costly Errors: ", options: { bold: true } },
      { text: "Manual entry leads to mistyped roll numbers, Aadhaar digits, and missed deadlines during high-pressure windows.\n\n" },
      { text: "• Failure of Existing Tools: ", options: { bold: true } },
      { text: "Standard autofills fail on Indian portals due to custom field names, non-standard dropdowns, and repeating passenger tables." }
    ], {
      x: 1.1,
      y: 2.1,
      w: 4.9,
      h: 4.1,
      fontSize: 12,
      color: "374151",
      lineSpacing: 18
    });

    // Right Column: Objectives
    slide.addShape(pptx.ShapeType.rect, {
      x: 6.8,
      y: 1.3,
      w: 5.5,
      h: 5.1,
      fill: { color: "EFF6FF" }, // Soft Blue Accent
      line: { color: "BFDBFE", width: 1 }
    });

    slide.addText("Project Objectives", {
      x: 7.1,
      y: 1.5,
      w: 4.9,
      h: 0.4,
      fontSize: 15,
      bold: true,
      color: "1E3A8A"
    });

    slide.addText([
      { text: "1. Multi-Domain Profile Vault: ", options: { bold: true } },
      { text: "Organize 220+ verified fields into Personal, Professional, and Travel domains.\n\n" },
      { text: "2. 1-Click Form Filling: ", options: { bold: true } },
      { text: "Chrome Extension to scan web pages and populate inputs, dropdowns, and checkboxes.\n\n" },
      { text: "3. Smart Dropdown & Table Support: ", options: { bold: true } },
      { text: "Synonym matching for dropdowns and multi-passenger row filling for booking forms.\n\n" },
      { text: "4. AES-256 Field Encryption: ", options: { bold: true } },
      { text: "Protect all sensitive identification data at rest." }
    ], {
      x: 7.1,
      y: 2.1,
      w: 4.9,
      h: 4.1,
      fontSize: 12,
      color: "374151",
      lineSpacing: 18
    });
  }

  // SLIDE 7: PROPOSED METHODOLOGY - ARCHITECTURE & TOOLS (5 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Proposed Methodology — Architecture & Tools (5 Marks)", "Methodology");

    const components = [
      {
        title: "Frontend Web Application",
        tech: "React.js • Tailwind CSS • Vite",
        points: "• Responsive dashboard for managing Personal, Academic, and Travel profiles.\n• Full-featured Data Folder manager and Smart Template creator.\n• Hosted globally on Vercel: fillsync-web-mocha.vercel.app"
      },
      {
        title: "Backend API Server",
        tech: "Node.js • Express.js • JWT",
        points: "• RESTful API architecture with JWT authentication.\n• Handles secure profile CRUD, custom folders, and activity logging.\n• Hosted live on Render: fillsync-api.onrender.com"
      },
      {
        title: "Chrome Extension (Manifest V3)",
        tech: "JavaScript • Chrome Extension API",
        points: "• Popup UI with 1-click sync from open dashboard.\n• domInjector.js content script detects web inputs and simulates human-like typing.\n• Seamless integration with live API and local development."
      },
      {
        title: "Security & Encryption Engine",
        tech: "Node.js Crypto • AES-256-CBC • bcrypt",
        points: "• Bank-grade AES-256-CBC field encryption with random 16-byte IVs for sensitive IDs.\n• Passwords hashed with bcrypt (salt factor 10).\n• Zero-knowledge admin masking."
      }
    ];

    components.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + col * 5.9;
      const yPos = 1.35 + row * 2.65;

      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 5.6,
        h: 2.45,
        fill: { color: "F9FAFB" },
        line: { color: "CBD5E1", width: 1 }
      });

      slide.addText(c.title, {
        x: xPos + 0.2,
        y: yPos + 0.12,
        w: 5.2,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: "1E3A8A"
      });

      slide.addText(c.tech, {
        x: xPos + 0.2,
        y: yPos + 0.45,
        w: 5.2,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: "0D9488"
      });

      slide.addText(c.points, {
        x: xPos + 0.2,
        y: yPos + 0.75,
        w: 5.2,
        h: 1.6,
        fontSize: 11,
        color: "374151",
        lineSpacing: 17
      });
    });
  }

  // SLIDE 8: CORE TECHNIQUES & ALGORITHMS (5 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Proposed Methodology — Techniques & Algorithms (5 Marks)", "Methodology");

    const techniques = [
      {
        num: "1",
        title: "Smart Synonym Matching Dictionary",
        desc: "Websites use different labels for the same field (e.g., father_name, fatherName, candidate_father, parent_name). FillSync tokenizes field names and matches them against an extensive keyword dictionary covering 50+ common Indian form variations."
      },
      {
        num: "2",
        title: "3-Tier Dropdown Selection Algorithm",
        desc: "When encountering an HTML <select> dropdown, the algorithm executes 3 levels:\nLevel 1: Exact string or option value match.\nLevel 2: Synonym mapping (e.g. 'UR' matches 'General', 'SL' matches 'Sleeper Class').\nLevel 3: Fuzzy character overlap to pick the closest matching option."
      },
      {
        num: "3",
        title: "Sequential & Indexed Multi-Passenger Table Injection",
        desc: "For travel booking forms, the engine supports both indexed input names (passengerName[0], passengerAge[0]) and sequential table rows, allowing all passengers (1 to 6) to be filled in order automatically."
      },
      {
        num: "4",
        title: "Human-Like Event Delays & Dispatch",
        desc: "Modern frameworks (React/Angular) ignore raw DOM value assignments. FillSync simulates real typing by firing native 'input' and 'change' events with 120ms delays (or 15ms Turbo mode) so website forms detect the change."
      }
    ];

    techniques.forEach((t, idx) => {
      const yPos = 1.35 + idx * 1.3;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 1.15,
        fill: { color: "F9FAFB" },
        line: { color: "E5E7EB", width: 1 }
      });

      slide.addShape(pptx.shapes.OVAL, {
        x: 1.0,
        y: yPos + 0.2,
        w: 0.5,
        h: 0.5,
        fill: { color: "1E3A8A" }
      });

      slide.addText(t.num, {
        x: 1.0,
        y: yPos + 0.2,
        w: 0.5,
        h: 0.5,
        fontSize: 12,
        bold: true,
        color: "FFFFFF",
        align: "center",
        valign: "middle"
      });

      slide.addText(t.title, {
        x: 1.7,
        y: yPos + 0.1,
        w: 10.4,
        h: 0.3,
        fontSize: 13,
        bold: true,
        color: "1E3A8A"
      });

      slide.addText(t.desc, {
        x: 1.7,
        y: yPos + 0.4,
        w: 10.4,
        h: 0.7,
        fontSize: 11,
        color: "374151"
      });
    });
  }

  // SLIDE 9: DATA SET & SCHEMAS (5 MARKS)
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Data Set & Real-World Schema Design (5 Marks)", "Methodology");

    slide.addText("FillSync uses an exhaustive schema of 220+ verified fields based on active Indian portals:", {
      x: 0.8,
      y: 1.15,
      w: 11.5,
      h: 0.35,
      fontSize: 13,
      color: "4B5563"
    });

    const domains = [
      {
        title: "Personal Profile (65+ Fields)",
        iconColor: "1E3A8A",
        desc: "• Candidate Name, DOB, Gender, Blood Group\n• Father / Mother Name, Caste / Category\n• Permanent & Present Address, Pin Code\n• Sensitive IDs (AES-256): Aadhaar, PAN, Passport, Voter ID, Driving License"
      },
      {
        title: "Professional & Academic (80+ Fields)",
        iconColor: "0D9488",
        desc: "• 10th & 12th Board Roll Numbers, Passing Years\n• College Name, Degree, Branch, CGPA, %\n• DigiLocker ID, APAAR / ABC ID\n• GitHub / LinkedIn / Portfolio URLs & Skill tags"
      },
      {
        title: "Travel & IRCTC Profile (75+ Fields)",
        iconColor: "D97706",
        desc: "• Origin & Destination Stations, Boarding Point\n• IRCTC User ID, Preferred Class & Quota\n• Passengers 1 to 6 Details: Full Name, Age, Gender, Berth Preference, Meal Choice"
      }
    ];

    domains.forEach((d, idx) => {
      const xPos = 0.8 + idx * 3.95;
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 1.6,
        w: 3.7,
        h: 4.8,
        fill: { color: "F9FAFB" },
        line: { color: "CBD5E1", width: 1 }
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 1.6,
        w: 3.7,
        h: 0.6,
        fill: { color: d.iconColor }
      });

      slide.addText(d.title, {
        x: xPos + 0.1,
        y: 1.7,
        w: 3.5,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: "FFFFFF",
        align: "center"
      });

      slide.addText(d.desc, {
        x: xPos + 0.2,
        y: 2.35,
        w: 3.3,
        h: 3.9,
        fontSize: 11,
        color: "374151",
        lineSpacing: 20
      });
    });
  }

  // SLIDE 10: CURRENT WORKING STATUS & DEMO
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Current Working Status & Live Deployment", "Project Status");

    slide.addText("Live working status of all project components:", {
      x: 0.8,
      y: 1.2,
      w: 11.5,
      h: 0.35,
      fontSize: 13,
      color: "4B5563"
    });

    const statusList = [
      { name: "Web Application", url: "https://fillsync-web-mocha.vercel.app", status: "Active (Vercel)" },
      { name: "REST API Backend", url: "https://fillsync-api.onrender.com/api", status: "Active (Render)" },
      { name: "Testing Sandbox", url: "https://fillsync-web-mocha.vercel.app/test-form.html", status: "Active (1-Click Test)" },
      { name: "Chrome Extension", url: "Manifest V3 with 1-click sync & popup", status: "Active (Locally Packaged)" }
    ];

    statusList.forEach((s, idx) => {
      const yPos = 1.7 + idx * 1.15;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.5,
        h: 0.95,
        fill: { color: "F9FAFB" },
        line: { color: "E5E7EB", width: 1 }
      });

      slide.addText(s.name, {
        x: 1.1,
        y: yPos + 0.15,
        w: 3.0,
        h: 0.3,
        fontSize: 13,
        bold: true,
        color: "1E3A8A"
      });

      slide.addText(s.url, {
        x: 1.1,
        y: yPos + 0.45,
        w: 7.5,
        h: 0.35,
        fontSize: 11,
        color: "4B5563"
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 9.8,
        y: yPos + 0.25,
        w: 2.2,
        h: 0.45,
        fill: { color: "DEF7EC" },
        line: { color: "31C48D", width: 1 }
      });

      slide.addText(s.status, {
        x: 9.8,
        y: yPos + 0.25,
        w: 2.2,
        h: 0.45,
        fontSize: 10,
        bold: true,
        color: "03543F",
        align: "center",
        valign: "middle"
      });
    });
  }

  // SLIDE 11: CONCLUSION & NEXT STEPS
  {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    addSlideHeader(slide, "Conclusion & Next Steps for Final Evaluation", "Conclusion");

    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.4,
      w: 11.5,
      h: 2.3,
      fill: { color: "EFF6FF" },
      line: { color: "BFDBFE", width: 1 }
    });

    slide.addText("Mid-Term Summary", {
      x: 1.1,
      y: 1.55,
      w: 10.9,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: "1E3A8A"
    });

    slide.addText("The literature review and research gap analysis are fully complete. The core system architecture, bank-grade AES-256 encrypted database, full-stack REST API, and working Chrome Extension (Manifest V3) have all been implemented, verified, and deployed live.", {
      x: 1.1,
      y: 1.95,
      w: 10.9,
      h: 1.5,
      fontSize: 12,
      color: "374151",
      lineSpacing: 20
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 3.9,
      w: 11.5,
      h: 2.6,
      fill: { color: "F9FAFB" },
      line: { color: "E5E7EB", width: 1 }
    });

    slide.addText("Next Steps for Final Evaluation", {
      x: 1.1,
      y: 4.05,
      w: 10.9,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: "111827"
    });

    slide.addText([
      { text: "1. Expanded Website Support: ", options: { bold: true } },
      { text: "Conduct automated compatibility tests on 20+ additional government and state exam portals.\n" },
      { text: "2. Chrome Web Store Packaging: ", options: { bold: true } },
      { text: "Publish extension to the Chrome Web Store with automatic background updates.\n" },
      { text: "3. User Usability Testing: ", options: { bold: true } },
      { text: "Conduct timed tests measuring minutes saved during college application filling.\n" },
      { text: "4. Final Report & Code Documentation: ", options: { bold: true } },
      { text: "Complete final project documentation with API swagger specs and user manual." }
    ], {
      x: 1.1,
      y: 4.45,
      w: 10.9,
      h: 1.9,
      fontSize: 11,
      color: "374151",
      lineSpacing: 18
    });
  }

  return pptx;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
async function main() {
  const rootDir = __dirname;

  // 1. Generate Word Document
  console.log("Generating Word Document (Clean Student Format)...");
  const wordDoc = createWordDocument();
  const wordBuffer = await Packer.toBuffer(wordDoc);
  const wordPath = path.join(rootDir, "FillSync_PRJ1_Mid_Sem_Report.docx");
  const wordSimplePath = path.join(rootDir, "FillSync_PRJ1_Mid_Sem_Report_Simple.docx");

  try {
    fs.writeFileSync(wordPath, wordBuffer);
    console.log("✓ Saved Word Document:", wordPath);
  } catch (err) {
    if (err.code === "EBUSY") {
      console.warn("Notice: Original docx is currently open in Word. Writing to:", wordSimplePath);
      fs.writeFileSync(wordSimplePath, wordBuffer);
      console.log("✓ Saved Word Document (Simple):", wordSimplePath);
    } else {
      throw err;
    }
  }

  // 2. Generate PowerPoint Presentation
  console.log("Generating PowerPoint Presentation (Clean White Academic Theme)...");
  const pptx = createPowerPointPresentation();
  const pptxPath = path.join(rootDir, "FillSync_PRJ1_Mid_Sem_Presentation.pptx");
  const pptxSimplePath = path.join(rootDir, "FillSync_PRJ1_Mid_Sem_Presentation_Simple.pptx");

  try {
    await pptx.writeFile({ fileName: pptxPath });
    console.log("✓ Saved PowerPoint Presentation:", pptxPath);
  } catch (err) {
    console.warn("Notice: Writing to simple presentation path:", pptxSimplePath);
    await pptx.writeFile({ fileName: pptxSimplePath });
    console.log("✓ Saved PowerPoint Presentation (Simple):", pptxSimplePath);
  }

  console.log("==========================================================");
  console.log("Both files generated successfully with clean student style!");
  console.log("==========================================================");
}

main().catch((err) => {
  console.error("Error generating documents:", err);
  process.exit(1);
});
