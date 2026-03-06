import { supabase } from "@/lib/supabaseClient";
import type { MicroReview } from "@/types/intelligence";

/**
 * Micro-review operations: CRUD + moderation
 */
export class MicroReviewService {
  private mapRow(row: any): MicroReview {
    return {
      id: row.id,
      user_id: row.user_id,
      film_id: row.film_id,
      content: row.content,
      credibility_score: row.credibility_score || 0,
      helpful_count: row.helpful_count || 0,
      unhelpful_count: row.unhelpful_count || 0,
      is_flagged: row.is_flagged || false,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user: row.user
        ? { email: row.user.email, username: row.user.username }
        : undefined,
    };
  }

  async getByFilm(filmId: number, limit = 20): Promise<MicroReview[]> {
    const { data, error } = await supabase
      .from("micro_reviews")
      .select("*")
      .eq("film_id", filmId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching micro reviews:", error);
      throw error;
    }
    return (data || []).map((r) => this.mapRow(r));
  }

  async createOrUpdate(
    userId: string,
    filmId: number,
    content: string,
  ): Promise<MicroReview> {
    if (content.length < 5 || content.length > 280) {
      throw new Error("Micro review must be 5-280 characters");
    }
    const { data, error } = await supabase
      .from("micro_reviews")
      .upsert(
        {
          user_id: userId,
          film_id: filmId,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,film_id" },
      )
      .select()
      .single();
    if (error) {
      console.error("Error saving micro review:", error);
      throw error;
    }
    return this.mapRow(data);
  }

  async flag(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from("micro_reviews")
      .update({ is_flagged: true })
      .eq("id", reviewId);
    if (error) {
      console.error("Error flagging micro review:", error);
      throw error;
    }
  }

  async moderate(
    reviewId: string,
    action: "approve" | "delete",
  ): Promise<void> {
    if (action === "approve") {
      const { error } = await supabase
        .from("micro_reviews")
        .update({ is_flagged: false })
        .eq("id", reviewId);
      if (error) {
        console.error("Error approving micro review:", error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from("micro_reviews")
        .delete()
        .eq("id", reviewId);
      if (error) {
        console.error("Error deleting micro review:", error);
        throw error;
      }
    }
  }

  async fetchFlagged(limit = 50): Promise<MicroReview[]> {
    const { data, error } = await supabase
      .from("micro_reviews")
      .select("*")
      .eq("is_flagged", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Error fetching flagged micro reviews:", error);
      throw error;
    }
    return (data || []).map((r) => this.mapRow(r));
  }

  // simplistic helpfulness tracking
  async markHelpful(reviewId: string, isHelpful: boolean): Promise<void> {
    const field = isHelpful ? "helpful_count" : "unhelpful_count";
    const { error } = await supabase
      .from("micro_reviews")
      .update({ [field]: 0 }) // TODO: Use RPC for atomic increment. Standard client doesn't support expressions.
      .eq("id", reviewId);
    if (error) {
      console.error("Error marking micro review helpful:", error);
      throw error;
    }
  }
}

export const microReviewService = new MicroReviewService();
