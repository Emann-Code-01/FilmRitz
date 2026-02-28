import { CollaborationEdgeRepository } from "../repositories/collaborationEdge.repository";

export class CollaborationGraph {
  /**
   * Process film credits to update collaboration weights
   * This is a batch process logic
   */
  static async processCredits(
    _filmId: number,
    cast: { id: number; name: string }[],
    crew: { id: number; name: string; job: string }[],
  ) {
    // Focus on Director-Actor and Actor-Actor relationships
    const director = crew.find((c) => c.job === "Director");
    if (!director) return;

    // Director - Cast relationships
    for (const actor of cast.slice(0, 5)) {
      // Top 5 actors
      await CollaborationEdgeRepository.upsert({
        person_a_id: director.id,
        person_b_id: actor.id,
        collaboration_weight: 1.0, // Increment/Update logic would be more complex in prod
      });
    }

    // Actor - Actor relationships
    for (let i = 0; i < cast.slice(0, 5).length; i++) {
      for (let j = i + 1; j < cast.slice(0, 5).length; j++) {
        await CollaborationEdgeRepository.upsert({
          person_a_id: cast[i].id,
          person_b_id: cast[j].id,
          collaboration_weight: 0.5,
        });
      }
    }
  }
}
