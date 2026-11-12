import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Printer, Clock } from 'lucide-react';

export const Reports: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadJson = () => {
    setIsExporting(true);
    const reportData = {
      platform: 'QUANTUM GUARD — Enterprise Post-Quantum Security Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      executiveSummary: {
        readinessIndex: 64,
        status: 'Action Required',
        totalAssets: 8,
        vulnerableCount: 5,
        quantumSafeCount: 3,
        threatHorizonDeficitYears: 6,
      },
      nistStandardsAligned: ['FIPS 203 (ML-KEM)', 'FIPS 204 (ML-DSA)', 'FIPS 205 (SLH-DSA)'],
      vulnerabilities: [
        {
          id: 'VULN-01',
          primitive: 'RSA-2048 / 4096 Key Exchange & Signatures',
          severity: 'Critical',
          exposure: 'Shor polynomial time factoring',
          remediation: 'Deploy ML-KEM-768 hybrid key exchange (FIPS 203)',
        },
        {
          id: 'VULN-02',
          primitive: 'ECDHE P-256 / Ed25519',
          severity: 'Critical',
          exposure: 'Shor discrete logarithm break (HNDL susceptible)',
          remediation: 'Upgrade to X25519 + ML-KEM-768 hybrid',
        },
        {
          id: 'VULN-03',
          primitive: 'AES-128',
          severity: 'High',
          exposure: 'Grover speedup leaves 64-bit effective key strength',
          remediation: 'Migrate to AES-256-GCM',
        },
      ],
      complianceRecommendations: [
        'Mandate hybrid classical + PQC TLS 1.3 across all external facing API endpoints by Q3 2027.',
        'Implement dual-certificate chains (ML-DSA-65) for web root and intermediate CAs.',
        'Migrate firmware signing to stateful/stateless hash-based signatures (FIPS 205 / SP 800-208).',
      ],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-guard-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
            Assessment &amp; Compliance Reports
          </h1>
          <p className="text-xs text-[#969DAB] mt-1">
            Comprehensive audit reports, vulnerability summaries, and remediation roadmaps for executive leadership and compliance auditors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#181D28] hover:bg-[#202737] border border-[#292F3B] text-[#E8EAF0] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#8499B8]" />
            <span>Print View</span>
          </button>

          <button
            onClick={downloadJson}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#4E65C6] hover:bg-[#4257B2] text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export Audit Report (JSON)'}</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292F3B] pb-4">
          <div>
            <span className="text-[11px] font-mono text-[#8290C9] uppercase">Executive Report</span>
            <h2 className="text-base font-semibold text-[#E8EAF0] mt-0.5">
              Post-Quantum Cryptographic Readiness Scorecard
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#969DAB]">Overall Readiness</span>
            <div className="text-2xl font-bold font-mono text-[#D49A3D]">64 / 100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-1">
            <div className="text-xs text-[#969DAB]">Evaluated Assets</div>
            <div className="text-xl font-bold text-[#E8EAF0]">8 Systems</div>
            <p className="text-[11px] text-[#8499B8]">TLS, SSH, DB, and Signing Endpoints</p>
          </div>

          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-1">
            <div className="text-xs text-[#C55353]">Critical Exposures</div>
            <div className="text-xl font-bold text-[#C55353]">5 Systems</div>
            <p className="text-[11px] text-[#969DAB]">Vulnerable to retroactive decryption</p>
          </div>

          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-1">
            <div className="text-xs text-[#4E9F76]">Compliant Implementations</div>
            <div className="text-xl font-bold text-[#4E9F76]">3 Systems</div>
            <p className="text-[11px] text-[#969DAB]">Active hybrid PQC or AES-256</p>
          </div>
        </div>
      </div>

      {/* Identified Vulnerabilities Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#E8EAF0]">
          Identified Cryptographic Vulnerabilities
        </h2>

        <div className="space-y-3">
          {[
            {
              id: 'VULN-01',
              title: 'Legacy RSA-2048 Public Key Exchange on Primary Ingress',
              severity: 'Critical',
              impact: 'High risk of Harvest-Now-Decrypt-Later (HNDL) data compromise.',
              recommendation: 'Deploy hybrid X25519 + ML-KEM-768 in accordance with NIST FIPS 203.',
            },
            {
              id: 'VULN-02',
              title: 'ECDSA P-256 Code Signing Keys for West Coast Cluster',
              severity: 'Critical',
              impact: 'Vulnerable to forgery by quantum Shor discrete log computation.',
              recommendation: 'Transition build pipelines to dual-signature ML-DSA-65 (NIST FIPS 204).',
            },
            {
              id: 'VULN-03',
              title: 'Database at Rest AES-128 Encryption in Legacy Cluster',
              severity: 'High',
              impact: 'Grover algorithm halves effective brute force security to 64-bit threshold.',
              recommendation: 'Re-encrypt storage blocks with AES-256-GCM.',
            },
          ].map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-xl bg-[#181D28] border border-[#292F3B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#8290C9]">{v.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      v.severity === 'Critical'
                        ? 'bg-[#2A1E20] text-[#C55353] border border-[#48282B]'
                        : 'bg-[#2F281E] text-[#D49A3D] border border-[#483B25]'
                    }`}
                  >
                    {v.severity}
                  </span>
                  <h3 className="text-xs font-semibold text-[#E8EAF0]">{v.title}</h3>
                </div>
                <p className="text-xs text-[#969DAB]">{v.impact}</p>
                <p className="text-xs text-[#8499B8]">
                  <strong className="text-[#8290C9]">Remediation:</strong> {v.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Roadmap Milestones */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-4">
        <h2 className="text-sm font-semibold text-[#E8EAF0]">
          Executive Remediation Milestones
        </h2>

        <div className="space-y-3 text-xs text-[#969DAB]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#4E9F76] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#E8EAF0]">Phase 1: Cryptographic Inventory Complete</strong> — 100% of internal and edge endpoints cataloged.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#D49A3D] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#E8EAF0]">Phase 2: Hybrid TLS 1.3 Deployment (In Progress)</strong> — Active rollout of ML-KEM-768 hybrid key exchange on edge proxies.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#8499B8] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#E8EAF0]">Phase 3: PKI Certificate Authority Upgrades (Scheduled Q2 2027)</strong> — Dual-signing certificates issued with ML-DSA-65.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
