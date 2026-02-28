import prisma from "../lib/prisma";
import { UserEventDTO } from "../types/film.types";

export class UserEventRepository {
  static async create(data: UserEventDTO) {
    return prisma.userEvent.create({
      data: {
        user_id: data.user_id,
        film_id: data.film_id,
        event_type: data.event_type,
        watch_duration: data.watch_duration,
        timestamp: data.timestamp ? new Date(data.timestamp) : undefined,
      },
    });
  }

  static async getUserEvents(userId: string) {
    return prisma.userEvent.findMany({
      where: { user_id: userId },
      orderBy: { timestamp: "desc" },
    });
  }

  static async getCompletionRate(userId: string) {
    const total = await prisma.userEvent.count({
      where: { user_id: userId, event_type: { in: ["view", "finish"] } },
    });
    if (total === 0) return 0;

    const finished = await prisma.userEvent.count({
      where: { user_id: userId, event_type: "finish" },
    });

    return (finished / total) * 100;
  }

  static async getAvgWatchTime(userId: string) {
    const aggregate = await prisma.userEvent.aggregate({
      where: { user_id: userId, event_type: "finish" },
      _avg: {
        watch_duration: true,
      },
    });
    return aggregate._avg.watch_duration || 0;
  }
}
