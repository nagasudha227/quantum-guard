export type PageId =
  | 'home'
  | 'inventory'
  | 'assessment'
  | 'migration'
  | 'lab'
  | 'benchmark'
  | 'reports'
  | 'settings';

export interface InventoryAsset {
  id: string;
  systemName: string;
  algorithm: string;
  keySize: string;
  purpose: 'Data in Transit' | 'Data at Rest' | 'Identity & Auth' | 'Code Signing' | 'Remote Access';
  discoveryStatus: 'Active' | 'Deprecated' | 'Under Review';
  quantumVulnerability: 'Vulnerable' | 'Quantum Safe' | 'Transitional';
  lastScanned: string;
}

export interface RiskItem {
  id: string;
  primitive: string;
  threatMechanism: string;
  quantumVulnerabilityClass: 'Shor Vulnerable' | 'Grover Vulnerable' | 'Quantum Resistant';
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  explanation: string;
  affectedSystems: number;
}

export interface MigrationItem {
  id: string;
  existingAlgorithm: string;
  recommendedNistReplacement: string;
  nistStandard: 'FIPS 203 (ML-KEM)' | 'FIPS 204 (ML-DSA)' | 'FIPS 205 (SLH-DSA)' | 'Stateful Hash (LMS)';
  priority: 'Immediate' | 'High' | 'Medium' | 'Low';
  reasoning: string;
  progressPercent: number;
  stage: 'Discovery' | 'Hybrid Pilot' | 'PKI Update' | 'Completed';
}

export interface CryptoLabRequest {
  category: 'conventional' | 'pqc' | 'hybrid';
  algorithm: string;
  operation: 'keygen' | 'encrypt' | 'decrypt' | 'sign' | 'verify';
  inputMessage: string;
}

export interface CryptoLabResponse {
  success: boolean;
  algorithm: string;
  category: 'conventional' | 'pqc' | 'hybrid';
  operation: string;
  publicKeyHex?: string;
  secretKeyHex?: string;
  outputHex?: string;
  signatureHex?: string;
  sharedSecretHex?: string;
  executionTimeUs: number;
  isBackendResult: boolean;
  message?: string;
}

export interface BenchmarkMetric {
  algorithm: string;
  standard: string;
  type: 'KEM' | 'Signature';
  publicKeyBytes: number;
  ciphertextOrSigBytes: number;
  keygenLatencyUs: number;
  operationLatencyUs: number;
  verificationLatencyUs: number;
  quantumSecurityBits: number;
}
