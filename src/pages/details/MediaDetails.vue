<template>
  <TrailerModal
    :is-open="showTrailerModal"
    :trailer="selectedTrailer"
    @close="closeTrailerModal"
    @view-details="openFullDetails"
  />
  <ReviewModal
    :is-open="showReviewModal"
    :initial-text="editingReview ? editingReview.reviewText : ''"
    :initial-spoiler="editingReview ? editingReview.isSpoiler : false"
    :is-editing="!!editingReview"
    @close="closeReviewModal"
    @submit="handleReviewSubmit"
  />

  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <div v-if="loading" class="space-y-8 py-10 px-6 mt-18">
      <div
        class="relative overflow-hidden rounded-2xl h-[60vh] bg-gray-800/50 animate-pulse"
      ></div>
      <div class="space-y-4 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div class="h-10 w-3/4 rounded bg-gray-800/50 animate-pulse"></div>
        <div class="h-6 w-full rounded bg-gray-800/50 animate-pulse"></div>
        <div class="h-6 w-2/3 rounded bg-gray-800/50 animate-pulse"></div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="text-center">
        <p class="text-red-500 text-xl font-[Gilroy-SemiBold] mb-4">
          {{ error }}
        </p>
        <button
          @click="fetchDetails"
          class="px-3 md:px-6 py-2 md:py-2.5 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all"
        >
          Try Again
        </button>
      </div>
    </div>

    <section v-else-if="media" class="space-y-8 -mt-10">
      <div
        class="relative h-screen overflow-hidden"
        :style="{
          backgroundImage: media.backdrop_path
            ? `url(${baseUrl + media.backdrop_path})`
            : 'url(https://placehold.co/1920x1080/0f0f0f/FF0000?text=NO+IMAGE)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      >
        <div
          class="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"
        ></div>
        <div
          class="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"
        ></div>

        <div class="absolute bottom-0 left-0 right-0 p-6 mx-auto">
          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-[Gilroy-Bold] mb-4 max-w-[1230px] lg:max-w-[1440px] drop-shadow-2xl animate-fade-up"
          >
            {{ media.title }}
          </h1>

          <div
            class="flex flex-wrap items-center gap-3 md:gap-4 mb-4 text-sm animate-fade-up"
            style="animation-delay: 0.1s"
          >
            <div
              class="px-3 py-1.5 bg-[#b20710] rounded-full flex items-center gap-1"
            >
              <span class="text-yellow-400 text-xl"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="size-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd"
                  /></svg
              ></span>
              <span class="font-[Gilroy-Bold] mt-1 md:mt-0">{{
                media.vote_average?.toFixed(1)
              }}</span>
            </div>

            <span
              class="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-[Gilroy-SemiBold]"
            >
              {{ media.media_type === "tv" ? "TV SHOW" : "MOVIE" }}
            </span>

            <span
              class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full font-[Gilroy-Medium]"
            >
              {{
                new Date(
                  media.release_date || media.first_air_date || "",
                ).getFullYear()
              }}
            </span>

            <span
              v-if="isTv && media.number_of_seasons"
              class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full font-[Gilroy-SemiBold]"
            >
              {{ media.number_of_seasons }} Season{{
                media.number_of_seasons > 1 ? "s" : ""
              }}
              • {{ tvStatus }}
            </span>
            <div
              class="flex flex-wrap gap-2 animate-fade-up"
              style="animation-delay: 0.15s"
            >
              <router-link
                v-for="genreName in getGenreNames(
                  getGenreIdsFromMedia(media),
                ).slice(0, 5)"
                :key="genreName"
                :to="`/ng/genre/${genreName.toLowerCase()}`"
                class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full font-[Gilroy-SemiBold] text-sm text-[#ffffffec] hover:bg-[#b20710] transition-all duration-200"
              >
                {{ genreName }}
              </router-link>
            </div>
          </div>

          <p
            class="text-lg md:text-xl text-gray-200 font-[Gilroy-Medium] line-clamp max-w-[1230px] lg:max-w-[1440px] mb-6 animate-fade-up"
            style="animation-delay: 0.2s"
          >
            {{ media.overview }}
          </p>

          <div
            class="flex flex-wrap gap-4 animate-fade-up"
            style="animation-delay: 0.25s"
          >
            <button
              @click="playTrailer"
              class="px-8 py-4 bg-white text-black rounded-full font-[Gilroy-Bold] text-lg hover:bg-white/90 transition-all flex items-center gap-3 cursor-pointer"
              :class="loadingTrailer ? 'opacity-75 cursor-wait' : ''"
            >
              <span v-if="!loadingTrailer" class="text-2xl"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span v-else class="animate-spin"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 0 1 3.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 0 0-4.392-4.392 49.422 49.422 0 0 0-7.436 0A4.756 4.756 0 0 0 3.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 1 0 1.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 0 1-3.01-3.01c1.19-.09 2.392-.135 3.605-.135Zm-6.97 6.22a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 0 0 4.392 4.392 49.413 49.413 0 0 0 7.436 0 4.756 4.756 0 0 0 4.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 0 0-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 0 1-3.01 3.01 47.953 47.953 0 0 1-7.21 0 3.256 3.256 0 0 1-3.01-3.01 47.759 47.759 0 0 1-.1-1.759L6.97 15.53a.75.75 0 0 0 1.06-1.06l-3-3Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span>{{ loadingTrailer ? "Loading..." : "Watch Trailer" }}</span>
            </button>

            <router-link
              :to="`/ng/watch/${slugify(media.title)}-${media.id}?type=${media.media_type}`"
              class="px-8 py-4 bg-[#b20710] text-white rounded-full font-[Gilroy-Bold] text-lg hover:bg-[#e32125] transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span>Watch Now</span>
            </router-link>

            <button
              @click="toggleWatchlist"
              class="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-[Gilroy-SemiBold] text-lg hover:bg-white/30 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span :class="{ 'text-red-500 animate-pulse': inWatchlist }">
                <svg
                  v-if="inWatchlist"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </span>
              <span>{{ inWatchlist ? "In My List" : "Add to List" }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="isTv && latestSeason" class="px-6 mx-auto space-y-4">
        <h2 class="text-3xl font-[Gilroy-Bold]">Latest Season</h2>
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#b20710]/50 transition-all"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <img
              v-if="latestSeason.poster_path"
              :src="`https://image.tmdb.org/t/p/w342${latestSeason.poster_path}`"
              alt="Season Poster"
              class="w-full md:w-48 rounded-xl object-cover"
              loading="lazy"
            />
            <div class="flex-1">
              <h3 class="text-2xl font-[Gilroy-Bold] mb-2">
                {{ latestSeason.name }}
              </h3>
              <p class="text-gray-400 font-[Gilroy-SemiBold] mb-4">
                {{ latestSeason.episode_count }} Episode{{
                  latestSeason.episode_count > 1 ? "s" : ""
                }}
              </p>
              <p class="text-gray-300 font-[Gilroy-Regular] line-clamp-3">
                {{ latestSeason.overview || "No description available." }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="media.seasons && media.seasons.length > 0"
          class="text-center"
        >
          <router-link
            :to="`/ng/tv-shows/${slugify(media.title)}-${media.id}`"
            class="inline-flex px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all items-center gap-1"
          >
            View All Seasons
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5 hidden md:block"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>
      </div>

      <div v-if="cast.length" class="px-6 mx-auto space-y-4">
        <h2 class="text-3xl font-[Gilroy-Bold]">Cast</h2>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div
            v-for="actor in cast"
            :key="actor.id"
            @click="goToActor(actor)"
            class="shrink-0 w-32 text-center group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-2xl mb-3">
              <img
                v-if="actor.profile_path"
                :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
                :alt="actor.name"
                class="w-full h-44 object-cover group-hover:scale-110 transition-all duration-500"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-44 bg-gray-800 flex items-center justify-center text-4xl"
              >
                👤
              </div>
            </div>
            <p class="text-sm font-[Gilroy-Bold] line-clamp-1">
              {{ actor.name }}
            </p>
            <p class="text-xs text-gray-400 font-[Gilroy-Medium] line-clamp-1">
              {{ actor.character }}
            </p>
          </div>
        </div>
      </div>

      <!-- Ratings & Reviews Section -->
      <section class="px-6 mx-auto space-y-8 py-8 border-t border-white/10">
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-[Gilroy-Bold]">Ratings & Reviews</h2>
        </div>

        <!-- Rating Stats -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Community Rating -->
          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 class="text-xl font-[Gilroy-SemiBold] mb-4 text-gray-200">
              Community Rating
            </h3>
            <div class="flex items-center gap-6">
              <div class="text-5xl font-[Gilroy-Bold] text-[#b20710]">
                {{ ratingStats?.averageRating?.toFixed(1) || "0.0" }}
              </div>
              <div class="space-y-1">
                <StarRating
                  :model-value="ratingStats?.averageRating || 0"
                  :show-text="false"
                  :interactive="false"
                  active-color="#b20710"
                />
                <p class="text-sm text-gray-400 font-[Gilroy-Medium]">
                  {{ ratingStats?.totalRatings || 0 }}
                  {{ ratingStats?.totalRatings === 1 ? "rating" : "ratings" }}
                </p>
              </div>
            </div>
          </div>

          <!-- User Rating -->
          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
          >
            <div
              v-if="!auth.isLoggedIn"
              class="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <p class="font-[Gilroy-Bold]">Sign in to rate</p>
              <router-link
                to="/ng/login"
                class="px-4 py-2 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold]"
                >Login</router-link
              >
            </div>

            <h3 class="text-xl font-[Gilroy-SemiBold] mb-4 text-gray-200">
              Your Rating
            </h3>
            <div class="flex flex-col gap-2">
              <StarRating
                v-model="userRating"
                :interactive="auth.isLoggedIn"
                :show-text="true"
                active-color="#b20710"
                @update:model-value="handleRatingChange"
              />
              <p
                v-if="userRating > 0"
                class="text-sm text-green-400 font-[Gilroy-Medium] mt-1 animate-fade-up"
              >
                Thanks for rating!
              </p>
              <p v-else class="text-sm text-gray-500 font-[Gilroy-Medium] mt-1">
                Click stars to rate
              </p>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-[Gilroy-Bold]">User Reviews</h3>
            <button
              v-if="auth.isLoggedIn"
              @click="openReviewModal"
              class="px-4 py-2 bg-white/10 hover:bg-[#b20710] text-white rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
              Write a Review
            </button>
          </div>

          <div v-if="reviewsLoading" class="space-y-4">
            <div
              v-for="i in 3"
              :key="i"
              class="h-32 bg-white/5 rounded-xl animate-pulse"
            ></div>
          </div>

          <div v-else-if="reviews.length > 0" class="space-y-4">
            <ReviewCard
              v-for="review in reviews"
              :key="review.id"
              :review="review"
              :user-vote="getUserVote(review.id)"
              @helpful="handleReviewHelpful(review.id, $event)"
              @edit="editReview(review)"
              @delete="deleteReview(review.id)"
            />
          </div>

          <div
            v-else
            class="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed"
          >
            <div class="text-4xl mb-3">📝</div>
            <h4 class="text-xl font-[Gilroy-Bold] text-gray-200">
              No reviews yet
            </h4>
            <p class="text-gray-400 mb-6 font-[Gilroy-Medium]">
              Be the first to share your thoughts on this title!
            </p>
            <button
              v-if="auth.isLoggedIn"
              @click="openReviewModal"
              class="px-6 py-3 bg-[#b20710] hover:bg-[#e32125] text-white rounded-xl font-[Gilroy-Bold] transition-all cursor-pointer"
            >
              Write a Review
            </button>
            <div v-else class="text-gray-500">
              <router-link
                to="/ng/login"
                class="text-[#b20710] hover:underline font-[Gilroy-SemiBold]"
                >Log in</router-link
              >
              to write a review
            </div>
          </div>
        </div>
      </section>

      <div v-if="similar.length" class="px-6 mx-auto space-y-4 pb-12">
        <h2 class="text-3xl font-[Gilroy-Bold]">Similar Titles</h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          <router-link
            v-for="sim in similar"
            :key="sim.id"
            :to="simRoute(sim)"
            class="group relative rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
          >
            <div class="aspect-2/3">
              <img
                :src="
                  sim.poster_path
                    ? `https://image.tmdb.org/t/p/w342${sim.poster_path}`
                    : 'https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE'
                "
                :alt="sim.title || sim.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                loading="lazy"
              />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 z-50 flex items-center gap-3"
      >
        <span v-if="toastIcon === 'error'" class="text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-3.53 5.97a.75.75 0 0 1 1.06 0L12 10.69l2.47-2.47a.75.75 0 1 1 1.06 1.06L13.06 11.75l2.47 2.47a.75.75 0 1 1-1.06 1.06L12 12.81l-2.47 2.47a.75.75 0 1 1-1.06-1.06l2.47-2.47-2.47-2.47a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <span v-else-if="toastIcon === 'success'" class="text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <span v-else-if="toastIcon === 'warning'" class="text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useWatchlistStore } from "@/stores/watchlist";
import { genreMap } from "@/types/media";
import { getMediaVideos } from "@/api/tmdb";
import TrailerModal from "@/components/media/TrailerModal.vue";
import { useActorNavigation } from "@/utils/actorHelpers";
import AdSlot from "@/components/ads/AdSlot.vue";
import { useAuthStore } from "@/stores/auth";
import { useRatingsStore } from "@/stores/ratings";
import StarRating from "@/components/media/StarRating.vue";
import ReviewCard from "@/components/media/ReviewCard.vue";
import ReviewModal from "@/components/media/ReviewModal.vue";
import type { Review } from "@/services/ratingService";
import { useHead } from "@unhead/vue";

const props = defineProps<{
  name: string;
}>();

const route = useRoute();

const media = ref<any | null>(null);

useHead({
  title: computed(() =>
    media.value
      ? `${media.value.title} — Watch Trailer & Discover | FilmRitz`
      : "Loading Media — FilmRitz",
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        media.value
          ? media.value.overview
          : "Discover movies and TV shows on FilmRitz.",
      ),
    },
    {
      property: "og:title",
      content: computed(() =>
        media.value ? media.value.title : "FilmRitz Media",
      ),
    },
    {
      property: "og:description",
      content: computed(() =>
        media.value ? media.value.overview : "Discover it on FilmRitz.",
      ),
    },
    {
      property: "og:image",
      content: computed(() =>
        media.value?.poster_path
          ? `https://image.tmdb.org/t/p/w500${media.value.poster_path}`
          : "https://filmritz.vercel.app/filmritzlogo2.png",
      ),
    },
    { name: "robots", content: "index, follow" },
  ],
});

interface TrailerData {
  id: string;
  title: string;
  type: string;
  backdrop_path: string;
  duration: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  key: string;
  site: string;
  publishedAt?: string;
}

const baseUrl = "https://image.tmdb.org/t/p/w1280";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const latestSeason = ref<any | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const { goToActor } = useActorNavigation();

// Trailer state
const showTrailerModal = ref(false);
const selectedTrailer = ref<TrailerData | null>(null);
const loadingTrailer = ref(false);

const store = useWatchlistStore();
store.loadFromLocalStorage();

const auth = useAuthStore();
const ratingsStore = useRatingsStore();

// Rating & Review State
const userRating = ref(0);
const ratingStats = ref<any>(null);
const reviews = ref<Review[]>([]);
const reviewsLoading = ref(false);
const showReviewModal = ref(false);
const editingReview = ref<Review | null>(null);

const inWatchlist = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastIcon = ref<null | "error" | "success" | "warning">(null);

const isTv = computed(
  () => route.params.type === "tv" || media.value?.media_type === "tv",
);

const tvStatus = computed(() => {
  if (!isTv.value || !media.value) return "Unknown";

  const status = media.value.status;
  const nextEpisodeExists = !!media.value.next_episode_to_air;

  if (status === "Canceled") return "Canceled";
  if (status === "Ended" && nextEpisodeExists) return "Ongoing";
  if (status === "Returning Series") return "Ongoing";
  if (status === "Ended") return "Finished";

  return "Ongoing";
});

function slugToId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const raw = Array.isArray(param) ? param[0] : param;
  const match = raw.match(/-(\d+)$/);
  return match ? Number(match[1]) : /^\d+$/.test(raw) ? Number(raw) : null;
}

