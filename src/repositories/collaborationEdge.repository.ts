import { supabase } from "../lib/supabaseClient";
import { CollaborationEdgeDTO } from "../types/film.types";

export class CollaborationEdgeRepository {
  static async upsert(data: CollaborationEdgeDTO) {
    const { person_a_id, person_b_id } = data;
    // Normalize IDs to ensure a < b
    const [id1, id2] = [person_a_id, person_b_id].sort((a, b) => a - b);

    const { data: result, error } = await supabase
      .from("collaboration_edges")
      .upsert(
        {
          person_a_id: id1,
          person_b_id: id2,
          collaboration_weight: data.collaboration_weight ?? 1.0,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "person_a_id,person_b_id",
        },
      )
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getCollaborators(personId: number) {
    const { data, error } = await supabase
      .from("collaboration_edges")
      .select("*")
      .or(`person_a_id.eq.${personId},person_b_id.eq.${personId}`)
      .order("collaboration_weight", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
