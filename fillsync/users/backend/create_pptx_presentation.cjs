const fs = require('fs');
const pptxgen = require('pptxgenjs');

function buildSimplePresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'FillSync — Mid-Term Evaluation Presentation';
  pres.company = 'BML Munjal University';

  // Clean, Simple Color Palette (Human / Student Style)
  const C_NAVY = '1E3A8A';
  const C_BLUE = '2563EB';
  const C_DARK = '1E293B';
  const C_TEXT = '334155';
  const C_BG = 'F8FAFC';
  const C_WHITE = 'FFFFFF';
  const C_BORDER = 'CBD5E1';
  const C_GREEN = '16A34A';
  const C_RED = 'DC2626';

  // Standard Header for Slides 2 to 7
  function addHeader(slide, title, category, speaker) {
    slide.background = { color: C_BG };

    // Clean top blue bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 13.33, h: 0.1,
      fill: { color: C_BLUE }, line: { color: C_BLUE }
    });

    // Category / Marks Tag
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.35, w: 6.5, h: 0.3,
      fontSize: 11, bold: true, color: C_BLUE, fontFace: 'Calibri'
    });

    // Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.65, w: 8.5, h: 0.55,
      fontSize: 22, bold: true, color: C_DARK, fontFace: 'Calibri'
    });

    // Speaker Pill
    if (speaker) {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 9.3, y: 0.45, w: 3.2, h: 0.45,
        fill: { color: 'EFF6FF' }, line: { color: 'BFDBFE', width: 1 }
      });
      slide.addText(`Speaker: ${speaker}`, {
        x: 9.3, y: 0.45, w: 3.2, h: 0.45,
        fontSize: 11, bold: true, color: '1D4ED8', align: 'center', fontFace: 'Calibri'
      });
    }

    // Divider Line
    slide.addShape(pres.shapes.LINE, {
      x: 0.8, y: 1.3, w: 11.73, h: 0,
      line: { color: C_BORDER, width: 1 }
    });
  }

  // =========================================================================
  // SLIDE 1: TITLE & TEAM (Speaker: Bhargavesh)
  // =========================================================================
  {
    const s1 = pres.addSlide();
    s1.background = { color: '0F172A' };

    // Blue accent bar
    s1.addShape(pres.shapes.RECTANGLE, {
      x: 1.0, y: 0.8, w: 1.8, h: 0.08,
      fill: { color: C_BLUE }, line: { color: C_BLUE }
    });

    s1.addText('BML MUNJAL UNIVERSITY', {
      x: 1.0, y: 1.0, w: 11.3, h: 0.35,
      fontSize: 14, bold: true, color: '93C5FD', fontFace: 'Calibri'
    });

    s1.addText('School of Engineering & Technology — Department of CSE', {
      x: 1.0, y: 1.35, w: 11.3, h: 0.3,
      fontSize: 12, color: '94A3B8', fontFace: 'Calibri'
    });

    s1.addText('FillSync: Smart Form Automation & Profile Management System', {
      x: 1.0, y: 1.8, w: 11.3, h: 1.2,
      fontSize: 32, bold: true, color: C_WHITE, fontFace: 'Calibri'
    });

    s1.addText('PRJ-1 Mid-Term Evaluation (5th Semester) | Duration: 5–7 Mins', {
      x: 1.0, y: 3.1, w: 11.3, h: 0.35,
      fontSize: 13, italics: true, color: 'CBD5E1', fontFace: 'Calibri'
    });

    // Team Card
    s1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 1.0, y: 3.7, w: 11.33, h: 3.1,
      fill: { color: '1E293B' }, line: { color: '334155', width: 1.5 }
    });

    s1.addText('PROJECT TEAM MEMBERS & ROLES', {
      x: 1.3, y: 3.9, w: 10.7, h: 0.3,
      fontSize: 12, bold: true, color: '60A5FA', fontFace: 'Calibri'
    });

    const members = [
      { name: '1. Bhargavesh', role: 'Project Lead, Backend API & Data Security' },
      { name: '2. Mayank Verma', role: 'System Design & Frontend (Frontend with Neal)' },
      { name: '3. Neal Soni', role: 'Frontend & UI/UX Design (Literature Review)' },
      { name: '4. Yash Yadav', role: 'Browser Extension & DOM Automation Scripts' },
      { name: '5. Nitin Rao', role: 'Database Management & Testing (Live Demo)' }
    ];

    members.forEach((m, idx) => {
      const yPos = 4.3 + (idx * 0.48);
      s1.addText(m.name, {
        x: 1.3, y: yPos, w: 3.0, h: 0.35,
        fontSize: 12, bold: true, color: C_WHITE, fontFace: 'Calibri'
      });
      s1.addText(m.role, {
        x: 4.3, y: yPos, w: 7.5, h: 0.35,
        fontSize: 12, color: 'CBD5E1', fontFace: 'Calibri'
      });
    });

    s1.addNotes('Good morning sir and teachers. I am Bhargavesh, Project Lead for our project FillSync — Smart Form Automation & Profile Management System. Today our team will present our mid-term evaluation covering our literature review, research gaps, project goals, system methodology, and live demo in 5 to 7 minutes.');
  }

  // =========================================================================
  // SLIDE 2: PROBLEM & MOTIVATION (Speaker: Bhargavesh)
  // =========================================================================
  {
    const s2 = pres.addSlide();
    addHeader(s2, 'Why We Chose This Problem (Real-World Pain Points)', 'Problem & Motivation', 'Bhargavesh');

    s2.addText('Students and everyday users waste hours typing the exact same details repeatedly across multiple websites:', {
      x: 0.8, y: 1.5, w: 11.73, h: 0.4,
      fontSize: 13, color: C_TEXT, fontFace: 'Calibri'
    });

    const problems = [
      {
        num: '1',
        title: 'Job & Internship Applications',
        text: 'Applying to 30–50 company portals (Workday, Greenhouse, Internshala), repeatedly typing full name, college, CGPA, graduation year, LinkedIn, and GitHub links.'
      },
      {
        num: '2',
        title: 'IRCTC Tatkal Train Bookings',
        text: 'Tatkal tickets sell out in under 60 seconds. A manual typing delay of just 5 to 10 seconds typing passenger names and berths causes booking failure.'
      },
      {
        num: '3',
        title: 'Cold Outreach & Networking',
        text: 'Copy-pasting the exact same message to recruiters on LinkedIn and Gmail, tediously editing {HR_Name} and {Company_Name} by hand.'
      }
    ];

    problems.forEach((p, idx) => {
      const xPos = 0.8 + (idx * 4.0);
      s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 2.1, w: 3.73, h: 3.6,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 1.5 }
      });

      // Number badge
      s2.addShape(pres.shapes.OVAL, {
        x: xPos + 0.3, y: 2.35, w: 0.45, h: 0.45,
        fill: { color: C_BLUE }
      });
      s2.addText(p.num, {
        x: xPos + 0.3, y: 2.35, w: 0.45, h: 0.45,
        fontSize: 12, bold: true, color: C_WHITE, align: 'center', fontFace: 'Calibri'
      });

      s2.addText(p.title, {
        x: xPos + 0.9, y: 2.35, w: 2.5, h: 0.45,
        fontSize: 14, bold: true, color: C_NAVY, fontFace: 'Calibri'
      });

      s2.addText(p.text, {
        x: xPos + 0.3, y: 3.0, w: 3.13, h: 2.4,
        fontSize: 12, color: C_TEXT, fontFace: 'Calibri', lineSpacingMultiple: 1.2
      });
    });

    // Summary bar
    s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 5.9, w: 11.73, h: 0.9,
      fill: { color: 'EFF6FF' }, line: { color: 'BFDBFE', width: 1 }
    });
    s2.addText('Our Solution: FillSync combines a clean Web Dashboard to organize data into separate folders (Travel, Job, Personal) and a 1-click Chrome Extension that safely fills forms in under 3 seconds.', {
      x: 1.0, y: 6.05, w: 11.33, h: 0.6,
      fontSize: 12, bold: true, color: '1E3A8A', fontFace: 'Calibri'
    });

    s2.addNotes('As students, we waste hours typing the same details for 50 job portals and lose Tatkal tickets due to a 5-second typing delay. FillSync solves this with modular folders and safe 1-click autofill. Neal will now present our literature review.');
  }

  // =========================================================================
  // SLIDE 3: LITERATURE REVIEW (10 MARKS) (Speaker: Neal Soni)
  // =========================================================================
  {
    const s3 = pres.addSlide();
    addHeader(s3, 'Literature Review & Existing Tools Comparison', 'Literature Review (10 Marks)', 'Neal Soni');

    s3.addText('We studied 4 types of existing tools to see why they are not enough for students:', {
      x: 0.8, y: 1.45, w: 11.73, h: 0.35,
      fontSize: 12.5, color: C_TEXT, fontFace: 'Calibri'
    });

    const headers = ['Feature', 'Chrome Autofill', 'Bitwarden', 'Selenium Bots', 'Generic Fillers', 'FillSync (Ours)'];
    const rows = [
      ['Separate Profiles (Travel, Job)', '❌ No (Everything mixed)', '❌ No (Logins only)', '⚠️ Requires code', '❌ No (Flat list)', '✅ 3 Built-in + Custom Folders'],
      ['Works on Modern React Forms', '❌ Fails on random IDs', '❌ Fails on random IDs', '⚠️ Manual code', '❌ Static only', '✅ Reads labels + AI fallback'],
      ['Typing Speed (Anti-Bot Safe)', '❌ Instant 0ms', '❌ Instant 0ms', '❌ 0ms (Triggers bans)', '❌ Instant 0ms', '✅ 120ms human-like delay'],
      ['Outreach Email Templates', '❌ No support', '❌ No support', '❌ No support', '❌ No support', '✅ Fills {Variables} in Gmail'],
      ['Stops Safely at CAPTCHAs', '❌ Ignores challenge', '❌ Ignores challenge', '❌ Breaks / Violates rules', '❌ Ignores', '✅ Stops & alerts user safely'],
      ['Admin Privacy (Phone Number)', '❌ Plain text', '✅ Encrypted', '❌ Plain files', '⚠️ Plain text', '✅ Masked with stars (98******10)']
    ];

    const tableData = [
      headers.map(h => ({
        text: h,
        options: { bold: true, color: C_WHITE, fill: { color: C_NAVY }, align: 'center', fontSize: 10.5 }
      })),
      ...rows.map((r, rIdx) => r.map((cell, cIdx) => ({
        text: cell,
        options: {
          bold: cIdx === 0 || cIdx === 5,
          color: cIdx === 5 ? '166534' : (cell.startsWith('❌') ? '991B1B' : C_TEXT),
          fill: { color: cIdx === 5 ? 'DCFCE7' : (rIdx % 2 === 0 ? C_WHITE : 'F8FAFC') },
          align: cIdx === 0 ? 'left' : 'center',
          fontSize: 9.5
        }
      })))
    ];

    s3.addTable(tableData, {
      x: 0.8, y: 1.9, w: 11.73, h: 4.7,
      colW: [2.5, 1.8, 1.8, 1.8, 1.8, 2.03],
      border: { color: C_BORDER, pt: 1 }
    });

    s3.addNotes('Thank you, Bhargavesh. Respected teachers, we surveyed 4 existing tools: Chrome autofill, password managers, Selenium bots, and generic fillers. Chrome autofill mixes up travel and job details and fails on modern React forms. Bots get banned. As shown in our comparison table, FillSync is the only tool that combines folders, templates, and safe human-paced typing.');
  }

  // =========================================================================
  // SLIDE 4: RESEARCH GAPS & OBJECTIVES (5 + 5 MARKS) (Speaker: Yash Yadav)
  // =========================================================================
  {
    const s4 = pres.addSlide();
    addHeader(s4, 'Research Gaps Identified & Our 5 Project Goals', 'Research Gaps & Objectives (10 Marks)', 'Yash Yadav');

    // Left Column: 5 Research Gaps (5 Marks)
    s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.5, w: 5.7, h: 5.2,
      fill: { color: C_WHITE }, line: { color: C_BORDER, width: 1.5 }
    });

    s4.addText('5 Critical Research Gaps (5 Marks)', {
      x: 1.0, y: 1.7, w: 5.3, h: 0.35,
      fontSize: 14, bold: true, color: 'B91C1C', fontFace: 'Calibri'
    });

    const gaps = [
      '1. No Folder Separation: Tools dump all data into one flat list, mixing travel with job resumes.',
      '2. Autofill Fails on Modern React Forms: Job portals use randomized IDs, leaving fields completely blank.',
      '3. Disconnected From Outreach: No extension connects web form filling with cold message templates.',
      '4. Instant Typing Causes Bot Bans: 0ms automated typing triggers bot filters. Bypassing CAPTCHAs is unsafe.',
      '5. Admin Cleartext Exposure: Most tools let website admins view user phone numbers in plain text.'
    ];

    s4.addText(gaps.join('\n\n'), {
      x: 1.0, y: 2.15, w: 5.3, h: 4.3,
      fontSize: 11, color: C_TEXT, fontFace: 'Calibri'
    });

    // Right Column: 5 Measurable Goals (5 Marks)
    s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.8, y: 1.5, w: 5.73, h: 5.2,
      fill: { color: C_WHITE }, line: { color: C_BORDER, width: 1.5 }
    });

    s4.addText('Our 5 Measurable Goals (5 Marks)', {
      x: 7.0, y: 1.7, w: 5.33, h: 0.35,
      fontSize: 14, bold: true, color: '15803D', fontFace: 'Calibri'
    });

    const goals = [
      '1. Multi-Folder Profiles: 3 built-in folders (Travel, Job, Personal) + custom folders so details never mix.',
      '2. Sub-3-Second Form Filling: Fills forms in under 3 seconds with >90% accuracy on complex React SPAs.',
      '3. Dynamic Message Templates: Save emails with {Variables} that insert directly into Gmail/LinkedIn.',
      '4. Anti-Bot Safe Typing: Enforce a 120ms delay between inputs with real browser events to evade bot bans.',
      '5. Ethical Safety & Privacy: Always stop at CAPTCHAs, and mask phone numbers (98******10) in admin views.'
    ];

    s4.addText(goals.join('\n\n'), {
      x: 7.0, y: 2.15, w: 5.33, h: 4.3,
      fontSize: 11, color: C_TEXT, fontFace: 'Calibri'
    });

    s4.addNotes('Thank you, Neal. Sir, our research identified 5 clear technical gaps: no folder separation, failures on modern React forms, disconnected outreach messages, bot detection bans from instant typing, and admin privacy leaks. To solve these, our 5 clear goals are: folder profiles, sub-3s filling, dynamic templates, 120ms safe typing, and 100% ethical CAPTCHA stops.');
  }

  // =========================================================================
  // SLIDE 5: PROPOSED METHODOLOGY (5 MARKS) (Speaker: Mayank Verma)
  // =========================================================================
  {
    const s5 = pres.addSlide();
    addHeader(s5, 'Proposed Methodology: 3-Tier System Design & Steps', 'Proposed Methodology (5 Marks)', 'Mayank Verma');

    // 3 Tier Columns
    const tiers = [
      {
        title: '1. Web Dashboard (Frontend)',
        tech: 'React.js + Tailwind CSS',
        desc: '• User profile and account setup\n• Manage 3 folders: Travel, Job, Personal\n• Create outreach templates with {Variables}\n• Synchronizes with extension in real time'
      },
      {
        title: '2. Backend Server (API)',
        tech: 'Node.js + Express.js',
        desc: '• Secure user authentication with JWT\n• Stores user folders and templates\n• Admin privacy masking (98******10)\n• Fast, lightweight JSON database'
      },
      {
        title: '3. Browser Extension',
        tech: 'Chrome Manifest V3',
        desc: '• Reads active webpage inputs\n• 3-step field matching (name, label, AI)\n• 120ms human typing delay\n• Ethical safety halt at CAPTCHAs'
      }
    ];

    tiers.forEach((t, idx) => {
      const xPos = 0.8 + (idx * 4.0);
      s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.5, w: 3.73, h: 3.6,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 1.5 }
      });

      s5.addText(t.title, {
        x: xPos + 0.25, y: 1.7, w: 3.23, h: 0.35,
        fontSize: 13, bold: true, color: C_NAVY, fontFace: 'Calibri'
      });
      s5.addText(t.tech, {
        x: xPos + 0.25, y: 2.05, w: 3.23, h: 0.25,
        fontSize: 10.5, bold: true, color: C_BLUE, fontFace: 'Calibri'
      });

      s5.addText(t.desc, {
        x: xPos + 0.25, y: 2.4, w: 3.23, h: 2.5,
        fontSize: 11, color: C_TEXT, fontFace: 'Calibri', lineSpacingMultiple: 1.15
      });
    });

    // Bottom Process Flow Bar
    s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 5.3, w: 11.73, h: 1.5,
      fill: { color: 'EFF6FF' }, line: { color: 'BFDBFE', width: 1 }
    });
    s5.addText('HOW THE CHROME EXTENSION FILLS A FORM (CORE ALGORITHM):', {
      x: 1.0, y: 5.45, w: 11.33, h: 0.25,
      fontSize: 11, bold: true, color: C_NAVY, fontFace: 'Calibri'
    });
    s5.addText('1. Checks Field Name: Looks for standard names like name="phone" or autocomplete attributes.\n2. Reads Label Text: If name is random (like on React), reads the text right next to the box.\n3. Human Typing Queue: Fills each field with a 120ms delay and fires real input/change events.\n4. Safety Check: If it spots a CAPTCHA or payment box, it immediately pauses and alerts the user.', {
      x: 1.0, y: 5.75, w: 11.33, h: 0.95,
      fontSize: 11, color: C_TEXT, fontFace: 'Calibri'
    });

    s5.addNotes('Thank you, Yash. Sir, looking at our system design, FillSync has 3 simple parts: the React Web Dashboard to manage folders and templates, the Node.js API to secure data and mask phone numbers, and the Chrome extension that fills forms. When you click Fill Form, it checks field names, reads labels, types at human speed (120ms), and stops safely at CAPTCHAs.');
  }

  // =========================================================================
  // SLIDE 6: TESTING BENCHMARK & RESULTS (5 MARKS) (Speaker: Nitin Rao)
  // =========================================================================
  {
    const s6 = pres.addSlide();
    addHeader(s6, 'Testing Methodology: 20-Website Benchmark & Results', 'Testing & Results (5 Marks)', 'Nitin Rao');

    s6.addText('To test FillSync in real life, we tested it across 20 real websites in 4 categories:', {
      x: 0.8, y: 1.45, w: 11.73, h: 0.35,
      fontSize: 12.5, color: C_TEXT, fontFace: 'Calibri'
    });

    // 4 Category Cards
    const cats = [
      { title: '1. Travel Portals (5 Sites)', sites: 'IRCTC Tatkal, RedBus, MakeMyTrip, Indian Railways, Air India' },
      { title: '2. Job Portals (5 Sites)', sites: 'Workday, Greenhouse, Taleo, Internshala, LinkedIn EasyApply' },
      { title: '3. Shopping Portals (5 Sites)', sites: 'Amazon India, Flipkart, Myntra, Nykaa, Shopify Stores' },
      { title: '4. College & Govt (5 Sites)', sites: 'National Scholarship Portal, University Admissions, State ERPs' }
    ];

    cats.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + (col * 6.0);
      const yPos = 1.9 + (row * 1.55);

      s6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: yPos, w: 5.73, h: 1.4,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 1.5 }
      });
      s6.addText(c.title, {
        x: xPos + 0.25, y: yPos + 0.15, w: 5.23, h: 0.3,
        fontSize: 12.5, bold: true, color: C_NAVY, fontFace: 'Calibri'
      });
      s6.addText(`Sites Tested: ${c.sites}`, {
        x: xPos + 0.25, y: yPos + 0.55, w: 5.23, h: 0.7,
        fontSize: 11, color: C_TEXT, fontFace: 'Calibri'
      });
    });

    // 3 Big Metric Cards at the bottom
    const metrics = [
      { num: 'Under 3s', label: 'Form Fill Speed', sub: 'Reduced from 2 mins to 2.8s (75%+ time saved)' },
      { num: '92.4%', label: 'Field Accuracy', sub: 'Correct field recognition on complex React SPAs' },
      { num: '100%', label: 'CAPTCHA Safety', sub: 'Always paused safely without errors' }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.8 + (idx * 4.0);
      s6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 5.2, w: 3.73, h: 1.6,
        fill: { color: 'EFF6FF' }, line: { color: '93C5FD', width: 1.5 }
      });
      s6.addText(m.num, {
        x: xPos + 0.2, y: 5.35, w: 3.33, h: 0.45,
        fontSize: 22, bold: true, color: C_BLUE, align: 'center', fontFace: 'Calibri'
      });
      s6.addText(m.label, {
        x: xPos + 0.2, y: 5.85, w: 3.33, h: 0.3,
        fontSize: 12, bold: true, color: C_NAVY, align: 'center', fontFace: 'Calibri'
      });
      s6.addText(m.sub, {
        x: xPos + 0.2, y: 6.2, w: 3.33, h: 0.45,
        fontSize: 10, color: '166534', align: 'center', fontFace: 'Calibri'
      });
    });

    s6.addNotes('Thank you, Mayank. Sir, to verify FillSync, we tested it across 20 real websites including IRCTC, Workday, Internshala, and Amazon. Our results show: form filling time dropped from 2 minutes down to under 3 seconds, with over 92% field accuracy and a 100% safe stop rate at CAPTCHAs.');
  }

  // =========================================================================
  // SLIDE 7: LIVE DEMO & CONCLUSION (Speaker: Nitin Rao & Bhargavesh)
  // =========================================================================
  {
    const s7 = pres.addSlide();
    s7.background = { color: '0F172A' };

    s7.addText('LIVE WORKING DEMONSTRATION & CONCLUSION', {
      x: 1.0, y: 0.8, w: 11.3, h: 0.35,
      fontSize: 12, bold: true, color: '60A5FA', fontFace: 'Calibri'
    });

    s7.addText('Live Demo Steps & Project Summary', {
      x: 1.0, y: 1.2, w: 11.3, h: 0.6,
      fontSize: 28, bold: true, color: C_WHITE, fontFace: 'Calibri'
    });

    // Left Box: Demo Steps
    s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 1.0, y: 2.0, w: 5.5, h: 4.5,
      fill: { color: '1E293B' }, line: { color: '334155', width: 1.5 }
    });
    s7.addText('Live Demo Checklist', {
      x: 1.3, y: 2.2, w: 4.9, h: 0.35,
      fontSize: 15, bold: true, color: '93C5FD', fontFace: 'Calibri'
    });
    const demoSteps = [
      '1. Open Web Dashboard at localhost:5173',
      '2. Show Travel & Job folders with separated profiles',
      '3. Show Outreach Template with dynamic {Variables}',
      '4. Open Chrome Extension popup (shows latest sync)',
      '5. 1-Click Form Fill on test form (under 3 seconds!)',
      '6. Show automatic safety pause when CAPTCHA is present'
    ];
    s7.addText(demoSteps.join('\n\n'), {
      x: 1.3, y: 2.7, w: 4.9, h: 3.5,
      fontSize: 11.5, color: 'CBD5E1', fontFace: 'Calibri'
    });

    // Right Box: Summary & Future Scope
    s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.8, y: 2.0, w: 5.5, h: 4.5,
      fill: { color: '1E293B' }, line: { color: '334155', width: 1.5 }
    });
    s7.addText('Key Takeaways & Future Scope', {
      x: 7.1, y: 2.2, w: 4.9, h: 0.35,
      fontSize: 15, bold: true, color: '93C5FD', fontFace: 'Calibri'
    });
    const summary = [
      '• Fully functional 3-tier system working locally.',
      '• Solves the "mixed profile" problem with clean folders.',
      '• Safe human typing (120ms) avoids bot bans.',
      '• Admin privacy protected with star masking (98******10).',
      '• Future Scope: Mobile browser extension support, resume OCR scanner, and Chrome Web Store publishing.'
    ];
    s7.addText(summary.join('\n\n'), {
      x: 7.1, y: 2.7, w: 4.9, h: 3.5,
      fontSize: 11.5, color: 'CBD5E1', fontFace: 'Calibri'
    });

    s7.addNotes('Respected teachers, we will now show a quick live demo of FillSync running in real-time. We will open the dashboard, switch between Travel and Job folders, open the Chrome extension, and show 1-click filling in under 3 seconds. Thank you! We are now open for viva questions.');
  }

  const primaryPath = 'd:/BMU/5th sem/PRJ-1/FillSync_MidTerm_Presentation.pptx';
  const fallbackPath = 'd:/BMU/5th sem/PRJ-1/FillSync_MidTerm_Presentation_Simple.pptx';

  return pres.writeFile({ fileName: primaryPath })
    .then(() => {
      console.log(`Presentation successfully written to ${primaryPath}`);
    })
    .catch(err => {
      if (err.code === 'EBUSY' || (err.message && err.message.includes('busy'))) {
        console.log(`Primary presentation file is open. Writing to ${fallbackPath}...`);
        return pres.writeFile({ fileName: fallbackPath }).then(() => {
          console.log(`Presentation successfully written to ${fallbackPath}`);
        });
      } else {
        throw err;
      }
    });
}

buildSimplePresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
