import React, { useState, useEffect } from 'react';
import { InventoryAsset } from '../types';
import { Search, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';

const demoAssets: InventoryAsset[] = [
  {
    id: 'ast-01',
    systemName: 'api-gateway.corp.prod',
    algorithm: 'RSA-2048',
    keySize: '2048-bit',
    purpose: 'Data in Transit',
    discoveryStatus: 'Active',
    quantumVulnerability: 'Vulnerable',
    lastScanned: '2026-11-12 08:30:15',
  },
  {
    id: 'ast-02',
    systemName: 'customer-db-primary.rds',
    algorithm: 'ECDHE-ECDSA-P256',
    keySize: '256-bit',
    purpose: 'Data in Transit',
    discoveryStatus: 'Active',
    quantumVulnerability: 'Vulnerable',
    lastScanned: '2026-11-12 08:30:22',
  },
  {
    id: 'ast-03',
    systemName: 'sso-saml-idp.internal',
    algorithm: 'RSA-4096',
    keySize: '4096-bit',
    purpose: 'Identity & Auth',
    discoveryStatus: 'Active',
    quantumVulnerability: 'Vulnerable',
    lastScanned: '2026-11-12 08:31:05',
  },
  {
    id: 'ast-04',
    systemName: 'wireguard-mesh-edge01',
    algorithm: 'X25519 + ML-KEM-768',
    keySize: 'Hybrid-768',
    purpose: 'Remote Access',
    discoveryStatus: 'Active',
    quantumVulnerability: 'Quantum Safe',
    lastScanned: '2026-11-12 08:31:40',
  },
  {
    id: 'ast-05',
    systemName: 'code-signer-release-west',
    algorithm: 'ECDSA-secp384r1',
    keySize: '384-bit',
    purpose: 'Code Signing',
    discoveryStatus: 'Under Review',
    quantumVulnerability: 'Vulnerable',
    lastScanned: '2026-11-11 17:45:00',
  },
  {
    id: 'ast-06',
    systemName: 'vault-encrypted-s3-buckets',
    algorithm: 'AES-256-GCM',
    keySize: '256-bit',
    purpose: 'Data at Rest',
    discoveryStatus: 'Active',
    quantumVulnerability: 'Quantum Safe',
    lastScanned: '2026-11-12 07:15:30',
  },
  {
    id: 'ast-07',
    systemName: 'legacy-bastion-ssh-01',
    algorithm: 'RSA-1024',
    keySize: '1024-bit',
    purpose: 'Remote Access',
    discoveryStatus: 'Deprecated',
    quantumVulnerability: 'Vulnerable',
    lastScanned: '2026-11-10 12:00:12',
  },
  {
    id: 'ast-08',
    systemName: 'tls-terminator-canary',
    algorithm: 'ML-KEM-1024',
    keySize: '1024-bit',
    purpose: 'Data in Transit',
    discoveryStatus: 'Under Review',
    quantumVulnerability: 'Quantum Safe',
    lastScanned: '2026-11-12 09:10:00',
  },
];

export const Inventory: React.FC = () => {
  const [assets, setAssets] = useState<InventoryAsset[]>(demoAssets);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Attempt fetch from FastAPI backend
    const loadInventory = async () => {
      const res = await api.request<InventoryAsset[]>('/api/inventory');
      if (res.data && res.isLive) {
        setAssets(res.data);
        setIsLiveBackend(true);
      } else {
        setIsLiveBackend(false);
      }
    };
    loadInventory();
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    const res = await api.request<InventoryAsset[]>('/api/inventory/scan', { method: 'POST' });
    if (res.data && res.isLive) {
      setAssets(res.data);
      setIsLiveBackend(true);
    }
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.algorithm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurpose = purposeFilter === 'ALL' || asset.purpose === purposeFilter;
    const matchesStatus = statusFilter === 'ALL' || asset.discoveryStatus === statusFilter;
    return matchesSearch && matchesPurpose && matchesStatus;
  });

  const vulnerableCount = assets.filter((a) => a.quantumVulnerability === 'Vulnerable').length;
  const safeCount = assets.filter((a) => a.quantumVulnerability === 'Quantum Safe').length;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EAF0]">
            Cryptographic Inventory
          </h1>
          <p className="text-xs text-[#969DAB] mt-1">
            Enterprise inventory of detected algorithms, key specifications, and cryptographic usages.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#181D28] hover:bg-[#202737] border border-[#292F3B] text-[#E8EAF0] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8290C9] ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Network...' : 'Rescan Inventory'}</span>
        </button>
      </div>

      {/* Demo Data Notice */}
      {!isLiveBackend && (
        <div className="px-4 py-3 rounded-lg bg-[#181D28] border border-[#292F3B] flex items-center justify-between text-xs text-[#969DAB]">
          <div className="flex items-center gap-2.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#29344A] text-[#8290C9]">
              DEMO DATA
            </span>
            <span>Displaying sample enterprise inventory. Connect FastAPI backend at <code className="text-[#E8EAF0]">http://localhost:8000</code> to populate live telemetry.</span>
          </div>
          <span className="font-mono text-[11px] text-[#8499B8]">
            {assets.length} Assets Tracked
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#181D28] border border-[#292F3B]">
          <div className="text-xs text-[#969DAB]">Total Cataloged Systems</div>
          <div className="text-2xl font-bold text-[#E8EAF0] mt-1.5">{assets.length}</div>
          <div className="text-[11px] text-[#8499B8] mt-1 font-mono">100% telemetry coverage</div>
        </div>

        <div className="p-5 rounded-xl bg-[#181D28] border border-[#292F3B]">
          <div className="text-xs text-[#C55353] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Quantum Vulnerable (Shor's)
          </div>
          <div className="text-2xl font-bold text-[#E8EAF0] mt-1.5">{vulnerableCount}</div>
          <div className="text-[11px] text-[#969DAB] mt-1">Requires transition to NIST PQC</div>
        </div>

        <div className="p-5 rounded-xl bg-[#181D28] border border-[#292F3B]">
          <div className="text-xs text-[#4E9F76] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Quantum Resilient
          </div>
          <div className="text-2xl font-bold text-[#E8EAF0] mt-1.5">{safeCount}</div>
          <div className="text-[11px] text-[#969DAB] mt-1">NIST ML-KEM / Hybrid / AES-256</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8499B8]" />
          <input
            type="text"
            placeholder="Search by system name or cipher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#181D28] border border-[#292F3B] rounded-lg text-xs text-[#E8EAF0] placeholder-[#8499B8] focus:outline-none focus:border-[#8290C9]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#181D28] border border-[#292F3B] rounded-lg text-xs text-[#969DAB] focus:outline-none focus:border-[#8290C9]"
          >
            <option value="ALL">All Purposes</option>
            <option value="Data in Transit">Data in Transit</option>
            <option value="Data at Rest">Data at Rest</option>
            <option value="Identity & Auth">Identity & Auth</option>
            <option value="Code Signing">Code Signing</option>
            <option value="Remote Access">Remote Access</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#181D28] border border-[#292F3B] rounded-lg text-xs text-[#969DAB] focus:outline-none focus:border-[#8290C9]"
          >
            <option value="ALL">All Discovery Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Deprecated">Deprecated</option>
          </select>
        </div>
      </div>

      {/* Enterprise Table */}
      <div className="rounded-xl border border-[#292F3B] bg-[#181D28] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292F3B] bg-[#141823] text-[#969DAB] font-medium">
                <th className="px-5 py-3.5">System Name</th>
                <th className="px-5 py-3.5">Algorithm</th>
                <th className="px-5 py-3.5">Key Size</th>
                <th className="px-5 py-3.5">Cryptographic Purpose</th>
                <th className="px-5 py-3.5">Discovery Status</th>
                <th className="px-5 py-3.5">Quantum Vulnerability</th>
                <th className="px-5 py-3.5 text-right">Last Scanned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292F3B]">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-[#1E2433] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[#E8EAF0]">{asset.systemName}</td>
                  <td className="px-5 py-3.5 font-mono text-[#8290C9]">{asset.algorithm}</td>
                  <td className="px-5 py-3.5 text-[#969DAB] font-mono">{asset.keySize}</td>
                  <td className="px-5 py-3.5 text-[#E8EAF0]">{asset.purpose}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono ${
                        asset.discoveryStatus === 'Active'
                          ? 'bg-[#1F2C24] text-[#4E9F76] border border-[#274431]'
                          : asset.discoveryStatus === 'Under Review'
                          ? 'bg-[#2F281E] text-[#D49A3D] border border-[#483B25]'
                          : 'bg-[#2A1E20] text-[#C55353] border border-[#48282B]'
                      }`}
                    >
                      {asset.discoveryStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {asset.quantumVulnerability === 'Vulnerable' ? (
                      <span className="inline-flex items-center gap-1.5 text-[#C55353] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C55353]" />
                        Vulnerable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#4E9F76] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4E9F76]" />
                        Quantum Safe
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-[11px] text-[#8499B8]">
                    {asset.lastScanned}
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[#8499B8]">
                    No cryptographic assets match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

