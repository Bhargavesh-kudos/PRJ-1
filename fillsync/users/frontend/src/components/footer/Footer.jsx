/**
 * ============================================================================
 * FILE: frontend/src/components/footer/Footer.jsx
 * PURPOSE: Public Website Footer with links, team attribution, and contact.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Col 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">
              Fill<span className="text-teal-400">Sync</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Smart Form Automation &amp; Dynamic Profile Management System.
            Built as a capstone project at BML Munjal University.
          </p>
        </div>

        {/* Col 2: Product Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-teal-400">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-teal-400">How It Works</a></li>
            <li><a href="#pricing" className="hover:text-teal-400">Pricing Plans</a></li>
            <li><Link to="/login" className="hover:text-teal-400">Login</Link></li>
          </ul>
        </div>

        {/* Col 3: Privacy & Safety */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Privacy &amp; Safety
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Your data stays on your account</li>
            <li>No CVV or password storage</li>
            <li>Stops safely at CAPTCHAs</li>
            <li>No third-party data sharing</li>
          </ul>
        </div>

        {/* Col 4: PRJ-1 Capstone Team */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            PRJ-1 Capstone Team
          </h4>
          <p className="text-sm text-slate-300 font-medium">BML Munjal University (5th Sem)</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Bhargavesh • Neal Soni • Yash Yadav • Mayank Verma • Nitin Rao
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 FillSync — PRJ-1 Capstone Project. Running on Localhost.</p>
        <p>Compatible with Google Chrome, Microsoft Edge &amp; Brave</p>
      </div>
    </footer>
  );
}