function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  );
}

async function fetchDetails() {
  loading.value = true;
  error.value = null;

  try {
    const idNum = slugToId(props.name);
    if (!idNum) {
      error.value = "Invalid media ID";
      return;
    }

    const mediaType = route.path.includes("/tv/") ? "tv" : "movie";

    const [detailsRes, creditsRes, similarRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}/credits`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}/similar`, {
        params: { api_key: API_KEY },
      }),
    ]);

    media.value = {
      ...detailsRes.data,
      media_type: mediaType,
      title: detailsRes.data.title ?? detailsRes.data.name,
    };

    cast.value = creditsRes.data.cast?.slice(0, 15) ?? [];
    similar.value = (similarRes.data.results || [])
      .slice(0, 10)
      .map((r: any) => ({
        ...r,
        media_type: mediaType,
        title: r.title ?? r.name,
      }));

    if (mediaType === "tv" && detailsRes.data.seasons?.length) {
      latestSeason.value = detailsRes.data.seasons.at(-1);
    }

    inWatchlist.value = store.isInWatchlist(media.value.id);

    // Fetch ratings and reviews
    fetchRatingsAndReviews();
  } catch (err: any) {
    console.error(err);
    error.value = "Failed to load media details. Please try again.";
  } finally {
    loading.value = false;
  }
}

