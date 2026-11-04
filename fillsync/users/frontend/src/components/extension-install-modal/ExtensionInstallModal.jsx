/**
 * ============================================================================
 * FILE: frontend/src/components/extension-install-modal/ExtensionInstallModal.jsx
 * PURPOSE: Interactive Step-by-Step Installation Guide for all Chromium Browsers:
 *          Google Chrome, Microsoft Edge, Brave Browser, Opera & Opera GX.
 * ============================================================================
 */

import React, { useState } from "react";
import {
  Chrome,
  Download,
  FolderArchive,
  ToggleRight,
  Puzzle,
  Copy,
  Check,
  X,
  ShieldCheck,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function ExtensionInstallModal({ isOpen, onClose }) {
  const [selectedBrowser, setSelectedBrowser] = useState("chrome");
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const browserGuides = {
    chrome: {
      name: "Google Chrome",
      icon: "🌐",
      url: "chrome://extensions",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      accentBg: "bg-blue-600",
      steps: [
        {
          num: "1",
          title: "Download & Extract the ZIP",
          desc: "Click 'Download Extension (.zip)' and extract the downloaded fillsync-extension.zip folder on your computer."
        },
        {
          num: "2",
          title: "Open Extensions Page",
          desc: "In Google Chrome, open a new tab, paste the link below in the address bar, and press Enter:",
          hasCopyableUrl: true,
          urlText: "chrome://extensions"
        },
        {
          num: "3",
          title: "Turn ON Developer Mode",
          desc: "In the top-right corner of the Extensions page, switch the 'Developer mode' toggle to ON."
        },
        {
          num: "4",
          title: "Click 'Load unpacked'",
          desc: "In the top-left corner, click 'Load unpacked' and select the unzipped extension folder."
        },
        {
          num: "5",
          title: "Pin FillSync to Toolbar",
          desc: "Click the puzzle icon 🧩 in Chrome's top bar and pin FillSync for 1-click access anytime!"
        }
      ]
    },
    edge: {
      name: "Microsoft Edge",
      icon: "🔷",
      url: "edge://extensions",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      accentBg: "bg-sky-600",
      steps: [
        {
          num: "1",
          title: "Download & Extract the ZIP",
          desc: "Download fillsync-extension.zip and extract it to your Documents or Desktop folder."
        },
        {
          num: "2",
          title: "Open Edge Extensions",
          desc: "In Microsoft Edge, paste this URL in the address bar and press Enter:",
          hasCopyableUrl: true,
          urlText: "edge://extensions"
        },
        {
          num: "3",
          title: "Enable Developer Mode",
          desc: "Look at the left sidebar at the bottom and turn ON the 'Developer mode' toggle switch."
        },
        {
          num: "4",
          title: "Click 'Load unpacked'",
          desc: "A blue button labeled 'Load unpacked' will appear at the top. Click it and pick the unzipped extension folder."
        },
        {
          num: "5",
          title: "Ready to Auto-Fill",
          desc: "FillSync will now appear in your Edge toolbar and work across all web pages!"
        }
      ]
    },
    brave: {
      name: "Brave Browser",
      icon: "🦁",
      url: "brave://extensions",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
      accentBg: "bg-orange-600",
      steps: [
        {
          num: "1",
          title: "Download & Extract ZIP",
          desc: "Extract the downloaded fillsync-extension.zip archive onto your PC."
        },
        {
          num: "2",
          title: "Open Brave Extensions",
          desc: "In Brave, open a new tab and paste this URL into the address bar:",
          hasCopyableUrl: true,
          urlText: "brave://extensions"
        },
        {
          num: "3",
          title: "Turn ON Developer Mode",
          desc: "In the top-right corner of the Extensions dashboard, toggle Developer mode ON."
        },
        {
          num: "4",
          title: "Load Unpacked",
          desc: "Click 'Load unpacked' in the top-left and select the extracted extension folder."
        },
        {
          num: "5",
          title: "Pin to Toolbar",
          desc: "Click the extension puzzle piece icon and pin FillSync. Brave Shields will never interfere!"
        }
      ]
    },
    opera: {
      name: "Opera & Opera GX",
      icon: "🔴",
      url: "opera://extensions",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      accentBg: "bg-red-600",
      steps: [
        {
          num: "1",
          title: "Download & Extract ZIP",
          desc: "Extract the downloaded fillsync-extension.zip folder on your computer."
        },
        {
          num: "2",
          title: "Open Opera Extensions",
          desc: "In Opera or Opera GX, type or paste the URL below into the address bar:",
          hasCopyableUrl: true,
          urlText: "opera://extensions"
        },
        {
          num: "3",
          title: "Enable Developer Mode",
          desc: "In the top-right corner, switch the 'Developer Mode' toggle button to ON."
        },
        {
          num: "4",
          title: "Load Unpacked Extension",
          desc: "Click the 'Load unpacked extension' button and select your extracted folder."
        },
        {
          num: "5",
          title: "All Set!",
          desc: "FillSync will now appear in your Opera sidebar or top toolbar ready to fill any form!"
        }
      ]
    },
    firefox: {
      name: "Mozilla Firefox",
      icon: "🦊",
      url: "about:debugging#/runtime/this-firefox",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      accentBg: "bg-amber-600",
      steps: [
        {
          num: "1",
          title: "Download & Extract the ZIP",
          desc: "Download fillsync-extension.zip and extract it to your computer."
        },
        {
          num: "2",
          title: "Open Firefox Debugging Page",
          desc: "In Firefox, open a new tab and paste this URL into the address bar:",
          hasCopyableUrl: true,
          urlText: "about:debugging#/runtime/this-firefox"
        },
        {
          num: "3",
          title: "Click 'This Firefox'",
          desc: "On the left sidebar, click 'This Firefox' to view local extensions."
        },
        {
          num: "4",
          title: "Click 'Load Temporary Add-on...'",
          desc: "Click the blue 'Load Temporary Add-on...' button and select the manifest.json file inside your unzipped extension folder."
        },
        {
          num: "5",
          title: "Active on Firefox",
          desc: "FillSync will appear in your Firefox extension bar and auto-fill forms instantly!"
        }
      ]
    },
    arc: {
      name: "Arc Browser",
      icon: "🎨",
      url: "arc://extensions",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      accentBg: "bg-purple-600",
      steps: [
        {
          num: "1",
          title: "Download & Extract the ZIP",
          desc: "Download and extract fillsync-extension.zip onto your PC."
        },
        {
          num: "2",
          title: "Open Arc Extensions",
          desc: "Press Ctrl+T, type this link in Arc's Command Bar, and press Enter:",
          hasCopyableUrl: true,
          urlText: "arc://extensions"
        },
        {
          num: "3",
          title: "Enable Developer Mode",
          desc: "Switch the Developer Mode toggle ON in the top-right corner."
        },
        {
          num: "4",
          title: "Click 'Load unpacked'",
          desc: "Click 'Load unpacked' and select the unzipped extension folder."
        },
        {
          num: "5",
          title: "Pinned to Arc",
          desc: "FillSync will now appear in your Arc Site Control and toolbar!"
        }
      ]
    },
    duckduckgo: {
      name: "DuckDuckGo & Others",
      icon: "🦆",
      url: "duckduckgo.com",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      accentBg: "bg-amber-700",
      steps: [
        {
          num: "1",
          title: "DuckDuckGo Search Works 100%",
          desc: "If you use DuckDuckGo as your search engine on Chrome, Brave, Edge, or Firefox, FillSync works 100% seamlessly on all forms and searches!"
        },
        {
          num: "2",
          title: "DuckDuckGo Standalone Desktop App Policy",
          desc: "DuckDuckGo's standalone desktop app (Windows/Mac) intentionally disables all third-party browser extensions to ensure extreme tracker blocking."
        },
        {
          num: "3",
          title: "Best Privacy Alternative: Brave Browser",
          desc: "For maximum privacy + full extension support, we recommend Brave Browser (brave://extensions) with DuckDuckGo set as the default search engine."
        },
        {
          num: "4",
          title: "All Other Chromium Browsers (Vivaldi, Kiwi, Thorium)",
          desc: "Any Chromium-based browser supports FillSync! Just visit its extensions page, toggle Developer Mode ON, and click 'Load unpacked'."
        }
      ]
    }
  };

  const current = browserGuides[selectedBrowser];

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>How to Install FillSync in Your Browser</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Chromium setup guide &bull; Takes less than 30 seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Selector Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 shrink-0">
          {Object.entries(browserGuides).map(([key, data]) => {
            const isActive = selectedBrowser === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedBrowser(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <span className="text-sm">{data.icon}</span>
                <span>{data.name}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Steps Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Direct Download Action Button */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <p className="text-xs font-extrabold text-teal-950 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-teal-600" />
                <span>Step 1: Download Extension File</span>
              </p>
              <p className="text-[11px] text-teal-800 mt-0.5">
                Click the button to download <code>fillsync-extension.zip</code> to your computer, then follow the setup steps below.
              </p>
            </div>
            <a
              href="/fillsync-extension.zip"
              download="fillsync-extension.zip"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download fillsync-extension.zip</span>
            </a>
          </div>

          {/* Numbered Steps */}
          <div className="space-y-3">
            {current.steps.map((st) => (
              <div
                key={st.num}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all flex items-start gap-3.5 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-teal-400 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {st.num}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>

                  {st.hasCopyableUrl && (
                    <div className="mt-2 flex items-center gap-2 max-w-sm">
                      <code className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-mono text-xs select-all flex-1">
                        {st.urlText}
                      </code>
                      <button
                        onClick={() => handleCopy(st.urlText)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shrink-0"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Security & Safety Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Why Developer Mode? </span>
              Google Chrome and Chromium browsers enforce this security policy to prevent
              random websites from silently injecting unauthorized software. Developer Mode
              is the official, 100% safe mechanism provided by Google to install verified extensions.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Need help? Check out our viva demo guide.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Got it, Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
}
