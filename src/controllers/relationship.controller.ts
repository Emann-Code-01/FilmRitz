import { RelationshipService } from "../services/relationship.service";

export class RelationshipController {
  /**
   * GET /api/films/:id/collaborators
   */
  static async getFilmCollaborators(_filmId: number) {
    // In a real app, logic to fetch film credits and then get collaboration weights
    return [];
  }

  /**
   * GET /api/people/:id/network
   */
  static async getPersonNetwork(personId: number) {
    const collaborations =
      await RelationshipService.getFrequentCollaborators(personId);

    // Transform into a graph-friendly format (nodes, edges)
    const nodes = [{ id: personId, label: "Main Person", type: "central" }];

    const edges = collaborations.map((c: any) => {
      const otherId =
        c.person_a_id === personId ? c.person_b_id : c.person_a_id;
      nodes.push({
        id: otherId,
        label: `Collaborator ${otherId}`,
        type: "peer",
      });

      return {
        from: personId,
        to: otherId,
        weight: c.collaboration_weight,
        label: `${c.collaboration_weight} collabs`,
      };
    });

    return { nodes, edges };
  }
}
