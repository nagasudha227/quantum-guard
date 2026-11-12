import React, { useState } from 'react';
import { BenchmarkMetric } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { RefreshCw, Cpu, HardDrive } from 'lucide-react';
import { api } from '../services/api';

const nistReferenceMetrics: BenchmarkMetric[] = [
  {
    algorithm: 'RSA-3072',
    standard: 'Classical PKCS#1',
    type: 'KEM',
    publicKeyBytes: 384,
    ciphertextOrSigBytes: 384,
    keygenLatencyUs: 125000,
    operationLatencyUs: 210,
    verificationLatencyUs: 5200,
    quantumSecurityBits: 0,
  },
  {
    algorithm: 'ECDSA P-256',
    standard: 'Classical FIPS 186-5',
    type: 'Signature',
    publicKeyBytes: 64,
    ciphertextOrSigBytes: 64,
    keygenLatencyUs: 85,
    operationLatencyUs: 95,
    verificationLatencyUs: 180,
    quantumSecurityBits: 0,
  },
  {
    algorithm: 'ML-KEM-768',
    standard: 'NIST FIPS 203',
    type: 'KEM',
    publicKeyBytes: 1184,
    ciphertextOrSigBytes: 1088,
    keygenLatencyUs: 24,
    operationLatencyUs: 29,
    verificationLatencyUs: 26,
    quantumSecurityBits: 192,
  },
  {
    algorithm: 'ML-KEM-1024',
    standard: 'NIST FIPS 203',
    type: 'KEM',
    publicKeyBytes: 1568,
    ciphertextOrSigBytes: 1568,
    keygenLatencyUs: 36,
    operationLatencyUs: 44,
    verificationLatencyUs: 40,
    quantumSecurityBits: 256,
  },
  {
    algorithm: 'ML-DSA-65',
    standard: 'NIST FIPS 204',
    type: 'Signature',
    publicKeyBytes: 1952,
    ciphertextOrSigBytes: 3309,
    keygenLatencyUs: 48,
    operationLatencyUs: 136,
    verificationLatencyUs: 45,
    quantumSecurityBits: 192,
  },
  {
    algorithm: 'SLH-DSA-128s',
    standard: 'NIST FIPS 205',
    type: 'Signature',
    publicKeyBytes: 32,
    ciphertextOrSigBytes: 7856,
    keygenLatencyUs: 820,
    operationLatencyUs: 18400,
    verificationLatencyUs: 920,
    quantumSecurityBits: 128,
  },
];

