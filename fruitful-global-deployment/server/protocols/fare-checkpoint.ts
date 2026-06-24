// FAA.zone ScrollStack FARE Checkpoint Protocol
// VaultMesh Integration Layer for TreatySync Processing

export interface ScrollContext {
  sessionId: string;
  treatyHash: string;
  claimRootId: string;
  vaultMeshNode: string;
  timestamp: number;
  intakePhase: 'INIT' | 'VALIDATE' | 'PROCESS' | 'COMPLETE';
  pulseIndex: number;
  omniTraceDepth: number;
  securityPosture: 'STANDARD' | 'ELEVATED' | 'HOSTILE';
}

export interface FareCheckpoint {
  checkpointId: string;
  scrollContext: ScrollContext;
  validationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  truthWeightScore: number;
  autoSigilSignature?: string;
  echoSynthFidelity: number;
}

export interface IntakeResult {
  success: boolean;
  checkpointId: string;
  processedAt: string;
  nextPhase: ScrollContext['intakePhase'];
  metrics: {
    latencyMs: number;
    dataProcessedBytes: number;
    securityEventsCount: number;
  };
}

export function createScrollContext(partial: Partial<ScrollContext>): ScrollContext {
  return {
    sessionId: partial.sessionId || crypto.randomUUID(),
    treatyHash: partial.treatyHash || '',
    claimRootId: partial.claimRootId || '',
    vaultMeshNode: partial.vaultMeshNode || 'primary',
    timestamp: partial.timestamp || Date.now(),
    intakePhase: partial.intakePhase || 'INIT',
    pulseIndex: partial.pulseIndex || 0,
    omniTraceDepth: partial.omniTraceDepth || 1,
    securityPosture: partial.securityPosture || 'STANDARD',
  };
}

export function validateFareCheckpoint(checkpoint: FareCheckpoint): boolean {
  return (
    checkpoint.truthWeightScore >= 0.95 &&
    checkpoint.echoSynthFidelity >= 0.90 &&
    checkpoint.validationStatus === 'VERIFIED'
  );
}
