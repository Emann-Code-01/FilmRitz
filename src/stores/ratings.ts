import { defineStore } from "pinia";
import {
  ratingService,
  type Review,
  type MediaRatingStats,
} from "@/services/ratingService";

export const useRatingsStore = defineStore("ratings", {
  state: () => ({
    userRatings: new Map<string, number>(), // key: `${mediaId}-${mediaType}`
    mediaStats: new Map<string, MediaRatingStats>(),
    reviews: new Map<string, Review[]>(),
    userVotes: new Map<string, boolean>(), // key: reviewId
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserRating(
      userId: string,
      mediaId: number,
      mediaType: "movie" | "tv",
    ) {
      const key = `${mediaId}-${mediaType}`;
      try {
        const rating = await ratingService.getUserRating(
          userId,
          mediaId,
          mediaType,
        );
        if (rating) {
          this.userRatings.set(key, rating.rating);
        }
        return rating;
      } catch (err: any) {
        console.error("Failed to fetch user rating:", err);
        return null;
      }
    },

    async setRating(
      userId: string,
      mediaId: number,
      mediaType: "movie" | "tv",
      rating: number,
    ) {
      const key = `${mediaId}-${mediaType}`;
      try {
        await ratingService.setRating(userId, mediaId, mediaType, rating);
        this.userRatings.set(key, rating);

        // Refresh stats
        await this.fetchMediaStats(mediaId, mediaType);
      } catch (err: any) {
        console.error("Failed to set rating:", err);
        this.error = err.message || "Failed to submit rating";
        throw err;
      }
    },

    async fetchMediaStats(mediaId: number, mediaType: "movie" | "tv") {
      const key = `${mediaId}-${mediaType}`;
      try {
        const stats = await ratingService.getMediaRatingStats(
          mediaId,
          mediaType,
        );
        this.mediaStats.set(key, stats);
        return stats;
      } catch (err: any) {
        console.error("Failed to fetch media stats:", err);
        return null;
      }
    },

    async fetchReviews(
      mediaId: number,
      mediaType: "movie" | "tv",
      sortBy: "recent" | "helpful" = "helpful",
    ) {
      const key = `${mediaId}-${mediaType}`;
      this.loading = true;
      try {
        const reviews = await ratingService.getMediaReviews(
          mediaId,
          mediaType,
          sortBy,
        );
        this.reviews.set(key, reviews);
        return reviews;
      } catch (err: any) {
        console.error("Failed to fetch reviews:", err);
        this.error = "Failed to load reviews";
        return [];
      } finally {
        this.loading = false;
      }
    },

    async addReview(
      userId: string,
      mediaId: number,
      mediaType: "movie" | "tv",
      reviewText: string,
      isSpoiler: boolean,
    ) {
      try {
        await ratingService.setReview(
          userId,
          mediaId,
          mediaType,
          reviewText,
          isSpoiler,
        );
        // Refresh reviews list
        await this.fetchReviews(mediaId, mediaType);
      } catch (err: any) {
        console.error("Failed to add review:", err);
        throw err;
      }
    },

    async deleteReview(
      userId: string,
      mediaId: number,
      mediaType: "movie" | "tv",
    ) {
      try {
        await ratingService.deleteReview(userId, mediaId, mediaType);
        await this.fetchReviews(mediaId, mediaType);
      } catch (err: any) {
        console.error("Failed to delete review:", err);
        throw err;
      }
    },

    async markReviewHelpful(
      reviewId: string,
      userId: string,
      isHelpful: boolean,
    ) {
      try {
        await ratingService.markReviewHelpful(reviewId, userId, isHelpful);
        this.userVotes.set(reviewId, isHelpful);
      } catch (err: any) {
        console.error("Failed to mark review helpful:", err);
      }
    },

    // Getters helpers
    getUserRatingValue(mediaId: number, mediaType: "movie" | "tv") {
      return this.userRatings.get(`${mediaId}-${mediaType}`) || 0;
    },

    getMediaStatsValue(mediaId: number, mediaType: "movie" | "tv") {
      return (
        this.mediaStats.get(`${mediaId}-${mediaType}`) || {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        }
      );
    },

    getReviewsValue(mediaId: number, mediaType: "movie" | "tv") {
      return this.reviews.get(`${mediaId}-${mediaType}`) || [];
    },
  },
});
