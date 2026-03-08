import { supabase } from "../lib/supabaseClient";

export class WatchlistRepository {
  static async updateUsageFrequency(watchlistId: string) {
    const { data, error } = await supabase
      .from("watchlists")
      .update({
        usage_frequency: { increment: 1 }, // Note: check link below for Supabase increment
        last_used_at: new Date().toISOString(),
      })
      .eq("id", watchlistId)
      .select()
      .single();

    // Note: Standard Supabase JS client doesn't support { increment: 1 } directly in update.
    // Usually you'd use a RPC or fetch-then-update.
    // For many users, fetching then updating is fine if per-request, but we can try to use a cleaner way.
    // Let's use the standard fetch-then-update for simplicity in this demo.
    if (error) throw error;
    return data;
  }

  // Refined updateUsageFrequency helper
  static async incrementUsage(watchlistId: string) {
    // Standard Supabase way without RPC
    const { data: current } = await supabase
      .from("watchlists")
      .select("usage_frequency")
      .eq("id", watchlistId)
      .single();

    const newFreq = (current?.usage_frequency || 0) + 1;

    return supabase
      .from("watchlists")
      .update({
        usage_frequency: newFreq,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", watchlistId);
  }

  static async getWatchlistsByContext(userId: string, _context: any) {
    const { data, error } = await supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", userId)
      .order("usage_frequency", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async autoTagWatchlist(watchlistId: string, tags: string[]) {
    // For array push in Supabase, we usually fetch first
    const { data: current } = await supabase
      .from("watchlists")
      .select("auto_tags")
      .eq("id", watchlistId)
      .single();

    const newTags = [...new Set([...(current?.auto_tags || []), ...tags])];

    return supabase
      .from("watchlists")
      .update({ auto_tags: newTags })
      .eq("id", watchlistId);
  }

  static async getWatchlistWithContext(watchlistId: string) {
    const { data, error } = await supabase
      .from("watchlists")
      .select(
        `
        *,
        items:watchlist_items(*)
      `,
      )
      .eq("id", watchlistId)
      .single();

    if (error) throw error;
    return data;
  }
}