async function playTrailer() {
  if (!media.value) return;

  console.log("Playing trailer for:", media.value);
  loadingTrailer.value = true;

  try {
    const videos = await getMediaVideos(media.value.id, media.value.media_type);
    console.log("Fetched videos:", videos);

    const trailer = videos.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube",
    );

    if (trailer) {
      selectedTrailer.value = {
        id: `${media.value.media_type}-${media.value.id}-${trailer.key}`,
        title: media.value.title || "",
        type:
          media.value.media_type === "movie" ? "Movie Trailer" : "TV Trailer",
        backdrop_path:
          media.value.backdrop_path || media.value.poster_path || "",
        duration: 150,
        mediaId: media.value.id,
        mediaType: media.value.media_type,
        key: trailer.key,
        site: trailer.site,
        publishedAt: trailer.published_at,
      };

      showTrailerModal.value = true;
    } else {
      console.warn("No trailer found");
      toastIcon.value = "warning";
      toastMessage.value = "No trailer available";
      showToast.value = true;
      setTimeout(() => (showToast.value = false), 3000);
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    toastIcon.value = "error";
    toastMessage.value = "Failed to load trailer";
    showToast.value = true;
    ("");
    setTimeout(() => (showToast.value = false), 3000);
  } finally {
    loadingTrailer.value = false;
  }
}

