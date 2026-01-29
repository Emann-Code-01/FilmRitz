import { supabase } from "@/lib/supabaseClient";

export interface Rating {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  reviewText: string;
  helpfulCount: number;
  notHelpfulCount: number;
  isSpoiler: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    username?: string;
  };
}

export interface MediaRatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number }; // 1-5 star counts
}

/** Map raw Supabase row (snake_case) to Review interface (camelCase) */
function mapReviewRow(row: any): Review {
  const user = row.user;
  return {
    id: row.id,
    userId: row.user_id,
    mediaId: row.media_id,
    mediaType: row.media_type,
    reviewText: row.review_text,
    helpfulCount: row.helpful_count ?? 0,
    notHelpfulCount: row.not_helpful_count ?? 0,
    isSpoiler: row.is_spoiler ?? false,
    isFlagged: row.is_flagged ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    user: user ? { email: user.email, username: user.username } : undefined,
  };
}

class RatingService {
  /**
   * Get or create a user's rating for a media item
   */
  async getUserRating(
    userId: string,
    mediaId: number,
    mediaType: "movie" | "tv",
  ): Promise<Rating | null> {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .eq("media_type", mediaType)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows
      console.error("Error fetching user rating:", error);
      throw error;
    }

    return data;
  }

  /**
   * Add or update a rating
   */
  async setRating(
    userId: string,
    mediaId: number,
    mediaType: "movie" | "tv",
    rating: number,
  ): Promise<Rating> {
    // Validate rating
    if (rating < 0 || rating > 5 || rating % 0.5 !== 0) {
      throw new Error("Rating must be between 0 and 5 in 0.5 increments");
    }

    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        {
          user_id: userId,
          media_id: mediaId,
          media_type: mediaType,
          rating,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,media_id,media_type",
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Error setting rating:", error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a rating
   */
  async deleteRating(
    userId: string,
    mediaId: number,
    mediaType: "movie" | "tv",
  ): Promise<void> {
    const { error } = await supabase
      .from("ratings")
      .delete()
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .eq("media_type", mediaType);

    if (error) {
      console.error("Error deleting rating:", error);
      throw error;
    }
  }

  /**
   * Get rating statistics for a media item
   */
  async getMediaRatingStats(
    mediaId: number,
    mediaType: "movie" | "tv",
  ): Promise<MediaRatingStats> {
    const { data, error } = await supabase.rpc("get_media_rating", {
      p_media_id: mediaId,
      p_media_type: mediaType,
    });

    if (error) {
      console.error("Error fetching media rating stats:", error);
      throw error;
    }

    // Get rating distribution
    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("rating")
      .eq("media_id", mediaId)
      .eq("media_type", mediaType);

    if (ratingsError) {
      console.error("Error fetching rating distribution:", ratingsError);
      throw ratingsError;
    }

    // Calculate distribution
    const distribution: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratings?.forEach((r) => {
      const rounded = Math.floor(r.rating);
      if (rounded >= 1 && rounded <= 5) {
        distribution[rounded]++;
      }
    });

    return {
      averageRating: data?.[0]?.average_rating || 0,
      totalRatings: data?.[0]?.total_ratings || 0,
      ratingDistribution: distribution,
    };
  }

  /**
   * Get reviews for a media item
   */
  async getMediaReviews(
    mediaId: number,
    mediaType: "movie" | "tv",
    sortBy: "recent" | "helpful" = "helpful",
    limit: number = 10,
  ): Promise<Review[]> {
    // Note: We do not embed auth.users (user_id) here because PostgREST cannot
    // join public.reviews to auth.users (different schema). Reviews still show
    // with a generic display name; for real emails you'd need a public profile table.
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("media_id", mediaId)
      .eq("media_type", mediaType)
      .eq("is_flagged", false)
      .limit(limit);

    if (sortBy === "helpful") {
      query = query.order("helpful_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }

    return (data || []).map(mapReviewRow);
  }

  /**
   * Add or update a review
   */
  async setReview(
    userId: string,
    mediaId: number,
    mediaType: "movie" | "tv",
    reviewText: string,
    isSpoiler: boolean = false,
  ): Promise<Review> {
    // Validate review text
    if (reviewText.length < 10 || reviewText.length > 500) {
      throw new Error("Review must be between 10 and 500 characters");
    }

    const { data, error } = await supabase
      .from("reviews")
      .upsert(
        {
          user_id: userId,
          media_id: mediaId,
          media_type: mediaType,
          review_text: reviewText,
          is_spoiler: isSpoiler,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,media_id,media_type",
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Error setting review:", error);
      throw error;
    }

    return mapReviewRow(data);
  }

  /**
   * Delete a review
   */
  async deleteReview(
    userId: string,
    mediaId: number,
    mediaType: "movie" | "tv",
  ): Promise<void> {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .eq("media_type", mediaType);

    if (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  /**
   * Mark review as helpful/not helpful
   */
  async markReviewHelpful(
    reviewId: string,
    userId: string,
    isHelpful: boolean,
  ): Promise<void> {
    const { error } = await supabase.from("review_helpfulness").upsert(
      {
        review_id: reviewId,
        user_id: userId,
        is_helpful: isHelpful,
      },
      {
        onConflict: "review_id,user_id",
      },
    );

    if (error) {
      console.error("Error marking review helpful:", error);
      throw error;
    }
  }

  /**
   * Get user's helpfulness vote for a review
   */
  async getUserHelpfulnessVote(
    reviewId: string,
    userId: string,
  ): Promise<boolean | null> {
    const { data, error } = await supabase
      .from("review_helpfulness")
      .select("is_helpful")
      .eq("review_id", reviewId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching helpfulness vote:", error);
      throw error;
    }

    return data?.is_helpful ?? null;
  }
}

export const ratingService = new RatingService();
