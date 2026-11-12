import React, { useState, useEffect } from 'react';
import { api, DEFAULT_BACKEND_URL } from '../services/api';
import { Server, CheckCircle2, AlertCircle, RefreshCw, Save, Shield } from 'lucide-react';

export const Settings: React.FC = () => {
  const [backendUrl, setBackendUrlState] = useState<string>(api.getBaseUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'online' | 'offline';
    latencyMs?: number;
    message?: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Policy Settings
  const [cnsaMode, setCnsaMode] = useState<boolean>(true);
  const [requireHybrid, setRequireHybrid] = useState<boolean>(true);
  const [alertDays, setAlertDays] = useState<number>(60);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setIsTesting(true);
    const res = await api.checkHealth();
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSave = () => {
    api.setBaseUrl(backendUrl);
    setSavedSuccess(true);
    checkBackend();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
          Platform Settings
        </h1>
        <p className="text-xs text-[#969DAB] mt-1">
          Configure backend API endpoints, cryptographic security policies, and system preferences.
        </p>
      </div>

      {/* Backend Integration Settings */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-5">
        <div className="flex items-center justify-between border-b border-[#292F3B] pb-3">
          <div>
            <h2 className="text-sm font-semibold text-[#E8EAF0]">
              Python FastAPI Backend Connection
            </h2>
            <p className="text-xs text-[#969DAB] mt-0.5">
              Target address for the separate FastAPI server developed on the network
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#8290C9]">
            Default: http://localhost:8000
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#969DAB] mb-1.5">
              Backend Endpoint URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrlState(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3.5 py-2 bg-[#131720] border border-[#242A38] rounded-lg text-xs text-[#E8EAF0] focus:outline-none focus:border-[#8290C9] font-mono"
              />
              <button
                onClick={checkBackend}
                disabled={isTesting}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#1F2636] hover:bg-[#252E46] border border-[#2B374D] text-[#E8EAF0] transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Test Ping</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[#4E65C6] hover:bg-[#4257B2] text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
            {savedSuccess && (
              <span className="text-xs text-[#4E9F76] font-mono mt-1 inline-block">
                Settings saved successfully!
              </span>
            )}
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
                testResult.status === 'online'
                  ? 'bg-[#18261F] border-[#254232] text-[#E8EAF0]'
                  : 'bg-[#251A1E] border-[#442229] text-[#E8EAF0]'
              }`}
            >
              {testResult.status === 'online' ? (
                <CheckCircle2 className="w-5 h-5 text-[#4E9F76] shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#D49A3D] shrink-0" />
              )}
              <div className="space-y-0.5">
                <div className="font-semibold">
                  {testResult.status === 'online'
                    ? `FastAPI Backend Online (${testResult.latencyMs}ms latency)`
                    : 'Backend Currently Offline / Standalone Mode'}
                </div>
                <div className="text-[11px] text-[#969DAB]">
                  {testResult.message ||
                    (testResult.status === 'online'
                      ? 'Live telemetry and cryptographic calculations enabled.'
                      : 'Frontend operates independently with demo datasets and Web Crypto API. Ready for FastAPI connection.')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cryptographic Security Policy */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-5">
        <div className="border-b border-[#292F3B] pb-3">
          <h2 className="text-sm font-semibold text-[#E8EAF0]">
            Enterprise Cryptographic Policies
          </h2>
          <p className="text-xs text-[#969DAB] mt-0.5">
            Rules governing algorithm compliance and certificate evaluation
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131720] border border-[#242A38]">
            <div className="space-y-0.5 max-w-lg">
              <span className="font-medium text-[#E8EAF0]">
                Enforce CNSA 2.0 Compliance Timelines
              </span>
              <p className="text-[#969DAB] text-[11px]">
                Flags systems using algorithms not approved under NSA Commercial National Security Algorithm Suite 2.0.
              </p>
            </div>
            <input
              type="checkbox"
              checked={cnsaMode}
              onChange={(e) => setCnsaMode(e.target.checked)}
              className="accent-[#4E65C6] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131720] border border-[#242A38]">
            <div className="space-y-0.5 max-w-lg">
              <span className="font-medium text-[#E8EAF0]">
                Require Hybrid Dual-Key Exchange (X25519 + ML-KEM)
              </span>
              <p className="text-[#969DAB] text-[11px]">
                Treat pure classical ECDH as critical vulnerability; mandate hybrid encapsulation for TLS 1.3 endpoints.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireHybrid}
              onChange={(e) => setRequireHybrid(e.target.checked)}
              className="accent-[#4E65C6] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131720] border border-[#242A38]">
            <div className="space-y-0.5">
              <span className="font-medium text-[#E8EAF0]">
                Certificate Expiration Warning Horizon
              </span>
              <p className="text-[#969DAB] text-[11px]">
                Highlight certificates requiring migration before renewal window.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="15"
                max="365"
                value={alertDays}
                onChange={(e) => setAlertDays(Number(e.target.value))}
                className="w-20 px-2 py-1 bg-[#0C0F16] border border-[#242A38] rounded text-xs text-[#E8EAF0] text-center font-mono"
              />
              <span className="text-[#969DAB] text-[11px]">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Information */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-3">
        <h2 className="text-sm font-semibold text-[#E8EAF0]">About QUANTUM GUARD</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 font-mono text-xs">
          <div>
            <div className="text-[#8499B8] text-[11px]">Version</div>
            <div className="text-[#E8EAF0] mt-0.5">v1.0.0-PROD</div>
          </div>
          <div>
            <div className="text-[#8499B8] text-[11px]">NIST Standards</div>
            <div className="text-[#E8EAF0] mt-0.5">FIPS 203, 204, 205</div>
          </div>
          <div>
            <div className="text-[#8499B8] text-[11px]">Backend Target</div>
            <div className="text-[#E8EAF0] mt-0.5">Python FastAPI</div>
          </div>
          <div>
            <div className="text-[#8499B8] text-[11px]">License</div>
            <div className="text-[#E8EAF0] mt-0.5">MIT / Enterprise</div>
          </div>
        </div>
      </div>
    </div>
  );
};

