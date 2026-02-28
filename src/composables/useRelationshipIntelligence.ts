import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

interface PersonNode {
  id: number
  name: string
  profile_path?: string
  type: 'director' | 'actor'
}

interface CollaborationEdge {
  person_a: PersonNode
  person_b: PersonNode
  weight: number
  collaborations: Array<{
    film_id: number
    film_title: string
    role_a: string
    role_b: string
  }>
}

export function useRelationshipIntelligence() {
  const relationships = ref<CollaborationEdge[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Find frequent collaborators of a person
  const findCollaborators = async (personId: number, limit = 10) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: queryError } = await supabase
        .rpc('get_person_collaborators', {
          p_person_id: personId,
          p_limit: limit
        })

      if (queryError) throw queryError

      relationships.value = data || []
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to find collaborators'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Find films by director-actor collaborations
  const findFilmsByCollaboration = async (directorId: number, actorId: number) => {
    try {
      const { data, error: queryError } = await supabase
        .rpc('get_collaboration_films', {
          p_director_id: directorId,
          p_actor_id: actorId
        })

      if (queryError) throw queryError

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to find collaboration films'
      throw err
    }
  }

  // Get relationship insights
  const getRelationshipInsights = async (personId: number) => {
    try {
      const collaborators = await findCollaborators(personId, 5)

      const insights = {
        totalCollaborators: collaborators.length,
        strongestRelationship: collaborators[0],
        collaborationStyle: analyzeCollaborationStyle(collaborators),
        recommendedConnections: findRecommendedConnections(collaborators)
      }

      return insights
    } catch (err) {
      console.error('Failed to get relationship insights:', err)
      return null
    }
  }

  // Analyze collaboration style
  const analyzeCollaborationStyle = (collaborators: CollaborationEdge[]) => {
    if (!collaborators.length) return 'Unknown'

    const avgWeight = collaborators.reduce((sum, c) => sum + c.weight, 0) / collaborators.length

    if (avgWeight > 3) return 'Frequent Collaborator'
    if (avgWeight > 1.5) return 'Regular Partner'
    return 'Occasional Collaborator'
  }

  // Find recommended connections based on mutual collaborators
  const findRecommendedConnections = (collaborators: CollaborationEdge[]) => {
    // This would be more complex in a real implementation
    // For now, return some mock recommendations
    return collaborators.slice(0, 3).map(c => ({
      person: c.person_b,
      reason: `Collaborates with ${c.person_a.name}`
    }))
  }

  const hasRelationships = computed(() => relationships.value.length > 0)

  return {
    relationships,
    isLoading,
    error,
    hasRelationships,
    findCollaborators,
    findFilmsByCollaboration,
    getRelationshipInsights
  }
}