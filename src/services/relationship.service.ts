import { CollaborationEdgeRepository } from "../repositories/collaborationEdge.repository";

export class RelationshipService {
  /**
   * Get top frequent collaborators for a person
   */
  static async getFrequentCollaborators(personId: number, _limit: number = 8) {
    return CollaborationEdgeRepository.getCollaborators(personId);
  }

  /**
   * Director Style Affinity
   * Placeholder for style overlap logic between directors
   */
  static async getDirectorStyleAffinity(_directorId: number) {
    // In a real app, this would compare thematic/visual fingerprints of their films
    return [];
  }
}
