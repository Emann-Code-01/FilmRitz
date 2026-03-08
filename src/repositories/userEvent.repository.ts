import { supabase } from "../lib/supabaseClient";
import { UserEventDTO } from "../types/film.types";

export class UserEventRepository {
  static async create(data: UserEventDTO) {
    const { data: result, error } = await supabase
      .from("user_events")
      .insert({
        user_id: data.user_id,
        film_id: data.film_id,
        event_type: data.event_type,
        watch_duration: data.watch_duration,
        timestamp: data.timestamp
          ? new Date(data.timestamp).toISOString()
          : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getUserEvents(userId: string) {
    const { data, error } = await supabase
      .from("user_events")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getCompletionRate(userId: string) {
    const { count: total, error: totalError } = await supabase
      .from("user_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("event_type", ["view", "finish"]);

    if (totalError) throw totalError;
    if (!total) return 0;

    const { count: finished, error: finishedError } = await supabase
      .from("user_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "finish");

    if (finishedError) throw finishedError;

    return ((finished || 0) / total) * 100;
  }

  static async getAvgWatchTime(userId: string) {
    const { data, error } = await supabase
      .from("user_events")
      .select("watch_duration")
      .eq("user_id", userId)
      .eq("event_type", "finish");

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc, curr) => acc + (curr.watch_duration || 0), 0);
    return sum / data.length;
  }
}
