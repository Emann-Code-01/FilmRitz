import prisma from "../lib/prisma";

export class WatchlistRepository {
  static async updateUsageFrequency(watchlistId: string) {
    return prisma.watchlist.update({
      where: { id: watchlistId },
      data: {
        usage_frequency: { increment: 1 },
        last_used_at: new Date(),
      },
    });
  }

  static async getWatchlistsByContext(userId: string, _context: any) {
    // Basic context matching: for now, we look for watchlists that have similar creation_context
    // In a real scenario, this might involve JSON querying or vector similarity
    return prisma.watchlist.findMany({
      where: {
        user_id: userId,
        // Simple filter placeholder
      },
      orderBy: {
        usage_frequency: "desc",
      },
    });
  }

  static async autoTagWatchlist(watchlistId: string, tags: string[]) {
    return prisma.watchlist.update({
      where: { id: watchlistId },
      data: {
        auto_tags: {
          push: tags,
        },
      },
    });
  }

  static async getWatchlistWithContext(watchlistId: string) {
    return prisma.watchlist.findUnique({
      where: { id: watchlistId },
      include: {
        items: true,
      },
    });
  }
}
