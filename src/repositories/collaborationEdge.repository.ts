import prisma from "../lib/prisma";
import { CollaborationEdgeDTO } from "../types/film.types";

export class CollaborationEdgeRepository {
  static async upsert(data: CollaborationEdgeDTO) {
    const { person_a_id, person_b_id } = data;
    // Normalize IDs to ensure a < b
    const [id1, id2] = [person_a_id, person_b_id].sort((a, b) => a - b);

    return prisma.collaborationEdge.upsert({
      where: {
        person_a_id_person_b_id: {
          person_a_id: id1,
          person_b_id: id2,
        },
      },
      update: {
        collaboration_weight: data.collaboration_weight,
        updated_at: new Date(),
      },
      create: {
        person_a_id: id1,
        person_b_id: id2,
        collaboration_weight: data.collaboration_weight ?? 1.0,
      },
    });
  }

  static async getCollaborators(personId: number) {
    return prisma.collaborationEdge.findMany({
      where: {
        OR: [{ person_a_id: personId }, { person_b_id: personId }],
      },
      orderBy: {
        collaboration_weight: "desc",
      },
    });
  }
}
