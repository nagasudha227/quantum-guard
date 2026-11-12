import React, { useState } from 'react';
import { CryptoLabRequest, CryptoLabResponse } from '../types';
import { api } from '../services/api';
import { Play, Key, Lock, Unlock, ShieldAlert, CheckCircle2, Cpu, Copy, Check } from 'lucide-react';

export const CryptoLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conventional' | 'pqc' | 'hybrid'>('pqc');
  const [algorithm, setAlgorithm] = useState<string>('ML-KEM-768');
  const [operation, setOperation] = useState<'keygen' | 'encrypt' | 'decrypt' | 'sign' | 'verify'>('keygen');
  const [testMessage, setTestMessage] = useState<string>('Confidential enterprise transaction: wire_id=98319-PQC');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CryptoLabResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Algorithms per tab
  const tabAlgos = {
    conventional: ['RSA-2048', 'ECDH-P256', 'AES-256-GCM'],
    pqc: ['ML-KEM-768', 'ML-KEM-1024', 'ML-DSA-65', 'SLH-DSA-128s'],
    hybrid: ['X25519 + ML-KEM-768', 'ECDH-P256 + ML-KEM-768'],
  };

  const handleTabChange = (tab: 'conventional' | 'pqc' | 'hybrid') => {
    setActiveTab(tab);
    setAlgorithm(tabAlgos[tab][0]);
    setResult(null);
  };

  const executeCrypto = async () => {
    setIsRunning(true);
    setResult(null);

    const payload: CryptoLabRequest = {
      category: activeTab,
      algorithm,
      operation,
      inputMessage: testMessage,
    };

    const startTime = performance.now();

    // 1. Try real FastAPI backend execution first
    const backendRes = await api.request<CryptoLabResponse>('/api/lab/execute', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (backendRes.data && backendRes.isLive) {
      setResult({
        ...backendRes.data,
        isBackendResult: true,
      });
      setIsRunning(false);
      return;
    }

    // 2. If backend is offline, check if browser Web Crypto API can perform real conventional crypto
    if (activeTab === 'conventional') {
      try {
        if (algorithm === 'AES-256-GCM') {
          // Genuine real Web Crypto execution
          const key = await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
          );
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          const enc = new TextEncoder();
          const ciphertext = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            enc.encode(testMessage)
          );

          const rawKey = await window.crypto.subtle.exportKey('raw', key);
          const hexKey = Array.from(new Uint8Array(rawKey))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
          const hexIv = Array.from(iv)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
          const hexCipher = Array.from(new Uint8Array(ciphertext))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

          const latencyUs = Math.round((performance.now() - startTime) * 1000);

          setResult({
            success: true,
            algorithm,
            category: 'conventional',
            operation,
            publicKeyHex: `IV: 0x${hexIv}`,
            secretKeyHex: `0x${hexKey}`,
            outputHex: `0x${hexCipher}`,
            executionTimeUs: latencyUs,
            isBackendResult: false,
            message: 'Executed locally via Browser Web Cryptography API (Real 256-bit AES-GCM)',
          });
          setIsRunning(false);
          return;
        }
      } catch (err: any) {
        setResult({
          success: false,
          algorithm,
          category: activeTab,
          operation,
          executionTimeUs: 0,
          isBackendResult: false,
          message: `Local execution error: ${err.message}`,
        });
        setIsRunning(false);
        return;
      }
    }

    // 3. For PQC / Hybrid when backend is offline:
    // Inform the user honestly that FastAPI backend is required for native liboqs execution
    const latencyUs = Math.round((performance.now() - startTime) * 1000);

    // Provide honest offline notice
    setResult({
      success: false,
      algorithm,
      category: activeTab,
      operation,
      executionTimeUs: latencyUs,
      isBackendResult: false,
      message:
        'FastAPI Cryptographic Engine is currently offline at http://localhost:8000. Real NIST FIPS 203/204 lattice polynomial calculations require the Python FastAPI backend with liboqs-python or oqs-provider installed.',
    });
    setIsRunning(false);
  };

  const copyResult = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
          Interactive Crypto Lab
        </h1>
        <p className="text-xs text-[#969DAB] mt-1">
          Direct testing bench comparing Conventional, Post-Quantum, and Hybrid cryptographic operations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#292F3B] gap-6 text-xs">
        <button
          onClick={() => handleTabChange('conventional')}
          className={`pb-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'conventional'
              ? 'border-[#8290C9] text-[#E8EAF0]'
              : 'border-transparent text-[#969DAB] hover:text-[#E8EAF0]'
          }`}
        >
          Conventional Cryptography
        </button>

        <button
          onClick={() => handleTabChange('pqc')}
          className={`pb-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'pqc'
              ? 'border-[#8290C9] text-[#E8EAF0]'
              : 'border-transparent text-[#969DAB] hover:text-[#E8EAF0]'
          }`}
        >
          Post-Quantum (NIST FIPS 203/204/205)
        </button>

        <button
          onClick={() => handleTabChange('hybrid')}
          className={`pb-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'hybrid'
              ? 'border-[#8290C9] text-[#E8EAF0]'
              : 'border-transparent text-[#969DAB] hover:text-[#E8EAF0]'
          }`}
        >
          Hybrid Cryptography (Dual Mode)
        </button>
      </div>

      {/* Control Console */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Algorithm Selection */}
          <div>
            <label className="block text-xs font-medium text-[#969DAB] mb-1.5">
              Select Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full px-3 py-2 bg-[#131720] border border-[#242A38] rounded-lg text-xs text-[#E8EAF0] focus:outline-none focus:border-[#8290C9]"
            >
              {tabAlgos[activeTab].map((algo) => (
                <option key={algo} value={algo}>
                  {algo}
                </option>
              ))}
            </select>
          </div>

          {/* Operation */}
          <div>
            <label className="block text-xs font-medium text-[#969DAB] mb-1.5">
              Cryptographic Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#131720] border border-[#242A38] rounded-lg text-xs text-[#E8EAF0] focus:outline-none focus:border-[#8290C9]"
            >
              <option value="keygen">Key Generation (KeyGen)</option>
              <option value="encrypt">Encrypt / Encapsulate</option>
              <option value="decrypt">Decrypt / Decapsulate</option>
              <option value="sign">Sign Message</option>
              <option value="verify">Verify Signature</option>
            </select>
          </div>
        </div>

        {/* Input Message */}
        <div>
          <label className="block text-xs font-medium text-[#969DAB] mb-1.5">
            Test Payload / Plaintext Message
          </label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#131720] border border-[#242A38] rounded-lg text-xs text-[#E8EAF0] focus:outline-none focus:border-[#8290C9] font-mono"
            placeholder="Enter plaintext message to test..."
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-[#8499B8]">
            Sends execution request to <code className="text-[#E8EAF0]">POST /api/lab/execute</code>
          </div>

          <button
            onClick={executeCrypto}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium bg-[#4E65C6] hover:bg-[#4257B2] disabled:bg-[#252E46] text-white transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Processing Cryptography...' : 'Execute Operation'}</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Result Output */}
      {result && (
        <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#292F3B] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E8EAF0]">
                Cryptographic Output Telemetry
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  result.isBackendResult
                    ? 'bg-[#1F2C24] text-[#4E9F76] border border-[#274431]'
                    : result.success
                    ? 'bg-[#1F2636] text-[#8290C9] border border-[#2B374D]'
                    : 'bg-[#2A1E20] text-[#C55353] border border-[#48282B]'
                }`}
              >
                {result.isBackendResult
                  ? 'LIVE FASTAPI RESULT'
                  : result.success
                  ? 'CLIENT WEB-CRYPTO API'
                  : 'BACKEND REQUIRED'}
              </span>
            </div>

            <button
              onClick={copyResult}
              className="text-xs text-[#8499B8] hover:text-[#E8EAF0] inline-flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4E9F76]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          {result.message && (
            <p className={`text-xs ${result.success ? 'text-[#969DAB]' : 'text-[#C55353]'}`}>
              {result.message}
            </p>
          )}

          {result.success && (
            <div className="space-y-3 font-mono text-xs">
              {result.publicKeyHex && (
                <div className="p-3 rounded-lg bg-[#131720] border border-[#242A38] space-y-1">
                  <div className="text-[10px] text-[#8499B8] uppercase">Public Key / Parameter</div>
                  <div className="text-[#8290C9] break-all">{result.publicKeyHex}</div>
                </div>
              )}

              {result.outputHex && (
                <div className="p-3 rounded-lg bg-[#131720] border border-[#242A38] space-y-1">
                  <div className="text-[10px] text-[#8499B8] uppercase">Ciphertext / Output Stream</div>
                  <div className="text-[#E8EAF0] break-all">{result.outputHex}</div>
                </div>
              )}

              {result.secretKeyHex && (
                <div className="p-3 rounded-lg bg-[#131720] border border-[#242A38] space-y-1">
                  <div className="text-[10px] text-[#8499B8] uppercase">Established Secret</div>
                  <div className="text-[#4E9F76] break-all">{result.secretKeyHex}</div>
                </div>
              )}

              <div className="text-[11px] text-[#8499B8] pt-1">
                Measured Latency: <span className="text-[#E8EAF0] font-semibold">{result.executionTimeUs} µs</span>
              </div>
            </div>
          )}

          {!result.success && !result.isBackendResult && (
            <div className="p-4 rounded-xl bg-[#141823] border border-[#292F3B] space-y-2 text-xs">
              <div className="font-medium text-[#E8EAF0]">To connect live PQC execution:</div>
              <p className="text-[#969DAB] leading-relaxed">
                Ensure your teammate's FastAPI server is running with the endpoint <code className="text-[#8290C9]">POST /api/lab/execute</code> on port 8000. Quantum Guard will automatically stream live lattice calculations into this view without page reload.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
