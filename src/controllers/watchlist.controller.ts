import { WatchlistRepository } from "../repositories/watchlist.repository";
import { WatchlistWithContextResponse } from "../types/api.types";

export class WatchlistController {
  /**
   * GET /api/watchlists/context
   */
  static async getContextualWatchlists(
    userId: string,
    context: any,
  ): Promise<WatchlistWithContextResponse[]> {
    const watchlists = await WatchlistRepository.getWatchlistsByContext(
      userId,
      context,
    );

    return (watchlists as any[]).map((w) => ({
      id: w.id,
      name: w.name,
      items: [], // Would fetch items if needed
      creation_context: w.creation_context,
      usage_frequency: w.usage_frequency,
      auto_tags: w.auto_tags,
      relevance_score: 85, // Mock relevance score for demo
    }));
  }

  /**
   * POST /api/watchlists/:id/use
   */
  static async useWatchlist(watchlistId: string) {
    await WatchlistRepository.updateUsageFrequency(watchlistId);
    return { success: true };
  }
}
