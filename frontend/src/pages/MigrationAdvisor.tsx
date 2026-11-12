import React, { useState, useEffect } from 'react';
import { MigrationItem } from '../types';
import { ArrowLeftRight, CheckCircle, Clock, AlertCircle, Cpu, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

const defaultMigrations: MigrationItem[] = [
  {
    id: 'mig-01',
    existingAlgorithm: 'ECDHE (X25519 / NIST P-256) Key Exchange',
    recommendedNistReplacement: 'ML-KEM-768 (Hybrid with X25519)',
    nistStandard: 'FIPS 203 (ML-KEM)',
    priority: 'Immediate',
    reasoning:
      'Harvest Now, Decrypt Later (HNDL) adversaries are actively capturing TLS sessions. Deploying hybrid X25519 + ML-KEM-768 in TLS 1.3 preserves FIPS 140 backwards compatibility while eliminating retroactive decryption risks.',
    progressPercent: 75,
    stage: 'Hybrid Pilot',
  },
  {
    id: 'mig-02',
    existingAlgorithm: 'RSA-2048 / RSA-4096 Web & Server Certificates',
    recommendedNistReplacement: 'ML-DSA-65 (Dual-Certificate Chain)',
    nistStandard: 'FIPS 204 (ML-DSA)',
    priority: 'High',
    reasoning:
      'Digital signature verification requires PKI migration. ML-DSA-65 provides Category 3 quantum security with 3.3KB signature sizes. Dual-leaf certificates allow legacy and quantum-safe clients to negotiate appropriate paths.',
    progressPercent: 40,
    stage: 'PKI Update',
  },
  {
    id: 'mig-03',
    existingAlgorithm: 'Firmware & Secure Boot RSA-3072 / 4096 Signatures',
    recommendedNistReplacement: 'SLH-DSA-128s or LMS/XMSS (SP 800-208)',
    nistStandard: 'FIPS 205 (SLH-DSA)',
    priority: 'Immediate',
    reasoning:
      'Firmware verified today will remain in field devices for 10-20 years. Stateless hash-based (SLH-DSA) and stateful hash-based (LMS) signatures rely purely on hash security properties, offering the most conservative security proofs.',
    progressPercent: 20,
    stage: 'Discovery',
  },
  {
    id: 'mig-04',
    existingAlgorithm: 'SSH Host Keys (ed25519 / RSA-2048)',
    recommendedNistReplacement: 'sntrup761x25519-sha512 / ML-KEM-768 Hybrid',
    nistStandard: 'FIPS 203 (ML-KEM)',
    priority: 'Medium',
    reasoning:
      'OpenSSH 9.0+ natively supports hybrid post-quantum key exchange out of the box. Enabling post-quantum key exchange in sshd_config requires minimal configuration changes.',
    progressPercent: 90,
    stage: 'Completed',
  },
];

export const MigrationAdvisor: React.FC = () => {
  const [migrations, setMigrations] = useState<MigrationItem[]>(defaultMigrations);
  const [selectedItem, setSelectedItem] = useState<MigrationItem>(defaultMigrations[0]);

  useEffect(() => {
    const fetchMigration = async () => {
      const res = await api.request<MigrationItem[]>('/api/migration');
      if (res.data && res.isLive) {
        setMigrations(res.data);
        setSelectedItem(res.data[0]);
      }
    };
    fetchMigration();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
          PQC Migration Advisor
        </h1>
        <p className="text-xs text-[#969DAB] mt-1">
          Targeted replacement pathways mapping legacy cryptographic implementations to NIST FIPS 203, 204, and 205 standards.
        </p>
      </div>

      {/* NIST Standards Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#181D28] border border-[#292F3B]">
          <div className="text-[11px] font-mono text-[#8290C9]">NIST FIPS 203</div>
          <div className="text-sm font-semibold text-[#E8EAF0] mt-1">ML-KEM (Module Lattice)</div>
          <p className="text-[11px] text-[#969DAB] mt-1">
            General key encapsulation mechanism (formerly CRYSTALS-Kyber) for TLS 1.3, VPNs, and secure messaging.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#181D28] border border-[#292F3B]">
          <div className="text-[11px] font-mono text-[#8290C9]">NIST FIPS 204</div>
          <div className="text-sm font-semibold text-[#E8EAF0] mt-1">ML-DSA (Digital Signatures)</div>
          <p className="text-[11px] text-[#969DAB] mt-1">
            General digital signature algorithm (formerly CRYSTALS-Dilithium) for identity, certificates, and auth.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#181D28] border border-[#292F3B]">
          <div className="text-[11px] font-mono text-[#8290C9]">NIST FIPS 205</div>
          <div className="text-sm font-semibold text-[#E8EAF0] mt-1">SLH-DSA (Stateless Hash)</div>
          <p className="text-[11px] text-[#969DAB] mt-1">
            Stateless hash-based alternative (formerly SPHINCS+) resistant to potential lattice cryptanalysis.
          </p>
        </div>
      </div>

      {/* Migration Pathways Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#E8EAF0]">
          Active Migration Recommendations &amp; Progress
        </h2>

        <div className="rounded-xl border border-[#292F3B] bg-[#181D28] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292F3B] bg-[#141823] text-[#969DAB] font-medium">
                <th className="px-5 py-3.5">Existing Algorithm</th>
                <th className="px-5 py-3.5">Recommended NIST Replacement</th>
                <th className="px-5 py-3.5">NIST Standard</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Current Stage</th>
                <th className="px-5 py-3.5">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292F3B]">
              {migrations.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`hover:bg-[#1E2433] transition-colors cursor-pointer ${
                    selectedItem.id === item.id ? 'bg-[#1D2536]' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 font-mono text-[#C55353]">{item.existingAlgorithm}</td>
                  <td className="px-5 py-3.5 font-mono text-[#4E9F76] font-medium">
                    {item.recommendedNistReplacement}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[#8290C9] text-[11px]">
                    {item.nistStandard}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        item.priority === 'Immediate'
                          ? 'bg-[#2A1E20] text-[#C55353] border border-[#48282B]'
                          : item.priority === 'High'
                          ? 'bg-[#2F281E] text-[#D49A3D] border border-[#483B25]'
                          : 'bg-[#1F2636] text-[#8290C9] border border-[#2B374D]'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#E8EAF0] font-mono text-[11px]">{item.stage}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#131720] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#4E65C6] h-full rounded-full transition-all"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#969DAB]">
                        {item.progressPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Item Detail Card */}
      {selectedItem && (
        <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#292F3B] pb-3">
            <span className="text-xs font-semibold text-[#E8EAF0]">
              Migration Rationale &amp; Technical Guidance: {selectedItem.recommendedNistReplacement}
            </span>
            <span className="text-[11px] font-mono text-[#8290C9]">
              {selectedItem.nistStandard}
            </span>
          </div>

          <p className="text-xs text-[#969DAB] leading-relaxed">
            {selectedItem.reasoning}
          </p>

          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-2">
            <div className="text-[11px] font-mono text-[#8499B8] uppercase">
              Recommended Implementation Steps
            </div>
            <ol className="list-decimal list-inside text-xs text-[#E8EAF0] space-y-1 leading-relaxed">
              <li>Audit all cryptographic callsites to verify buffer size support (PQC public keys and ciphertexts are larger than classical primitives).</li>
              <li>Deploy hybrid dual-mode key exchange in non-breaking configuration to establish backward compatibility.</li>
              <li>Benchmark latency across TLS handshake round-trips using Quantum Guard's Crypto Lab.</li>
              <li>Schedule full deprecation milestone aligned with CNSA 2.0 quantum transition timelines.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
