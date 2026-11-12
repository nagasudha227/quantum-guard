import React, { useState } from 'react';
import { RiskItem } from '../types';
import { AlertTriangle, ShieldAlert, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultRisks: RiskItem[] = [
  {
    id: 'r-1',
    primitive: 'RSA Key Exchange & Signatures (1024 / 2048 / 4096-bit)',
    threatMechanism: "Shor's Algorithm (Polynomial Time Factorization)",
    quantumVulnerabilityClass: 'Shor Vulnerable',
    riskLevel: 'Critical',
    explanation:
      'Shor’s algorithm reduces prime factorization complexity from sub-exponential to polynomial time O((log N)^3). All existing RSA keys across TLS and PKI are completely insecure against a cryptanalytically relevant quantum computer (CRQC).',
    affectedSystems: 4,
  },
  {
    id: 'r-2',
    primitive: 'Elliptic Curve Cryptography (ECDHE / ECDSA P-256 / Ed25519)',
    threatMechanism: "Shor's Algorithm (Discrete Logarithm Problem)",
    quantumVulnerabilityClass: 'Shor Vulnerable',
    riskLevel: 'Critical',
    explanation:
      'Elliptic curve discrete logarithm problem (ECDLP) is solved by Shor’s algorithm even faster than RSA due to smaller group sizes. All TLS 1.3 key exchanges using P-256 or X25519 are vulnerable to retroactive decryption (HNDL).',
    affectedSystems: 3,
  },
  {
    id: 'r-3',
    primitive: 'Symmetric Cipher AES-128',
    threatMechanism: "Grover's Algorithm (Quadratic Speedup)",
    quantumVulnerabilityClass: 'Grover Vulnerable',
    riskLevel: 'High',
    explanation:
      'Grover’s algorithm reduces brute-force search space from 2^128 to 2^64 operations. A 64-bit effective security margin is considered inadequate for enterprise long-term data security.',
    affectedSystems: 1,
  },
  {
    id: 'r-4',
    primitive: 'Symmetric Cipher AES-256 & SHA-384 / SHA-512',
    threatMechanism: "Grover's Algorithm (Mitigated by Key Length)",
    quantumVulnerabilityClass: 'Quantum Resistant',
    riskLevel: 'Low',
    explanation:
      'Grover’s reduction halves 256 bits to 128 bits of quantum security, which remains practically unbreakable for the foreseeable future under physical quantum thermodynamic limits.',
    affectedSystems: 2,
  },
];

export const RiskAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [shelfLifeX, setShelfLifeX] = useState<number>(10);
  const [migrationTimeM, setMigrationTimeM] = useState<number>(4);
  const [crqcTimeY, setCrqcTimeY] = useState<number>(8);

  const totalExposure = shelfLifeX + migrationTimeM;
  const isDeficit = totalExposure > crqcTimeY;
  const deficitYears = totalExposure - crqcTimeY;

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
          Quantum Risk Assessment
        </h1>
        <p className="text-xs text-[#969DAB] mt-1">
          Quantitative evaluation of cryptographic vulnerability horizons, Mosca theorem parameters, and Shor/Grover threats.
        </p>
      </div>

      {/* Mosca Theorem Horizon Card */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292F3B] pb-4">
          <div>
            <span className="text-[11px] font-mono font-medium text-[#8290C9] uppercase tracking-wider">
              Mosca's Theorem Timeline Model
            </span>
            <h2 className="text-base font-semibold text-[#E8EAF0] mt-0.5">
              Condition for Zero Exposure: X + M ≤ Y
            </h2>
          </div>
          <div className="px-3 py-1 rounded-md bg-[#131720] border border-[#292F3B] text-[11px] font-mono text-[#969DAB]">
            Status:{' '}
            <span className={isDeficit ? 'text-[#C55353] font-semibold' : 'text-[#4E9F76] font-semibold'}>
              {isDeficit ? `EXPOSURE DEFICIT (-${deficitYears} YRS)` : 'SECURE MARGIN'}
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#969DAB]">X: Data Shelf-Life</span>
              <span className="text-[#E8EAF0] font-mono font-semibold">{shelfLifeX} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={shelfLifeX}
              onChange={(e) => setShelfLifeX(Number(e.target.value))}
              className="w-full accent-[#8290C9] bg-[#292F3B] cursor-pointer"
            />
            <p className="text-[11px] text-[#8499B8] leading-normal">
              Required secrecy duration for corporate IP, financial, or sensitive user data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#969DAB]">M: Migration Duration</span>
              <span className="text-[#E8EAF0] font-mono font-semibold">{migrationTimeM} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={migrationTimeM}
              onChange={(e) => setMigrationTimeM(Number(e.target.value))}
              className="w-full accent-[#8290C9] bg-[#292F3B] cursor-pointer"
            />
            <p className="text-[11px] text-[#8499B8] leading-normal">
              Time needed to audit, test, and deploy NIST PQC standards across production infrastructure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#131720] border border-[#242A38] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#969DAB]">Y: Estimated CRQC Arrival</span>
              <span className="text-[#E8EAF0] font-mono font-semibold">{crqcTimeY} Years</span>
            </div>
            <input
              type="range"
              min="3"
              max="18"
              value={crqcTimeY}
              onChange={(e) => setCrqcTimeY(Number(e.target.value))}
              className="w-full accent-[#8290C9] bg-[#292F3B] cursor-pointer"
            />
            <p className="text-[11px] text-[#8499B8] leading-normal">
              Industry consensus horizon for a fault-tolerant quantum computer running Shor's algorithm.
            </p>
          </div>
        </div>

        {/* Mosca Result Banner */}
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            isDeficit
              ? 'bg-[#251A1E] border-[#442229] text-[#E8EAF0]'
              : 'bg-[#18261F] border-[#254232] text-[#E8EAF0]'
          }`}
        >
          <div className="flex items-center gap-3">
            {isDeficit ? (
              <AlertTriangle className="w-5 h-5 text-[#C55353] shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#4E9F76] shrink-0" />
            )}
            <div>
              <div className="font-semibold">
                {isDeficit
                  ? `Harvest Now, Decrypt Later (HNDL) Vulnerability: ${deficitYears} Year Deficit`
                  : `Migration Window Viable: ${Math.abs(deficitYears)} Year Buffer`}
              </div>
              <div className="text-[11px] text-[#969DAB] mt-0.5">
                {isDeficit
                  ? `Your data shelf life (${shelfLifeX} yrs) plus migration effort (${migrationTimeM} yrs) equals ${totalExposure} yrs, exceeding the quantum horizon (${crqcTimeY} yrs). Adversaries intercepting TLS today can store ciphertext and decrypt it before confidentiality expires.`
                  : `Total transition time (${totalExposure} yrs) finishes ahead of projected CRQC arrival (${crqcTimeY} yrs). Continue planned rollout.`}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/migration')}
            className="shrink-0 ml-4 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#1F2636] border border-[#2B374D] text-[#E8EAF0] hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Migration Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vulnerability Classifications Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#E8EAF0]">
          Quantum Threat Classifications by Primitive
        </h2>

        <div className="rounded-xl border border-[#292F3B] bg-[#181D28] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292F3B] bg-[#141823] text-[#969DAB] font-medium">
                <th className="px-5 py-3.5">Cryptographic Primitive</th>
                <th className="px-5 py-3.5">Threat Mechanism</th>
                <th className="px-5 py-3.5">Classification</th>
                <th className="px-5 py-3.5">Risk Level</th>
                <th className="px-5 py-3.5">Affected Systems</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292F3B]">
              {defaultRisks.map((item) => (
                <tr key={item.id} className="hover:bg-[#1E2433] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#E8EAF0]">{item.primitive}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#8499B8]">
                    {item.threatMechanism}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] text-[#8290C9]">
                      {item.quantumVulnerabilityClass}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        item.riskLevel === 'Critical'
                          ? 'bg-[#2A1E20] text-[#C55353] border border-[#48282B]'
                          : item.riskLevel === 'High'
                          ? 'bg-[#2F281E] text-[#D49A3D] border border-[#483B25]'
                          : 'bg-[#1F2C24] text-[#4E9F76] border border-[#274431]'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[#E8EAF0]">
                    {item.affectedSystems} hosts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
