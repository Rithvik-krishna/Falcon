export interface FeatureFlags {
  featureAv1Codec: boolean;
  featureClipboardSync: boolean;
  featureFileTransfer: boolean;
  featureWakeOnLan: boolean;
  featureSessionRecording: boolean;
}

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: FeatureFlags = {
    featureAv1Codec: true,
    featureClipboardSync: true,
    featureFileTransfer: true,
    featureWakeOnLan: true,
    featureSessionRecording: false, // Default off for MVP
  };

  private constructor() {}

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  public getFlagsForUser(_userId: string): FeatureFlags {
    return { ...this.flags };
  }

  public updateFlags(newFlags: Partial<FeatureFlags>): FeatureFlags {
    this.flags = { ...this.flags, ...newFlags };
    return this.flags;
  }
}

export const featureFlagService = FeatureFlagService.getInstance();
