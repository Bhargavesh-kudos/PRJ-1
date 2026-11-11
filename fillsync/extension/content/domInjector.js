/**
 * ============================================================================
 * FILE: extension/content/domInjector.js
 * PURPOSE: Content Script that runs inside target web pages.
 *          Works differently for Normal (Free) Users vs Premium Users:
 *          - Normal User: Standard attribute matching + 120ms human-like delay
 *          - Premium User: Deep label/context AI mapping + Multi-Step Auto-Next
 *            + optional Instant Turbo Fill Speed
 * ============================================================================
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // -------------------------------------------------------------------------
  // MODE A: SMART TEMPLATE INJECTION (With {Variable} Prompts)
  // -------------------------------------------------------------------------
  if (message.action === "FILLSYNC_INJECT_TEMPLATE") {
    let finalBody = message.templateBody || "";
    const vars = message.variables || [];

    vars.forEach((v) => {
      const defaultVal = v.toLowerCase().includes("name") && v.toLowerCase().includes("my")
        ? message.userName || ""
        : "";
      const userVal = window.prompt(`FillSync Template — Enter value for {${v}}:`, defaultVal);
      if (userVal !== null) {
        finalBody = finalBody.replaceAll(`{${v}}`, userVal);
      }
    });

    const activeEl = document.activeElement;
    const targetTextarea =
      activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT")
        ? activeEl
        : document.querySelector("textarea, [contenteditable='true']");

    if (targetTextarea) {
      targetTextarea.focus();
      if (targetTextarea.isContentEditable) {
        targetTextarea.innerText = finalBody;
      } else {
        targetTextarea.value = finalBody;
      }
      targetTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      sendResponse({ status: "✓ Smart Template injected into textbox!" });
    } else {
      navigator.clipboard?.writeText(finalBody);
      alert("✓ Template copied to clipboard! Paste (Ctrl+V) into any message box.");
      sendResponse({ status: "✓ Template copied to clipboard!" });
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // MODE B: 1-CLICK FORM AUTO-FILL (Normal vs Premium Behavior)
  // -------------------------------------------------------------------------
  if (message.action !== "FILLSYNC_INJECT_FORM") return;

  // 1. Safety Check: Detect CAPTCHA or Payment Iframe
  const hasCaptcha = Boolean(
    document.querySelector('[class*="captcha" i], [id*="captcha" i], iframe[src*="recaptcha" i]')
  );
  if (hasCaptcha) {
    alert(
      "⚠️ FillSync Safety Halt: CAPTCHA detected on this page. Please complete the CAPTCHA manually."
    );
    sendResponse({ status: "Paused at CAPTCHA for safety." });
    return true;
  }

  // 2. Build key-value lookup dictionary from Master Profile + Selected Folder
  const profile = message.masterProfile || {};
  const folderFields = message.folderFields || [];

  function buildSynonymsForKey(rawKey = "") {
    const k = rawKey.toLowerCase();
    const matches = [k];

    // Basic word splits
    const words = k.split(/[\s/()_,-]+/).filter((w) => w.length > 2);
    words.forEach((w) => matches.push(w));

    // Common Travel Patterns
    if (k.includes("station") && (k.includes("from") || k.includes("origin") || k.includes("source"))) {
      matches.push("from_station", "fromstation", "source_station", "origin", "from");
    }
    if (k.includes("station") && (k.includes("to") || k.includes("dest"))) {
      matches.push("to_station", "tostation", "dest_station", "destination", "to");
    }
    if (k.includes("boarding") && k.includes("station")) {
      matches.push("boarding_station", "boarding_point", "boarding");
    }
    if (k.includes("berth")) {
      matches.push("berth", "berth_pref", "berth_preference", "seat_pref", "seat_preference", "seat");
    }
    if (k.includes("food") || k.includes("meal")) {
      matches.push("food", "meal", "food_pref", "meal_pref", "catering");
    }
    if (k.includes("irctc")) {
      matches.push("irctc", "irctc_id", "irctc_user", "irctc_username", "railway_id");
    }
    if (k.includes("quota")) {
      matches.push("quota", "booking_quota", "train_quota");
    }
    if (k.includes("coach")) {
      matches.push("coach", "coach_id", "preferred_coach");
    }
    if (k.includes("travel class") || (k.includes("class") && k.includes("travel"))) {
      matches.push("class", "travel_class", "booking_class", "coach_class");
    }
    if (k.includes("insurance")) {
      matches.push("insurance", "travel_insurance", "opt_insurance");
    }
    if (k.includes("gstin") || k.includes("gst number")) {
      matches.push("gstin", "gst_number", "gstin_no", "company_gst");
    }

    // Flights
    if (k.includes("airport") && (k.includes("departure") || k.includes("from"))) {
      matches.push("dep_airport", "from_airport", "origin_airport", "departure");
    }
    if (k.includes("airport") && (k.includes("arrival") || k.includes("to"))) {
      matches.push("arr_airport", "to_airport", "dest_airport", "arrival");
    }
    if (k.includes("frequent flyer") || k.includes("loyalty")) {
      matches.push("frequent_flyer", "ff_number", "airline_loyalty", "membership_no");
    }
    if (k.includes("wheelchair")) {
      matches.push("wheelchair", "special_assistance", "mobility");
    }

    // Govt Exams / Professional
    if (k.includes("father")) {
      matches.push("father", "father_name", "fathername", "father_full_name", "fathers_name");
    }
    if (k.includes("mother")) {
      matches.push("mother", "mother_name", "mothername", "mother_full_name", "mothers_name");
    }
    if (k.includes("spouse") || k.includes("guardian")) {
      matches.push("spouse", "guardian", "husband_name", "wife_name");
    }
    if (k.includes("10th") && k.includes("roll")) {
      matches.push("10th_roll", "matric_roll", "roll_10", "class10_roll", "tenth_roll");
    }
    if (k.includes("12th") && k.includes("roll")) {
      matches.push("12th_roll", "inter_roll", "roll_12", "class12_roll", "twelfth_roll");
    }
    if (k.includes("passing year") || (k.includes("year") && k.includes("pass"))) {
      matches.push("passing_year", "pass_year", "year_of_passing", "grad_year");
    }
    if (k.includes("roll number") || k.includes("roll no")) {
      matches.push("roll_no", "rollno", "roll_number", "candidate_roll");
    }
    if (k.includes("cgpa")) {
      matches.push("cgpa", "gpa", "grade_point", "final_cgpa");
    }
    if (k.includes("percentage") || k.includes("marks")) {
      matches.push("percentage", "percent", "marks_percent", "total_marks");
    }
    if (k.includes("aadhaar") || k.includes("aadhar")) {
      matches.push("aadhaar", "aadhar", "uidai", "uid", "aadhaar_no", "aadhar_number");
    }
    if (k.includes("pan number") || k.includes("pan card")) {
      matches.push("pan", "pancard", "pan_no", "pan_number");
    }
    if (k.includes("passport number") || k.includes("passport no")) {
      matches.push("passport", "passport_no", "passport_number", "passport_id");
    }
    if (k.includes("voter")) {
      matches.push("voter", "epic", "voter_id", "epic_no");
    }
    if (k.includes("driving license") || k.includes("license")) {
      matches.push("driving", "license", "dl_no", "driving_license");
    }
    if (k.includes("apaar") || k.includes("abc id")) {
      matches.push("apaar", "abc_id", "apaar_id", "academic_bank", "abc");
    }
    if (k.includes("digilocker") || k.includes("nad id")) {
      matches.push("digilocker", "nad_id", "digilocker_id");
    }
    if (k.includes("domicile")) {
      matches.push("domicile", "bonafide", "domicile_state", "resident_state");
    }
    if (k.includes("family id") || k.includes("ppp") || k.includes("parivar")) {
      matches.push("ppp", "family_id", "parivar_pehchan", "ppp_id");
    }
    if (k.includes("category") || k.includes("caste")) {
      matches.push("category", "social_category", "caste_category", "reservation");
    }
    if (k.includes("exam centre") || k.includes("center")) {
      matches.push("exam_centre", "centre_pref", "test_city", "exam_city", "preferred_city");
    }
    if (k.includes("bank account") || (k.includes("account") && k.includes("number"))) {
      matches.push("account_number", "account_no", "bank_account", "ac_no");
    }
    if (k.includes("ifsc")) {
      matches.push("ifsc", "ifsc_code", "bank_ifsc");
    }
    if (k.includes("upi")) {
      matches.push("upi", "vpa", "upi_id");
    }
    if (k.includes("blood group")) {
      matches.push("blood_group", "blood", "bg");
    }
    if (k.includes("pin code") || k.includes("pincode") || k.includes("zip")) {
      matches.push("pin", "pincode", "zip", "postal", "postal_code");
    }

    return Array.from(new Set(matches.map((m) => m.toLowerCase())));
  }

  const lookupPairs = [
    { match: ["name", "fullname", "first_name", "candidate"], value: profile.fullName },
    { match: ["email", "mail"], value: profile.email },
    { match: ["phone", "mobile", "tel", "contact"], value: profile.phone },
    { match: ["dob", "birth", "date_of_birth"], value: profile.dob },
    { match: ["gender", "sex"], value: profile.gender },
    { match: ["city", "town"], value: profile.address?.city },
    { match: ["state", "province"], value: profile.address?.state },
    { match: ["pin", "zip", "postal", "pincode"], value: profile.address?.pinCode },
    { match: ["country", "nation"], value: profile.address?.country },
    { match: ["street", "address", "line1"], value: profile.address?.street }
  ];

  // Register user folder fields with smart synonyms
  folderFields.forEach((f) => {
    if (f.key && f.value) {
      lookupPairs.push({
        match: buildSynonymsForKey(f.key),
        value: f.value
      });
    }
  });

  // Extract Passenger 1 to 6 list for multi-passenger family bookings (IRCTC, Flights, redBus)
  const familyPassengers = [];
  for (let p = 1; p <= 6; p++) {
    const pName = folderFields.find((f) => f.key.toLowerCase().includes(`passenger ${p}`) && f.key.toLowerCase().includes("name"))?.value;
    const pAge = folderFields.find((f) => f.key.toLowerCase().includes(`passenger ${p}`) && f.key.toLowerCase().includes("age"))?.value;
    const pGender = folderFields.find((f) => f.key.toLowerCase().includes(`passenger ${p}`) && f.key.toLowerCase().includes("gender"))?.value;
    const pBerth = folderFields.find((f) => f.key.toLowerCase().includes(`passenger ${p}`) && f.key.toLowerCase().includes("berth"))?.value;
    const pFood = folderFields.find((f) => f.key.toLowerCase().includes(`passenger ${p}`) && f.key.toLowerCase().includes("food"))?.value;

    if (pName) {
      familyPassengers.push({
        num: p,
        index: p - 1,
        name: pName,
        age: pAge || "",
        gender: pGender || "",
        berth: pBerth || "",
        food: pFood || ""
      });
    }
  }

  // Register indexed passenger matchers (for forms using name="passengerName[0]", etc.)
  familyPassengers.forEach((psgn) => {
    const idx = psgn.index;
    const num = psgn.num;

    lookupPairs.push({
      match: [`passengername[${idx}]`, `psgn-name-${idx}`, `name[${idx}]`, `passenger_${num}_name`, `adult_${num}_name`, `p${num}_name`],
      value: psgn.name
    });
    if (psgn.age) {
      lookupPairs.push({
        match: [`passengerage[${idx}]`, `psgn-age-${idx}`, `age[${idx}]`, `passenger_${num}_age`, `adult_${num}_age`, `p${num}_age`],
        value: psgn.age
      });
    }
    if (psgn.gender) {
      lookupPairs.push({
        match: [`passengergender[${idx}]`, `psgn-gender-${idx}`, `gender[${idx}]`, `passenger_${num}_gender`, `adult_${num}_gender`, `p${num}_gender`],
        value: psgn.gender
      });
    }
    if (psgn.berth) {
      lookupPairs.push({
        match: [`passengerberthchoice[${idx}]`, `psgn-berth-${idx}`, `berth[${idx}]`, `passenger_${num}_berth`, `adult_${num}_berth`, `p${num}_berth`],
        value: psgn.berth
      });
    }
    if (psgn.food) {
      lookupPairs.push({
        match: [`passengerfoodchoice[${idx}]`, `psgn-food-${idx}`, `food[${idx}]`, `passenger_${num}_food`, `adult_${num}_food`, `p${num}_food`],
        value: psgn.food
      });
    }
  });

  // Track sequential passenger row indices for repeating un-indexed tables
  let sequentialPassengerIdx = 0;
  let sequentialAgeIdx = 0;
  let sequentialGenderIdx = 0;
  let sequentialBerthIdx = 0;
  let sequentialFoodIdx = 0;

  /**
   * Smartly selects the matching option (or closest nearest option) in a <select> dropdown.
   * Handles:
   * 1. Exact value/text match
   * 2. Common synonyms & shortcodes (e.g. "Male" -> "M", "General" -> "GEN" / "UR", "Sleeper" -> "SL")
   * 3. Substring inclusion
   * 4. Fuzzy word overlap & similarity ("ya uske aas paas wala")
   */
  function smartSelectOption(selectEl, rawTargetValue) {
    if (!selectEl || !rawTargetValue) return false;
    const target = String(rawTargetValue).trim().toLowerCase();
    const options = Array.from(selectEl.options || []);
    if (options.length === 0) return false;

    // 1. Direct exact match on value or visible text
    let bestIndex = options.findIndex((opt) => {
      const val = (opt.value || "").trim().toLowerCase();
      const txt = (opt.text || "").trim().toLowerCase();
      return val === target || txt === target;
    });

    // 2. Comprehensive synonyms & Indian portal codes
    if (bestIndex === -1) {
      const synonymMap = {
        male: ["m", "male", "men", "boy", "purush", "1"],
        female: ["f", "female", "women", "girl", "mahila", "stri", "2"],
        other: ["o", "other", "transgender", "tg", "3"],
        general: ["gen", "ur", "unreserved", "general", "open"],
        obc: ["obc", "obc-ncl", "other backward class", "bca", "bcb", "bc"],
        sc: ["sc", "scheduled caste", "dalit"],
        st: ["st", "scheduled tribe", "adivasi"],
        ews: ["ews", "economically weaker section", "economically weaker"],
        indian: ["ind", "india", "indian", "bharat", "citizen of india"],
        yes: ["y", "yes", "true", "haan", "1"],
        no: ["n", "no", "false", "nahi", "0"],
        single: ["unmarried", "single", "never married"],
        married: ["married", "vivahit"],
        lower: ["lower", "lb", "lower berth"],
        middle: ["middle", "mb", "middle berth"],
        upper: ["upper", "ub", "upper berth"],
        "side lower": ["side lower", "slb", "sl"],
        "side upper": ["side upper", "sub", "su"],
        window: ["window", "ws", "window seat"],
        sleeper: ["sl", "sleeper", "sleeper class", "s/l"],
        "ac 3 tier": ["3a", "3e", "ac 3 tier", "third ac", "ac 3"],
        "ac 2 tier": ["2a", "ac 2 tier", "second ac", "ac 2"],
        "ac 1st class": ["1a", "first ac", "ac 1", "ac first"],
        "executive chair car": ["ec", "exec", "executive"],
        "ac chair car": ["cc", "chair car"],
        second: ["2s", "second sitting"]
      };

      const synKey = Object.keys(synonymMap).find(
        (k) => k === target || target.includes(k) || k.includes(target)
      );
      if (synKey) {
        const allowed = synonymMap[synKey];
        bestIndex = options.findIndex((opt) => {
          const val = (opt.value || "").trim().toLowerCase();
          const txt = (opt.text || "").trim().toLowerCase();
          return allowed.some(
            (w) => val === w || txt === w || val.includes(w) || txt.includes(w)
          );
        });
      }
    }

    // 3. Substring / partial match
    if (bestIndex === -1) {
      bestIndex = options.findIndex((opt) => {
        const val = (opt.value || "").trim().toLowerCase();
        const txt = (opt.text || "").trim().toLowerCase();
        if (!val && !txt) return false;
        return (
          (val && (target.includes(val) || val.includes(target))) ||
          (txt && (target.includes(txt) || txt.includes(target)))
        );
      });
    }

    // 4. Closest / Similarity Match ("ya uske aas paas wala")
    if (bestIndex === -1) {
      let highestScore = 0;
      let fallbackIndex = -1;

      options.forEach((opt, idx) => {
        const txt = (opt.text || "").trim().toLowerCase();
        const val = (opt.value || "").trim().toLowerCase();
        if (idx === 0 && (txt.includes("select") || txt.includes("choose") || txt === "")) return;

        const combined = `${val} ${txt}`;
        const targetWords = target.split(/\s+/).filter(Boolean);
        let score = 0;

        targetWords.forEach((tw) => {
          if (combined.includes(tw)) score += tw.length * 2;
        });

        let charMatches = 0;
        for (let ch of target) {
          if (combined.includes(ch)) charMatches++;
        }
        score += charMatches / Math.max(target.length, combined.length || 1);

        if (score > highestScore) {
          highestScore = score;
          fallbackIndex = idx;
        }
      });

      if (highestScore > 1.2 && fallbackIndex !== -1) {
        bestIndex = fallbackIndex;
      }
    }

    // 5. Apply Selection
    if (bestIndex !== -1) {
      selectEl.selectedIndex = bestIndex;
      const chosenOpt = options[bestIndex];
      selectEl.value = chosenOpt.value;
      selectEl.dispatchEvent(new Event("input", { bubbles: true }));
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    return false;
  }

  /**
   * Smartly selects the matching radio button in a radio group.
   */
  function smartCheckRadio(radioEl, rawTargetValue) {
    if (!radioEl || !rawTargetValue) return false;
    const target = String(rawTargetValue).trim().toLowerCase();

    let labelText = "";
    if (radioEl.id) {
      const lbl = document.querySelector(`label[for="${radioEl.id}"]`);
      if (lbl) labelText = lbl.innerText;
    }
    const parentText = radioEl.closest("label, div, td, p")?.innerText || "";
    const radioVal = (radioEl.value || "").trim().toLowerCase();
    const radioDescriptor = `${radioVal} ${labelText} ${parentText}`.trim().toLowerCase();

    const isMatch =
      radioDescriptor.includes(target) ||
      target.includes(radioVal) ||
      (target === "male" && (radioDescriptor.includes("male") || radioDescriptor.includes("men") || radioVal === "m")) ||
      (target === "female" && (radioDescriptor.includes("female") || radioDescriptor.includes("women") || radioVal === "f")) ||
      (target === "yes" && (radioDescriptor.includes("yes") || radioVal === "1" || radioVal === "y")) ||
      (target === "no" && (radioDescriptor.includes("no") || radioVal === "0" || radioVal === "n"));

    if (isMatch) {
      radioEl.checked = true;
      radioEl.dispatchEvent(new Event("input", { bubbles: true }));
      radioEl.dispatchEvent(new Event("change", { bubbles: true }));
      radioEl.dispatchEvent(new Event("click", { bubbles: true }));
      return true;
    }
    return false;
  }

  // 3. Scan DOM Inputs
  const inputs = Array.from(
    document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="password"]), select, textarea'
    )
  );

  const delayPerField = message.useTurboSpeed ? 15 : 120;
  let filledCount = 0;

  inputs.forEach((inputEl, idx) => {
    // Normal (Free) User: Only checks name, id, and placeholder attributes
    let descriptor = `${inputEl.name || ""} ${inputEl.id || ""} ${
      inputEl.placeholder || ""
    }`.toLowerCase();

    // PREMIUM FEATURE 1: AI / Deep Label & Context Mapping
    if (message.isPremium && message.useAiMapping) {
      const ariaLabel = inputEl.getAttribute("aria-label") || "";
      let labelText = "";
      if (inputEl.id) {
        const linkedLabel = document.querySelector(`label[for="${inputEl.id}"]`);
        if (linkedLabel) labelText = linkedLabel.innerText;
      }
      const parentText = inputEl.closest("label, div")?.innerText?.slice(0, 80) || "";
      descriptor += ` ${ariaLabel} ${labelText} ${parentText}`.toLowerCase();
    }

    let valueToInject = null;

    // Check direct indexed / unique match first
    const foundPair = lookupPairs.find((pair) =>
      pair.match.some((keyword) => descriptor.includes(keyword))
    );

    if (foundPair && foundPair.value) {
      valueToInject = foundPair.value;
    } else if (familyPassengers.length > 0) {
      // Check sequential matching for repeating passenger forms (IRCTC Tatkal table / flight guest cards)
      const isPassengerName =
        (descriptor.includes("passenger") || descriptor.includes("guest") || descriptor.includes("traveller")) &&
        (descriptor.includes("name") || descriptor.includes("psgn"));
      const isPassengerAge = descriptor.includes("age") && !descriptor.includes("damage");
      const isPassengerGender = descriptor.includes("gender") || descriptor.includes("sex");
      const isPassengerBerth = descriptor.includes("berth") || (descriptor.includes("seat") && !descriptor.includes("search"));
      const isPassengerFood = descriptor.includes("food") || descriptor.includes("meal");

      if (isPassengerName && sequentialPassengerIdx < familyPassengers.length) {
        valueToInject = familyPassengers[sequentialPassengerIdx].name;
        sequentialPassengerIdx++;
      } else if (isPassengerAge && sequentialAgeIdx < familyPassengers.length) {
        valueToInject = familyPassengers[sequentialAgeIdx].age;
        sequentialAgeIdx++;
      } else if (isPassengerGender && sequentialGenderIdx < familyPassengers.length) {
        valueToInject = familyPassengers[sequentialGenderIdx].gender;
        sequentialGenderIdx++;
      } else if (isPassengerBerth && sequentialBerthIdx < familyPassengers.length) {
        valueToInject = familyPassengers[sequentialBerthIdx].berth;
        sequentialBerthIdx++;
      } else if (isPassengerFood && sequentialFoodIdx < familyPassengers.length) {
        valueToInject = familyPassengers[sequentialFoodIdx].food;
        sequentialFoodIdx++;
      }
    }

    if (valueToInject) {
      filledCount++;
      setTimeout(() => {
        inputEl.focus();

        if (inputEl.tagName === "SELECT") {
          smartSelectOption(inputEl, valueToInject);
        } else if (inputEl.type === "radio") {
          smartCheckRadio(inputEl, valueToInject);
        } else if (inputEl.type === "checkbox") {
          const valLower = String(valueToInject).toLowerCase();
          const shouldCheck = ["yes", "true", "1", "agree", "opt", "checked"].some((w) => valLower.includes(w));
          if (shouldCheck) {
            inputEl.checked = true;
            inputEl.dispatchEvent(new Event("change", { bubbles: true }));
          }
        } else {
          inputEl.value = valueToInject;
          inputEl.dispatchEvent(new Event("input", { bubbles: true }));
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, idx * delayPerField);
    }
  });

  // PREMIUM FEATURE 2: Multi-Step Form Auto-Next
  if (message.isPremium && message.useMultiStep && filledCount > 0) {
    setTimeout(() => {
      const buttons = Array.from(document.querySelectorAll("button, input[type='button']"));
      const nextBtn = buttons.find((b) => {
        const txt = (b.innerText || b.value || "").toLowerCase().trim();
        return txt === "next" || txt === "next step" || txt === "continue";
      });
      if (nextBtn) {
        nextBtn.style.outline = "3px solid #14b8a6";
        nextBtn.click();
      }
    }, inputs.length * delayPerField + 250);
  }

  const modeLabel = message.isPremium ? "Premium Mode" : "Free Mode";
  sendResponse({ status: `✓ Filled ${filledCount} fields (${modeLabel})!` });
  return true;
});
