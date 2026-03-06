import { supabase } from '@/lib/supabaseClient';

export interface FeatureFlagRow {
  name: string;
  enabled: boolean;
  percentage: number | null;
  allowed_users: string[] | null;
  force_off: boolean;
}

class FeatureFlagService {
  async fetchAll(): Promise<FeatureFlagRow[]> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*');
    if (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
    return data || [];
  }

  async upsert(flag: Partial<FeatureFlagRow> & { name: string }) {
    const { data, error } = await supabase
      .from('feature_flags')
      .upsert(flag, { onConflict: 'name' });
    if (error) {
      console.error('Error upserting feature flag:', error);
      throw error;
    }
    return data;
  }
}

export const featureFlagService = new FeatureFlagService();
