import { useRouter } from "vue-router";

/**
 * Navigate to actor details page
 * @param actor - Actor object with id and name
 */
export const navigateToActorDetails = (actor: { id: number; name: string }) => {
  const router = useRouter();

  // Create URL-friendly slug from actor name
  const actorSlug = actor.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Navigate with both name slug and ID for reliability
  router.push({
    name: "ActorDetails",
    params: {
      name: actorSlug,
      id: actor.id.toString(),
    },
  });
};

/**
 * Composable for actor navigation (use this in components)
 */
export const useActorNavigation = () => {
  const router = useRouter();

  const goToActor = (actor: { id: number; name: string }) => {
    const actorSlug = actor.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    router.push(`/ng/actor/${actorSlug}?id=${actor.id}`);
  };

  return { goToActor };
};