function closeTrailerModal() {
  showTrailerModal.value = false;
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300);
}

function openFullDetails(_mediaType: "movie" | "tv", _mediaId: number) {
  // Already on the details page, just close the modal
  closeTrailerModal();
}

function getGenreIdsFromMedia(media: any): number[] {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres))
    return media.genres.map((g: { id: number }) => g.id);
  return [];
}

function getGenreNames(ids?: number[]) {
  return ids?.map((id) => genreMap[id]).filter(Boolean) ?? [];
}

function simRoute(sim: any) {
  const slug = slugify(sim.title || sim.name);
  return sim.media_type === "tv"
    ? `/ng/tv/${slug}-${sim.id}`
    : `/ng/movie/${slug}-${sim.id}`;
}

function toggleWatchlist() {
  if (!media.value) return;

  if (inWatchlist.value) {
    store.removeFromWatchlist(media.value.id);
    toastIcon.value = "error";
    toastMessage.value = "Removed from Watchlist";
  } else {
    store.addToWatchlist({
      id: media.value.id,
      title: media.value.title,
      poster_path: media.value.poster_path,
      media_type: media.value.media_type,
      overview: media.value.overview,
      release_date: media.value.release_date,
      vote_average: media.value.vote_average,
    });
    toastIcon.value = "success";
    toastMessage.value = "Added to Watchlist";
  }

  inWatchlist.value = !inWatchlist.value;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

// Rating & Review Logic
async function fetchRatingsAndReviews() {
  if (!media.value) return;

  reviewsLoading.value = true;
  try {
    const { id, media_type } = media.value;

    // Parallel fetch
    const [stats, reviewsData] = await Promise.all([
      ratingsStore.fetchMediaStats(id, media_type),
      ratingsStore.fetchReviews(id, media_type),
    ]);

    ratingStats.value = stats;
    reviews.value = reviewsData;

    // If logged in, get user rating
    if (auth.isLoggedIn && auth.user) {
      const userRatingData = await ratingsStore.fetchUserRating(
        auth.user.id,
        id,
        media_type,
      );
      if (userRatingData) {
        userRating.value = userRatingData.rating;
      } else {
        userRating.value = 0;
      }
    }
  } catch (err) {
    console.error("Failed to load ratings:", err);
  } finally {
    reviewsLoading.value = false;
  }
}

async function handleRatingChange(newRating: number) {
  if (!auth.isLoggedIn || !media.value || !auth.user) {
    if (!auth.isLoggedIn) {
      toastIcon.value = "warning";
      toastMessage.value = "Please login to rate content";
      showToast.value = true;
      setTimeout(() => (showToast.value = false), 3000);
    }
    return;
  }

  try {
    await ratingsStore.setRating(
      auth.user.id,
      media.value.id,
      media.value.media_type,
      newRating,
    );

    // Update local stats immediately for better UX
    ratingStats.value = await ratingsStore.fetchMediaStats(
      media.value.id,
      media.value.media_type,
    );
  } catch (err) {
    console.error("Failed to save rating:", err);
    toastIcon.value = "error";
    toastMessage.value = "Failed to save rating";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  }
}

function openReviewModal() {
  editingReview.value = null;
  showReviewModal.value = true;
}

function editReview(review: Review) {
  editingReview.value = review;
  showReviewModal.value = true;
}

function closeReviewModal() {
  showReviewModal.value = false;
  setTimeout(() => {
    editingReview.value = null;
  }, 300);
}

async function handleReviewSubmit({
  text,
  isSpoiler,
}: {
  text: string;
  isSpoiler: boolean;
}) {
  if (!auth.user || !media.value) return;

  try {
    await ratingsStore.addReview(
      auth.user.id,
      media.value.id,
      media.value.media_type,
      text,
      isSpoiler,
    );

    // Refresh reviews
    reviews.value = await ratingsStore.fetchReviews(
      media.value.id,
      media.value.media_type,
    );

    closeReviewModal();
    toastIcon.value = "success";
    toastMessage.value = editingReview.value
      ? "Review updated!"
      : "Review posted!";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  } catch (err: any) {
    console.error("Failed to submit review:", err);
    toastIcon.value = "error";
    toastMessage.value = err.message || "Failed to submit review";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  }
}

async function deleteReview(reviewId: string) {
  if (
    !auth.user ||
    !media.value ||
    !confirm("Are you sure you want to delete this review?")
  )
    return;

  try {
    // Note: The store action uses user info to verify ownership,
    // but the delete logic in ratingService is by user_id
    await ratingsStore.deleteReview(
      auth.user.id,
      media.value.id,
      media.value.media_type,
    );

    // Update list
    reviews.value = reviews.value.filter((r) => r.id !== reviewId);

    toastIcon.value = "success";
    toastMessage.value = "Review deleted";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  } catch (err) {
    console.error("Failed to delete review:", err);
    toastIcon.value = "error";
    toastMessage.value = "Failed to delete review";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  }
}

async function handleReviewHelpful(reviewId: string, isHelpful: boolean) {
  if (!auth.isLoggedIn || !auth.user) {
    toastIcon.value = "warning";
    toastMessage.value = "Please login to vote";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
    return;
  }

  try {
    await ratingsStore.markReviewHelpful(reviewId, auth.user.id, isHelpful);

    // Optimistically update UI
    const review = reviews.value.find((r) => r.id === reviewId);
    if (review) {
      // Logic to handle immediate UI update could be complex because of vote toggling
      // Simplest is to just re-fetch reviews or assume success
      // Let's re-fetch to ensure counts are correct based on DB trigger logic
      setTimeout(async () => {
        if (media.value) {
          reviews.value = await ratingsStore.fetchReviews(
            media.value.id,
            media.value.media_type,
          );
        }
      }, 500);
    }
  } catch (err) {
    console.error("Vote failed:", err);
  }
}

function getUserVote(reviewId: string) {
  return ratingsStore.userVotes.get(reviewId);
}

onMounted(fetchDetails);
watch(() => props.name, fetchDetails);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out forwards;
}
</style>
