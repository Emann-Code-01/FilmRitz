import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Phase 2 intelligence data...");

  // Seed some film attributes
  const films = [
    {
      film_id: 550, // Fight Club
      runtime: 139,
      complexity_score: 8.5,
      mood_tags: ["Mind-bending", "Dark", "Gritty"],
      pacing_score: 7.0,
      visual_style_tags: ["Noir", "Grungy"],
    },
    {
      film_id: 27205, // Inception
      runtime: 148,
      complexity_score: 9.5,
      mood_tags: ["Mind-bending", "Intense", "Atmospheric"],
      pacing_score: 8.0,
      visual_style_tags: ["Sleek", "Architectural"],
    },
    {
      film_id: 155, // The Dark Knight
      runtime: 152,
      complexity_score: 7.5,
      mood_tags: ["Tense", "Gritty", "Epic"],
      pacing_score: 8.5,
      visual_style_tags: ["Cinematic", "Shadowy"],
    },
  ]; 

  for (const film of films) {
    await prisma.filmAttribute.upsert({
      where: { film_id: film.film_id },
      update: film,
      create: film,
    });
  }

  // Seed some collaboration edges
  const collaborations = [
    { person_a_id: 525, person_b_id: 3894, collaboration_weight: 5.0 }, // Christopher Nolan & Cillian Murphy
    { person_a_id: 287, person_b_id: 7467, collaboration_weight: 4.5 }, // Brad Pitt & David Fincher
  ];

  for (const collab of collaborations) {
    const [id1, id2] = [collab.person_a_id, collab.person_b_id].sort(
      (a, b) => a - b,
    );
    await prisma.collaborationEdge.upsert({
      where: {
        person_a_id_person_b_id: {
          person_a_id: id1,
          person_b_id: id2,
        },
      },
      update: { collaboration_weight: collab.collaboration_weight },
      create: {
        person_a_id: id1,
        person_b_id: id2,
        collaboration_weight: collab.collaboration_weight,
      },
    });
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