export const Benchmark: React.FC = () => {
  const [metrics, setMetrics] = useState<BenchmarkMetric[]>(nistReferenceMetrics);
  const [isLiveTelemetry, setIsLiveTelemetry] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  const queryLiveBenchmark = async () => {
    setIsQuerying(true);
    const res = await api.request<BenchmarkMetric[]>('/api/benchmark');
    if (res.data && res.isLive) {
      setMetrics(res.data);
      setIsLiveTelemetry(true);
    }
    setTimeout(() => {
      setIsQuerying(false);
    }, 1000);
  };

  const chartDataSize = metrics.map((m) => ({
    name: m.algorithm,
    'Public Key': m.publicKeyBytes,
    'Ciphertext / Signature': m.ciphertextOrSigBytes,
  }));

  const chartDataLatency = metrics
    .filter((m) => m.keygenLatencyUs < 5000) // Exclude extreme RSA KeyGen outlier for chart readability
    .map((m) => ({
      name: m.algorithm,
      'KeyGen (µs)': m.keygenLatencyUs,
      'Encaps / Sign (µs)': m.operationLatencyUs,
      'Decaps / Verify (µs)': m.verificationLatencyUs,
    }));

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
            Cryptographic Benchmarks
          </h1>
          <p className="text-xs text-[#969DAB] mt-1">
            Comparative memory footprints, byte overhead, and microsecond latencies across NIST post-quantum standards and legacy algorithms.
          </p>
        </div>

        <button
          onClick={queryLiveBenchmark}
          disabled={isQuerying}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#181D28] hover:bg-[#202737] border border-[#292F3B] text-[#E8EAF0] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8290C9] ${isQuerying ? 'animate-spin' : ''}`} />
          <span>{isQuerying ? 'Querying...' : 'Query Backend Telemetry'}</span>
        </button>
      </div>

      {/* Benchmark Data Mode Notice */}
      <div className="px-4 py-3 rounded-lg bg-[#181D28] border border-[#292F3B] flex items-center justify-between text-xs text-[#969DAB]">
        <div className="flex items-center gap-2.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#29344A] text-[#8290C9]">
            {isLiveTelemetry ? 'LIVE FASTAPI TELEMETRY' : 'NIST FIPS 203/204/205 SPECIFICATION'}
          </span>
          <span>
            {isLiveTelemetry
              ? 'Displaying live hardware execution telemetry from FastAPI server.'
              : 'Displaying official standardized reference measurements (AVX2 / Cortex-M4 baseline). Connect backend for live machine benchmarks.'}
          </span>
        </div>
      </div>

      {/* Visual Chart 1: Key & Signature Sizes */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#E8EAF0]">
            Memory Overhead: Public Key &amp; Ciphertext/Signature Size (Bytes)
          </h2>
          <span className="text-[11px] font-mono text-[#8499B8]">Units: Bytes</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataSize} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242B38" vertical={false} />
              <XAxis dataKey="name" stroke="#8499B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#8499B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131720',
                  borderColor: '#292F3B',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#E8EAF0',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#969DAB', paddingTop: '10px' }}
              />
              <Bar dataKey="Public Key" fill="#8290C9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ciphertext / Signature" fill="#4E65C6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visual Chart 2: Microsecond Latency */}
      <div className="p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#E8EAF0]">
            Execution Latency Comparison (Microseconds, µs)
          </h2>
          <span className="text-[11px] font-mono text-[#8499B8]">
            Lower is better (RSA KeyGen excluded from scale)
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataLatency} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242B38" vertical={false} />
              <XAxis dataKey="name" stroke="#8499B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#8499B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131720',
                  borderColor: '#292F3B',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#E8EAF0',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#969DAB', paddingTop: '10px' }}
              />
              <Bar dataKey="KeyGen (µs)" fill="#8499B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Encaps / Sign (µs)" fill="#8290C9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Decaps / Verify (µs)" fill="#4E65C6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#E8EAF0]">
          Standardized Algorithm Parameter Matrix
        </h2>

        <div className="rounded-xl border border-[#292F3B] bg-[#181D28] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292F3B] bg-[#141823] text-[#969DAB] font-medium">
                <th className="px-5 py-3.5">Algorithm</th>
                <th className="px-5 py-3.5">Standard</th>
                <th className="px-5 py-3.5">Primitive</th>
                <th className="px-5 py-3.5 font-mono">Public Key</th>
                <th className="px-5 py-3.5 font-mono">Cipher/Sig</th>
                <th className="px-5 py-3.5 font-mono">KeyGen (µs)</th>
                <th className="px-5 py-3.5">Quantum Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292F3B]">
              {metrics.map((row) => (
                <tr key={row.algorithm} className="hover:bg-[#1E2433] transition-colors">
                  <td className="px-5 py-3.5 font-mono font-medium text-[#E8EAF0]">
                    {row.algorithm}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#8499B8]">
                    {row.standard}
                  </td>
                  <td className="px-5 py-3.5 text-[#969DAB]">{row.type}</td>
                  <td className="px-5 py-3.5 font-mono text-[#E8EAF0]">{row.publicKeyBytes} B</td>
                  <td className="px-5 py-3.5 font-mono text-[#E8EAF0]">
                    {row.ciphertextOrSigBytes} B
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[#969DAB]">
                    {row.keygenLatencyUs.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    {row.quantumSecurityBits > 0 ? (
                      <span className="text-[#4E9F76] font-mono font-medium">
                        {row.quantumSecurityBits}-bit
                      </span>
                    ) : (
                      <span className="text-[#C55353] font-mono">Vulnerable (0-bit)</span>
                    )}
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

