/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Tv,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface AndroidInstallModalProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isAndroid: boolean;
  onPromptInstall: () => Promise<boolean>;
  onLockLandscape: () => Promise<boolean>;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isInstallable,
  isInstalled,
  isAndroid,
  onPromptInstall,
  onLockLandscape,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'apk'>('install');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleInstallClick = async () => {
    sound.playCutePetSound();
    const success = await onPromptInstall();
    if (success) {
      setInstallSuccess(true);
      sound.playCatMeow();
    }
  };

  const handleLandscapeClick = async () => {
    sound.playPetChime(1);
    await onLockLandscape();
  };

  const bubblewrapCommand = `npm install -g @bubblewrap/cli\nbubblewrap init --manifest="${window.location.origin}/manifest.webmanifest"\nbubblewrap build`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(bubblewrapCommand);
    setCopiedCode(true);
    sound.playCutePetSound();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-100 via-amber-100 to-orange-100 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-rose-200 flex items-center justify-center text-rose-500">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-cozy text-stone-800 flex items-center gap-1.5">
                <span>Android App & APK</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono tracking-wide">
                  Landscape
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-cozy">
                Install directly on Android or package as standalone APK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/80 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 p-1 gap-1">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 px-3 rounded-xl font-cozy font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'install'
                ? 'bg-white text-rose-600 shadow-xs border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Direct Android Install</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl font-cozy font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-white text-rose-600 shadow-xs border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Build .APK File</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'install' ? (
            <>
              {/* App Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50/60 border border-amber-200 flex items-center gap-3.5">
                <img
                  src="/pwa-192x192.png"
                  alt="App Icon"
                  className="w-14 h-14 rounded-2xl shadow-md border border-rose-200 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold font-cozy text-stone-900 text-sm sm:text-base truncate">
                    Purrfect Haven: Cozy Cat Sanctuary
                  </h3>
                  <p className="text-xs text-stone-600">
                    Standalone Landscape WebAPK • Offline-ready • Zero latency
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" /> PWA Verified
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      <Tv className="w-3 h-3" /> Landscape Locked
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              {isInstalled || installSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold font-cozy text-sm">App Is Installed!</div>
                    <div className="text-xs text-emerald-700">
                      Launch Purrfect Haven directly from your Android home screen or app drawer anytime.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold font-cozy text-sm sm:text-base shadow-lg shadow-rose-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Download className="w-5 h-5" />
                    <span>{isInstallable ? 'Install to Android Home Screen' : 'Install App on This Device'}</span>
                  </button>

                  {!isInstallable && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-stone-600 space-y-1.5">
                      <p className="font-bold text-stone-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        How to install on Android Chrome:
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-stone-600 pl-1">
                        <li>Tap the <strong>three dots (⋮)</strong> menu in the top right corner of Chrome.</li>
                        <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        <li>Android will generate a native WebAPK with full landscape orientation!</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Landscape Fullscreen Helper */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <RotateCw className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-bold font-cozy text-xs sm:text-sm text-stone-800">
                      Landscape Orientation Lock
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Switch to full-screen landscape view right now
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLandscapeClick}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold font-cozy text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Enter Landscape
                </button>
              </div>
            </>
          ) : (
            /* APK Build Tab */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-700 space-y-2">
                <p className="font-bold font-cozy text-stone-900 text-sm flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-600" />
                  Package as Standalone Android .APK
                </p>
                <p>
                  Because this game is fully configured as a PWA with landscape manifest and icons, you can create a signed Android <code>.apk</code> in 1 command using Google's official <strong>Bubblewrap (TWA)</strong> or <strong>PWABuilder</strong>.
                </p>
              </div>

              {/* Method 1: PWABuilder (No coding, 1-click APK download) */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold font-cozy text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>1-Click Online APK Generator (Easiest)</span>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">Recommended</span>
                </div>
                <p className="text-xs text-stone-600">
                  Enter your app URL into PWABuilder. It packages this app with landscape settings into a downloadable <code>.apk</code> ready to install or upload to Google Play.
                </p>
                <a
                  href={`https://www.pwabuilder.com/?url=${encodeURIComponent(window.location.origin)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold font-cozy text-xs shadow-xs transition-colors"
                >
                  <span>Open PWABuilder for APK</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Method 2: Bubblewrap CLI */}
              <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-100 space-y-2 font-mono text-xs rounded-xl shadow-inner">
                <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
                  <span>CLI Method (Bubblewrap TWA)</span>
                  <button
                    onClick={handleCopyCommand}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                  >
                    {copiedCode ? 'Copied!' : 'Copy Commands'}
                  </button>
                </div>
                <pre className="text-emerald-400 overflow-x-auto p-1 leading-relaxed whitespace-pre-wrap">
                  {bubblewrapCommand}
                </pre>
                <p className="text-[11px] text-stone-400 pt-1">
                  Generates <code>app-release-signed.apk</code> with landscape orientation locked.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-cozy">
          <span>Purrfect Haven • Mobile & Landscape Optimized</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
