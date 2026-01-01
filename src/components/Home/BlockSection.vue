<template>
  <section
    class="bg-[#000000] min-h-fit relative z-10 overflow-hidden -mt-16 px-2 py-20 xl:px-32 md:px-14 space-y-10"
  >
    <div class="space-y-5">
      <h1
        class="text-white font-[Gilroy-Bold] text-2xl xl:text-3xl transition-all duration-900 animate-fade-up"
      >
        Trending Now
      </h1>
      <div class="flex">
        <TrendingGrid />
      </div>
    </div>
    <div
      class="space-y-5 text-white transition-all duration-900 animate-fade-up"
    >
      <h1
        class="font-[Gilroy-Bold] text-2xl xl:text-3xl transition-all duration-900 animate-fade-up"
      >
        More Reasons to Join
      </h1>
      <div
        class="xl:flex xl:space-x-5 xl:space-y-5 md:grid md:grid-cols-2 md:space-y-5 space-y-5 transition-all duration-900 animate-fade-up"
      >
        <div
          class="relative xl:rounded-br-3xl rounded-3xl bg-[linear-gradient(to_top_left,rgba(255,153,0,0.6)_0%,rgba(229,9,20,0.6)_20%,rgba(14,27,79,0.6)_77%,rgba(0,4,19,0.6)_100%)] xl:w-full h-80 px-5 py-5 transition-all duration-900 animate-fade-up md:mr-2.5"
        >
          <div class="space-y-3 transition-all duration-900 animate-fade-up">
            <h1
              class="font-[Gilroy-Bold] text-2xl transition-all duration-900 animate-fade-up"
            >
              Discover what fits your mood
            </h1>
            <p
              class="font-[Gilroy-Medium] text-white/60 transition-all duration-900 animate-fade-up"
            >
              Explore movies and TV shows based on genres, moods, trends, and
              what you actually feel like watching right now.
            </p>
          </div>
          <div
            class="absolute right-0 bottom-0 mb-5 mr-7 transition-all duration-900 animate-fade-up"
          >
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <g id="television-core-small">
                <path
                  id="Vector"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M37.2 53.3992C37.2 52.7365 36.6628 52.1992 36 52.1992H34.8C34.1373 52.1992 33.6 52.7365 33.6 53.3992V56.2636C33.6 56.9129 33.0834 57.4433 32.4347 57.4739C30.3013 57.5744 28.1719 57.7834 26.0546 58.1011L19.444 59.0926C18.2692 59.2688 17.4 60.2782 17.4 61.4662V62.0992C17.4 62.4304 17.6686 62.6992 18 62.6992H52.8C53.1314 62.6992 53.4 62.4304 53.4 62.0992V61.4662C53.4 60.2782 52.5309 59.2688 51.3561 59.0926L44.7454 58.1011C42.6282 57.7834 40.4987 57.5744 38.3653 57.4739C37.7167 57.4433 37.2 56.9129 37.2 56.2636V53.3992Z"
                  fill="url(#paint0_radial_5179_1308)"
                ></path>
                <path
                  id="Vector_2"
                  d="M18.6 60.7388C18.6 60.2306 18.9587 59.796 19.4602 59.711C22.0196 59.2775 29.7585 58.0508 35.4 58.0508C41.0415 58.0508 48.7804 59.2775 51.3398 59.711C51.8412 59.796 52.2 60.2306 52.2 60.7388C52.2 60.902 52.0575 61.0268 51.8967 61.0004C50.1219 60.707 40.9704 59.2409 35.4 59.2409C29.8295 59.2409 20.678 60.707 18.9033 61.0004C18.7425 61.0268 18.6 60.902 18.6 60.7388Z"
                  fill="url(#paint1_radial_5179_1308)"
                ></path>
                <path
                  id="Vector_3"
                  d="M63 12H8.99995C8.00584 12 7.19995 12.8059 7.19995 13.8V51.6C7.19995 52.5941 8.00584 53.4 8.99995 53.4H63C63.9941 53.4 64.8 52.5941 64.8 51.6V13.8C64.8 12.8059 63.9941 12 63 12Z"
                  fill="url(#paint2_linear_5179_1308)"
                ></path>
                <path
                  id="Vector_4"
                  d="M63 12H8.99995C8.00584 12 7.19995 12.8059 7.19995 13.8V51.6C7.19995 52.5941 8.00584 53.4 8.99995 53.4H63C63.9941 53.4 64.8 52.5941 64.8 51.6V13.8C64.8 12.8059 63.9941 12 63 12Z"
                  fill="url(#paint3_radial_5179_1308)"
                ></path>
                <path
                  id="Vector_5"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.99995 12.6H63C63.663 12.6 64.2 13.1372 64.2 13.8V50.4H7.79995V13.8C7.79995 13.1372 8.33719 12.6 8.99995 12.6ZM7.19995 50.4V13.8C7.19995 12.8059 8.00581 12 8.99995 12H63C63.9942 12 64.8 12.8059 64.8 13.8V50.4V51.6C64.8 52.5941 63.9942 53.4 63 53.4H8.99995C8.00581 53.4 7.19995 52.5941 7.19995 51.6V50.4Z"
                  fill="url(#paint4_radial_5179_1308)"
                ></path>
                <path
                  id="Vector_6"
                  d="M35.4 52.8C36.3941 52.8 37.2 52.3971 37.2 51.9C37.2 51.4029 36.3941 51 35.4 51C34.4059 51 33.6 51.4029 33.6 51.9C33.6 52.3971 34.4059 52.8 35.4 52.8Z"
                  fill="url(#paint5_radial_5179_1308)"
                ></path>
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_5179_1308"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(50.3269 49.3723) rotate(118.526) scale(55.1579 46.2871)"
                >
                  <stop stop-color="#802600"></stop>
                  <stop offset="0.333333" stop-color="#6F181D"></stop>
                  <stop offset="0.666667" stop-color="#5B1333"></stop>
                  <stop offset="1" stop-color="#391945"></stop>
                </radialGradient>
                <radialGradient
                  id="paint1_radial_5179_1308"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(48.1077 53.6128) rotate(158.116) scale(32.7275 42.219)"
                >
                  <stop stop-color="#99421D"></stop>
                  <stop offset="0.333333" stop-color="#99161D"></stop>
                  <stop offset="0.666667" stop-color="#7D1845"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <linearGradient
                  id="paint2_linear_5179_1308"
                  x1="10.4727"
                  y1="14.9572"
                  x2="56.1755"
                  y2="51.4814"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#99161D"></stop>
                  <stop offset="0.245283" stop-color="#CA005B"></stop>
                  <stop offset="0.346698" stop-color="#FF479A"></stop>
                  <stop offset="0.46934" stop-color="#CC3CFF"></stop>
                  <stop offset="0.735849" stop-color="#BC1A22"></stop>
                  <stop offset="1" stop-color="#C94FF5"></stop>
                </linearGradient>
                <radialGradient
                  id="paint3_radial_5179_1308"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(38.6181 23.8286) rotate(90) scale(25.9571 25.8545)"
                >
                  <stop stop-color="#1C0E20" stop-opacity="0"></stop>
                  <stop offset="1" stop-color="#1C0E20"></stop>
                </radialGradient>
                <radialGradient
                  id="paint4_radial_5179_1308"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(54 20.1938) rotate(144.293) scale(47.2897 44.8232)"
                >
                  <stop stop-color="#EF7744"></stop>
                  <stop offset="0.333333" stop-color="#E50914"></stop>
                  <stop offset="0.666667" stop-color="#A70D53"></stop>
                  <stop offset="1" stop-color="#792A95"></stop>
                </radialGradient>
                <radialGradient
                  id="paint5_radial_5179_1308"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(36.525 51.3562) rotate(135) scale(4.58735)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                  <stop offset="0.666667" stop-color="#F89DC6"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div
          class="relative xl:rounded-br-3xl rounded-3xl bg-[linear-gradient(to_top_left,rgba(255,153,0,0.6)_0%,rgba(229,9,20,0.6)_20%,rgba(14,27,79,0.6)_77%,rgba(0,4,19,0.6)_100%)] xl:w-full h-80 px-5 py-5 transition-all duration-900 animate-fade-up md:ml-2.5"
        >
          <div class="space-y-3 transition-all duration-900 animate-fade-up">
            <h1
              class="font-[Gilroy-Bold] text-2xl transition-all duration-900 animate-fade-up"
            >
              Watch trailers before you decide
            </h1>
            <p
              class="font-[Gilroy-Medium] text-white/60 transition-all duration-900 animate-fade-up"
            >
              Instantly preview trailers, clips, and overviews so you know
              exactly what you’re getting into before committing.
            </p>
          </div>
          <div
            class="absolute right-0 bottom-0 mb-5 mr-7 transition-all duration-900 animate-fade-up"
          >
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <g id="download-core-small">
                <path
                  id="Vector"
                  d="M36 70.2008C54.8882 70.2008 70.2001 54.8889 70.2001 36.0008C70.2001 17.1126 54.8882 1.80078 36 1.80078C17.1119 1.80078 1.80005 17.1126 1.80005 36.0008C1.80005 54.8889 17.1119 70.2008 36 70.2008Z"
                  fill="url(#paint0_radial_5179_7940)"
                ></path>
                <path
                  id="Vector_2"
                  opacity="0.4"
                  d="M64.7658 36.195C65.5206 51.5916 53.7908 63.5824 38.5668 62.977C23.3428 62.3722 10.3893 49.4 9.63446 34.0034C8.87954 18.6068 20.6091 6.61594 35.8331 7.22116C51.0571 7.82638 64.0104 20.7984 64.7658 36.195Z"
                  fill="url(#paint1_radial_5179_7940)"
                ></path>
                <path
                  id="Vector_3"
                  d="M62.3657 37.9958C63.1205 53.3924 51.3908 65.3832 36.1668 64.7778C20.9428 64.173 7.9893 51.2008 7.23444 35.8041C6.47952 20.4075 18.2091 8.41672 33.4331 9.02194C48.6571 9.62716 61.6103 22.5992 62.3657 37.9958Z"
                  fill="url(#paint2_radial_5179_7940)"
                ></path>
                <path
                  id="Vector_4"
                  opacity="0.5"
                  d="M64.7658 36.195C65.5206 51.5916 53.7908 63.5824 38.5668 62.977C23.3428 62.3722 10.3893 49.4 9.63446 34.0034C8.87954 18.6068 20.6091 6.61594 35.8331 7.22116C51.0571 7.82638 64.0104 20.7984 64.7658 36.195Z"
                  fill="url(#paint3_radial_5179_7940)"
                ></path>
                <path
                  id="Vector_5"
                  opacity="0.6"
                  d="M36.9 60.6C48.6636 60.6 58.2 51.0637 58.2 39.3C58.2 27.5363 48.6636 18 36.9 18C25.1363 18 15.6 27.5363 15.6 39.3C15.6 51.0637 25.1363 60.6 36.9 60.6Z"
                  fill="url(#paint4_radial_5179_7940)"
                ></path>
                <path
                  id="Vector_6"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39.0849 42.2727L46.3387 35.76L48.8945 38.5142L38.9118 47.477L37.8466 48.4333L36.6071 47.477L24.9899 38.5142L27.0434 35.76L35.4849 42.2727L33.6 21.6016H37.2L39.0849 42.2727Z"
                  fill="url(#paint5_radial_5179_7940)"
                ></path>
                <path
                  id="Vector_7"
                  opacity="0.4"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M61.6566 34.9618C61.7832 35.3893 62.391 35.3233 62.3694 34.878C61.6962 21.1369 50.1509 9.55975 36.5817 9.01957C34.4606 8.93515 32.4155 9.12541 30.4772 9.55909C30.0745 9.64915 30.1575 10.2082 30.5697 10.2246C45.0094 10.7979 57.6246 21.2971 61.6566 34.9618Z"
                  fill="url(#paint6_radial_5179_7940)"
                ></path>
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(36.0001 36.1837) rotate(-90) scale(34.3829)"
                >
                  <stop offset="0.782019" stop-color="#982DBE"></stop>
                  <stop
                    offset="0.906819"
                    stop-color="#B038DC"
                    stop-opacity="0.2"
                  ></stop>
                  <stop offset="1" stop-color="#E4A1FA" stop-opacity="0"></stop>
                </radialGradient>
                <radialGradient
                  id="paint1_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(52.9937 20.0992) rotate(135) scale(49.9836)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                  <stop offset="0.666667" stop-color="#F89DC6"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
                <radialGradient
                  id="paint2_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(52.7999 19.6937) rotate(135) scale(53.1037)"
                >
                  <stop stop-color="#FFA984"></stop>
                  <stop offset="0.333333" stop-color="#FF787F"></stop>
                  <stop offset="0.666667" stop-color="#F45FA2"></stop>
                  <stop offset="1" stop-color="#C44AF1"></stop>
                </radialGradient>
                <radialGradient
                  id="paint3_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(52.9937 20.0992) rotate(135) scale(49.9836)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                  <stop offset="0.666667" stop-color="#F89DC6"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
                <radialGradient
                  id="paint4_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(36.9 39.3) scale(21.3)"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                </radialGradient>
                <radialGradient
                  id="paint5_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(31.2 32.1016) rotate(39.5226) scale(15.5567)"
                >
                  <stop stop-color="#EF7744"></stop>
                  <stop offset="0.2406" stop-color="#E50914"></stop>
                  <stop offset="1" stop-color="#792A95"></stop>
                </radialGradient>
                <radialGradient
                  id="paint6_radial_5179_7940"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(50.7 21.3) rotate(-180) scale(30)"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div
          class="relative xl:rounded-br-3xl rounded-3xl bg-[linear-gradient(to_top_left,rgba(255,153,0,0.6)_0%,rgba(229,9,20,0.6)_20%,rgba(14,27,79,0.6)_77%,rgba(0,4,19,0.6)_100%)] xl:w-full h-80 px-5 py-5 transition-all duration-900 animate-fade-up md:mr-2.5"
        >
          <div class="space-y-3 transition-all duration-900 animate-fade-up">
            <h1
              class="font-[Gilroy-Bold] text-2xl transition-all duration-900 animate-fade-up"
            >
              Explore beyond the obvious
            </h1>
            <p
              class="font-[Gilroy-Medium] text-white/60 transition-all duration-900 animate-fade-up"
            >
              Go deeper than trending titles with smart discovery that surfaces
              hidden gems and overlooked picks.
            </p>
          </div>
          <div
            class="absolute right-0 bottom-0 mb-5 mr-7 transition-all duration-900 animate-fade-up"
          >
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <g id="telescope-core-small">
                <path
                  id="Vector"
                  d="M24.0492 36.6016L33.6 46.3898L17.8029 56.8633C17.8029 56.8633 15.8891 57.6983 13.625 55.2638C11.361 52.8293 12.1235 51.238 12.1235 51.238L24.0492 36.6016Z"
                  fill="url(#paint0_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_2"
                  d="M25.0344 34.1992L36 46.151L25.0616 53.8043C25.0616 53.8043 21.8289 55.0984 18.0987 51.0172C14.3686 46.9358 15.9198 44.5105 15.9198 44.5105L25.0344 34.1992Z"
                  fill="url(#paint1_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_3"
                  d="M39 13.0195L59.1 33.6788L32.5325 50.4142C32.5325 50.4142 28.7459 50.2552 24.3978 45.4897C20.0498 40.7243 21.4096 35.8101 21.4096 35.8101L39 13.0195Z"
                  fill="url(#paint2_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_4"
                  d="M57.6709 15.3516C63.1044 21.2807 63.9858 29.2883 59.6386 33.2371C55.2916 37.186 47.3628 35.5806 41.9292 29.6515C36.4954 23.7224 35.6145 15.7148 39.9615 11.766C44.3084 7.81716 52.2372 9.42252 57.6709 15.3516Z"
                  fill="url(#paint3_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_5"
                  d="M58.3787 31.255C54.8121 34.5032 48.2143 33.0817 43.6421 28.0798C39.07 23.078 38.2547 16.39 41.8213 13.1419C45.3879 9.89364 51.9857 11.3152 56.5579 16.3171C61.1298 21.3189 61.9452 28.0069 58.3787 31.255Z"
                  fill="url(#paint4_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_6"
                  opacity="0.85"
                  d="M59.6783 28.823C60.576 24.1785 59.6544 20.5934 56.1603 16.6199C52.6662 12.6464 47.3508 10.8657 43.7796 12.7598C39.371 15.098 48.3734 13.5961 53.4577 19.5815C57.8259 24.724 58.8516 33.1009 59.6783 28.823Z"
                  fill="url(#paint5_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_7"
                  opacity="0.4"
                  d="M50.3979 25.2452C50.4549 26.7239 49.2932 27.7677 47.8032 27.5766C46.3131 27.3856 45.059 26.032 45.002 24.5532C44.945 23.0745 46.1067 22.0307 47.5968 22.2218C49.0868 22.4128 50.341 23.7664 50.3979 25.2452Z"
                  fill="url(#paint6_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_8"
                  opacity="0.6"
                  d="M36.9217 21.0039L26.4258 34.3627C26.3297 36.4604 28.2903 39.5534 30.0334 40.8344L41.2345 29.9105C39.6 28.2005 36.9591 24.1025 36.9217 21.0039Z"
                  fill="url(#paint7_radial_5179_1664)"
                ></path>
                <path
                  id="Vector_9"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.0576 9.60156L21.479 11.7187L24 11.0654L22.3575 13.0272L23.7789 15.1444L21.3424 14.2397L19.7 16.2016L19.8365 13.6806L17.4 12.7759L19.9209 12.1225L20.0576 9.60156ZM58.776 52.8016L58.9623 56.4685L62.4 57.4188L59.0774 58.7347L59.2637 62.4016L57.0239 59.548L53.7014 60.8638L55.6397 57.7843L53.4 54.9307L56.8377 55.8811L58.776 52.8016ZM15.206 24.2101L15.8768 21.0016L13.4793 23.1964L10.6853 21.5563L11.9975 24.553L9.59998 26.7478L12.8085 26.405L14.1207 29.4016L14.7915 26.1931L18 25.8502L15.206 24.2101Z"
                  fill="url(#paint8_linear_5179_1664)"
                ></path>
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(36.6875 32.7016) rotate(135) scale(34.9134)"
                >
                  <stop stop-color="#99421D"></stop>
                  <stop offset="0.333333" stop-color="#99161D"></stop>
                  <stop offset="0.666667" stop-color="#7D1845"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <radialGradient
                  id="paint1_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(42.5937 27.2992) rotate(135) scale(44.5477 44.5279)"
                >
                  <stop stop-color="#EF7744"></stop>
                  <stop offset="0.333333" stop-color="#E50914"></stop>
                  <stop offset="0.666667" stop-color="#A70D53"></stop>
                  <stop offset="1" stop-color="#792A95"></stop>
                </radialGradient>
                <radialGradient
                  id="paint2_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(42.3 29.106) rotate(135) scale(31.8127)"
                >
                  <stop stop-color="#FB540D"></stop>
                  <stop offset="0.333333" stop-color="#E50914"></stop>
                  <stop offset="0.666667" stop-color="#A70D53"></stop>
                  <stop offset="1" stop-color="#792A95"></stop>
                </radialGradient>
                <radialGradient
                  id="paint3_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(57.675 14.7078) rotate(134.326) scale(24.0433 24.0367)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                  <stop offset="0.666667" stop-color="#F89DC6"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
                <radialGradient
                  id="paint4_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(52.1305 21.273) rotate(141.875) scale(9.87138 12.8159)"
                >
                  <stop offset="0.307292" stop-color="#F89DC6"></stop>
                  <stop offset="0.645392" stop-color="#E75094"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <radialGradient
                  id="paint5_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(55.8 15.6) rotate(135) scale(13.1522)"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                </radialGradient>
                <radialGradient
                  id="paint6_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(49.2362 22.9648) rotate(131.079) scale(5.08644 6.006)"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                </radialGradient>
                <radialGradient
                  id="paint7_radial_5179_1664"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(36.8758 29.1353) rotate(137.622) scale(13.5764)"
                >
                  <stop stop-color="#FFA984"></stop>
                  <stop offset="1" stop-color="#F7636B" stop-opacity="0"></stop>
                </radialGradient>
                <linearGradient
                  id="paint8_linear_5179_1664"
                  x1="44.65"
                  y1="27.9016"
                  x2="24.25"
                  y2="48.3016"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#EF7744"></stop>
                  <stop offset="0.333333" stop-color="#E50914"></stop>
                  <stop offset="0.666667" stop-color="#A70D53"></stop>
                  <stop offset="1" stop-color="#792A95"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div
          class="relative xl:rounded-br-3xl rounded-3xl bg-[linear-gradient(to_top_left,rgba(255,153,0,0.6)_0%,rgba(229,9,20,0.6)_20%,rgba(14,27,79,0.6)_77%,rgba(0,4,19,0.6)_100%)] xl:w-full h-80 px-5 py-5 transition-all duration-900 animate-fade-up md:ml-2.5"
        >
          <div class="space-y-3 transition-all duration-900 animate-fade-up">
            <h1
              class="font-[Gilroy-Bold] text-2xl transition-all duration-900 animate-fade-up"
            >
              Build your watchlist with purpose
            </h1>
            <p
              class="font-[Gilroy-Medium] text-white/60 transition-all duration-900 animate-fade-up"
            >
              Save movies and shows you discover so you always have a curated
              list ready when it’s time to watch.
            </p>
          </div>
          <div
            class="absolute right-0 bottom-0 mb-5 mr-8 transition-all duration-900 animate-fade-up"
          >
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <g id="profiles-core-small">
                <path
                  id="Vector"
                  d="M10.8 15.6008C10.8 12.9499 12.949 10.8008 15.5999 10.8008H40.8C43.4509 10.8008 45.6 12.9498 45.6 15.6008V40.8007C45.6 43.4516 43.4509 45.6007 40.8 45.6007H15.6C12.949 45.6007 10.8 43.4517 10.8 40.8007V15.6008Z"
                  fill="url(#paint0_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_2"
                  d="M9.59998 14.4016C9.59998 11.7506 11.749 9.60162 14.4 9.60156H39.6C42.251 9.60156 44.4 11.7506 44.4 14.4016V39.6015C44.4 42.2525 42.251 44.4015 39.6 44.4015H14.4C11.749 44.4016 9.59998 42.2525 9.59998 39.6015V14.4016Z"
                  fill="url(#paint1_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_3"
                  d="M18.6 21.9008C18.6 23.0606 17.6598 24.0008 16.5 24.0008C15.3402 24.0008 14.4 23.0606 14.4 21.9008C14.4 20.741 15.3402 19.8008 16.5 19.8008C17.6598 19.8008 18.6 20.741 18.6 21.9008Z"
                  fill="url(#paint2_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_4"
                  d="M39.6 21.9008C39.6 23.0606 38.6598 24.0008 37.5 24.0008C36.3402 24.0008 35.4 23.0606 35.4 21.9008C35.4 20.741 36.3402 19.8008 37.5 19.8008C38.6598 19.8008 39.6 20.741 39.6 21.9008Z"
                  fill="url(#paint3_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_5"
                  d="M23.6713 29.4501C23.2437 29.1967 22.6917 29.3379 22.4383 29.7655C22.1848 30.1932 22.3261 30.7452 22.7537 30.9986C23.8254 31.6337 26.769 32.7744 30.6375 32.7744C34.506 32.7744 37.4497 31.6337 38.5213 30.9986C38.949 30.7452 39.0902 30.1932 38.8368 29.7655C38.5834 29.3379 38.0313 29.1967 37.6037 29.4501C36.8191 29.9151 34.194 30.9744 30.6375 30.9744C27.081 30.9744 24.456 29.9151 23.6713 29.4501Z"
                  fill="url(#paint4_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_6"
                  opacity="0.35"
                  d="M19.2 44.4016H28.2L32.4 27.6016C30.2787 28.1801 28.4542 29.5387 27.2921 31.4053L19.2 44.4016Z"
                  fill="url(#paint5_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_7"
                  d="M27.6 32.4016C27.6 29.7506 29.749 27.6016 32.4 27.6016L57.6 27.6016C60.2508 27.6016 62.4 29.7506 62.4 32.4016V57.6015C62.4 60.2524 60.2508 62.4016 57.6 62.4016H32.4C29.749 62.4016 27.6 60.2524 27.6 57.6016V32.4016Z"
                  fill="url(#paint6_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_8"
                  d="M36.6 39.9008C36.6 41.0606 35.6598 42.0008 34.5 42.0008C33.3402 42.0008 32.4 41.0606 32.4 39.9008C32.4 38.741 33.3402 37.8008 34.5 37.8008C35.6598 37.8008 36.6 38.741 36.6 39.9008Z"
                  fill="url(#paint7_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_9"
                  d="M57.6 39.9008C57.6 41.0606 56.6598 42.0008 55.5 42.0008C54.3402 42.0008 53.4 41.0606 53.4 39.9008C53.4 38.741 54.3402 37.8008 55.5 37.8008C56.6598 37.8008 57.6 38.741 57.6 39.9008Z"
                  fill="url(#paint8_radial_5179_7919)"
                ></path>
                <path
                  id="Vector_10"
                  d="M41.8213 47.6025C41.3937 47.349 40.8416 47.4903 40.5882 47.9179C40.3348 48.3455 40.476 48.8976 40.9037 49.1509C41.9753 49.786 44.919 50.9267 48.7875 50.9267C52.656 50.9267 55.5996 49.786 56.6713 49.1509C57.0989 48.8976 57.2402 48.3455 56.9867 47.9179C56.7333 47.4903 56.1813 47.349 55.7537 47.6025C54.969 48.0674 52.344 49.1267 48.7875 49.1267C45.231 49.1267 42.6059 48.0674 41.8213 47.6025Z"
                  fill="url(#paint9_radial_5179_7919)"
                ></path>
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(39.075 17.6882) rotate(135) scale(32.8097)"
                >
                  <stop stop-color="#99421D"></stop>
                  <stop offset="0.333333" stop-color="#99161D"></stop>
                  <stop offset="0.666667" stop-color="#7D1845"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <radialGradient
                  id="paint1_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(62.4 8.70157) rotate(133.87) scale(75.3216)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                  <stop offset="0.666667" stop-color="#F89DC6"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
                <radialGradient
                  id="paint2_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(60.3 11.1008) rotate(133.939) scale(68.7426 55.9547)"
                >
                  <stop stop-color="#99421D"></stop>
                  <stop offset="0.333333" stop-color="#99161D"></stop>
                  <stop offset="0.666667" stop-color="#7D1845"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <radialGradient
                  id="paint3_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(60.3 11.1008) rotate(133.939) scale(68.7426 55.9547)"
                >
                  <stop stop-color="#99421D"></stop>
                  <stop offset="0.333333" stop-color="#99161D"></stop>
                  <stop offset="0.666667" stop-color="#7D1845"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <radialGradient
                  id="paint4_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(60.3 11.0994) rotate(133.939) scale(68.7426 55.9548)"
                >
                  <stop stop-color="#99421D"></stop>
                  <stop offset="0.333333" stop-color="#99161D"></stop>
                  <stop offset="0.666667" stop-color="#7D1845"></stop>
                  <stop offset="1" stop-color="#59216E"></stop>
                </radialGradient>
                <radialGradient
                  id="paint5_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(39.6 27.9016) rotate(135) scale(23.3345)"
                >
                  <stop stop-color="#FFA984"></stop>
                  <stop offset="0.333333" stop-color="#FF787F"></stop>
                  <stop offset="0.666667" stop-color="#F45FA2"></stop>
                  <stop offset="1" stop-color="#C44AF1"></stop>
                </radialGradient>
                <radialGradient
                  id="paint6_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(61.8 29.7016) rotate(135) scale(43.2749)"
                >
                  <stop stop-color="#EF7744"></stop>
                  <stop offset="0.333333" stop-color="#E50914"></stop>
                  <stop offset="0.666667" stop-color="#A70D53"></stop>
                  <stop offset="1" stop-color="#792A95"></stop>
                </radialGradient>
                <radialGradient
                  id="paint7_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(62.1 11.1008) rotate(137.146) scale(73.6614 60.3576)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FDF6F6"></stop>
                  <stop offset="0.666667" stop-color="#FADCE9"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
                <radialGradient
                  id="paint8_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(62.1 11.1008) rotate(137.146) scale(73.6614 60.3576)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FDF6F6"></stop>
                  <stop offset="0.666667" stop-color="#FADCE9"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
                <radialGradient
                  id="paint9_radial_5179_7919"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(62.1 11.1017) rotate(137.146) scale(73.6614 60.3576)"
                >
                  <stop stop-color="#FFDCCC"></stop>
                  <stop offset="0.333333" stop-color="#FDF6F6"></stop>
                  <stop offset="0.666667" stop-color="#FADCE9"></stop>
                  <stop offset="1" stop-color="#E4A1FA"></stop>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div
      class="space-y-5 text-white transition-all duration-900 animate-fade-up"
    >
      <h1
        class="font-[Gilroy-Bold] text-2xl xl:text-3xl flex transition-all duration-900 animate-fade-up"
      >
        Frequently Asked Question
      </h1>
      <div class="" v-for="(faq, index) in faqs" :key="id">
        <div class="space-y-0.5 transition-all duration-900 animate-fade-up">
          <button
            ref="initialFocus"
            @click="toggle(index)"
            class="font-[Gilroy-Medium] cursor-pointer flex relative w-full h-fit justify-between place-items-center px-5 bg-white/20 hover:bg-white/40 py-7 transition-all duration-900 animate-fade-up text-xl md:text-2xl"
          >
            <h1 class="text-nowrap">{{ faq.question }}</h1>
            <span @click="openFAQ">
              <svg
                v-if="activeIndex !== index"
                viewBox="0 0 36 36"
                width="36"
                height="36"
                data-icon="PlusLarge"
                data-icon-id=":r38:"
                aria-hidden="true"
                class="default-ltr-iqcdef-cache-1ulhx3w e164gv2o4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                role="img"
                loading="lazy"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                v-else
                viewBox="0 0 36 36"
                width="36"
                height="36"
                data-icon="PlusLarge"
                data-icon-id=":r9:"
                aria-hidden="true"
                class="tramsform -rotate-45"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                role="img"
                loading="lazy"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
          <transition :duration="550" name="nested">
            <div
              v-if="activeIndex === index"
              class="relative px-5 py-3 space-y-3 w-full font-[Gilroy-Medium] text-xl md:text-2xl bg-white/20 leading-10 transition-all duration-900 animate-fade outer"
            >
              <p class="transition-all duration-900 animate-fade-up inner">
                {{ faq.answer1 }}
              </p>
              <p
                class="max-w-6xl transition-all duration-900 animate-fade-up inner"
              >
                {{ faq.answer2 }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div
      class="text-white space-y-5 flex flex-col transition-all duration-900 animate-fade-up items-center"
    >
      <h1 class="text-[Gilroy-SemiBold] text-lg text-center md:text-xl">
        Ready to watch? Enter your email to create or restart your membership.
      </h1>
      <div class="grid">
        <div class="grid md:flex gap-3 place-items-center">
          <div class="relative md:w-96">
            <input
              v-model="email"
              id="emailInput"
              type="email"
              autocomplete="email"
              placeholder=" "
              :class="[
                'peer w-50 md:w-full border border-[#808080] bg-black/50 text-white rounded-sm caret-white px-3 pt-5 pb-2 min-w-80 md:min-w-96 font-[Gilroy-Medium]',
                'focus:outline-none focus:ring-2 text-base transition-all',
                ringColor,
              ]"
            />
            <label
              for="emailInput"
              :class="[
                'absolute left-3 font-[Gilroy-Medium] transition-all slide-fade-enter-active',
                email
                  ? 'top-2 text-xs text-[#BDBCBB] pl-0.5'
                  : 'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400',
                'peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#BDBCBB] peer-focus:pl-0.5',
              ]"
            >
              Email address
            </label>

            <div class="md:hidden">
              <p
                v-if="showError"
                class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 flex items-center"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <button
            ref="initialFocus"
            @click="handleGetStarted"
            class="gap-3 bg-[#b20710] text-white font-[Gilroy-Bold] md:text-2xl px-6 py-4 md:py-3 rounded-sm hover:bg-[#e32125] group transition-all duration-500 cursor-pointer flex items-center justify-center"
          >
            Sign In
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 group-hover:animate-pulse"
            >
              <path
                fill-rule="evenodd"
                d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 0 0 1.06l1.72 1.72H2.25a.75.75 0 0 0 0 1.5h10.94l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div class="hidden md:flex">
          <p
            v-if="showError"
            class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 flex items-center"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import TrendingGrid from "../media/TrendingGrid.vue";
import { useRouter } from "vue-router";

const faqs = [
  {
    id: 1,
    question: `What is FilmRitz?`,
    answer1: `FilmRitz is a movie and TV show discovery platform that helps you explore titles, track what you watch, and find new content across different genres.`,
    answer2: `It is designed to be simple, fast, and accessible, making it easier for users to discover movies and shows they will enjoy.`,
  },
  {
    id: 2,
    question: `How much does FilmRitz cost?`,
    answer1: `FilmRitz is completely free to use. There are no costs, subscriptions, or hidden fees at this stage.`,
  },
  {
    id: 3,
    question: `Where can I access FilmRitz?`,
    answer1: `You can access FilmRitz on any web browser via your computer, smartphone, or tablet. Apps for smart TVs and other devices may be added in the future as the platform grows.`,
  },
  {
    id: 4,
    question: `Can I contribute to FilmRitz?`,
    answer1: `Yes! FilmRitz welcomes programmers, designers, and media enthusiasts to contribute. Your contributions can help improve the platform and prepare it for its next stage as a unified media hub.`,
    answer2: `To get involved or share feedback, you can contact the project creator directly through all links available here: https://linktr.ee/emanncode`,
  },
  {
    id: 5,
    question: `What can I explore on FilmRitz?`,
    answer1: `Discover movies, TV shows, and anime by genre, popularity, release date, or personalized suggestions. Track your favorites and explore new content easily.`,
  },
  {
    id: 6,
    question: `Is FilmRitz safe for kids?`,
    answer1: `FilmRitz allows users to create a safe viewing experience with family-friendly options. Parents can guide what their kids see while exploring content.`,
  },
  {
    id: 7,
    question: `How can I support FilmRitz?`,
    answer1: `You can support FilmRitz by contributing your skills as a programmer or designer, sharing feedback, or financially supporting the project to help it evolve into a unified media platform.`,
    answer2: `All contact and support links are available here: https://linktr.ee/emanncode`,
  },
  {
    id: 8,
    question: `Will FilmRitz have new features?`,
    answer1: `New features will be added as the platform evolves into a full unified media platform. For now, FilmRitz focuses on providing a smooth and efficient movie and TV show discovery experience.`,
  },
];
const email = ref("");
const router = useRouter();
const touched = ref(false);

const activeIndex = ref(null);
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const ringColor = computed(() => {
  if (email.value === "") return "focus:ring-[#BDBCBB]";
  return isValidEmail(email.value)
    ? "focus:ring-green-500"
    : "focus:ring-red-500";
});

const showError = computed(() => {
  if (!touched.value && email.value === "") return false;
  return !isValidEmail(email.value);
});

const errorMessage = computed(() => {
  if (email.value === "") return "Email is required.";
  return "Please enter a valid email address.";
});

defineProps({
  id: {
    type: [String, Number],
    required: false,
  },
});

function toggle(index) {
  activeIndex.value = activeIndex.value === index ? null : index;
}

function handleGetStarted() {
  touched.value = true;
  if (isValidEmail(email.value)) {
    // ✅ Save email for auto-fill later
    localStorage.setItem("prefillEmail", email.value);
    router.push({ path: "/ng/login" });
  }
}
</script>

<style>
/* Only animate the opening */
.nested-enter-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

/* No transition for closing */
.nested-leave-active {
  transition: none;
  overflow: hidden;
}

/* Start and end states */
.nested-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}

.nested-enter-to {
  max-height: 384px;
  /* Adjust to match your content */
  opacity: 1;
  transform: translateY(0);
}

/* Close instantly */
.nested-leave-from {
  max-height: 384px;
  opacity: 1;
  transform: translateY(0);
}

.nested-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Inner element still smooth on open only */
.nested-enter-active .inner {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.nested-leave-active .inner {
  transition: none;
}

.nested-enter-from .inner {
  opacity: 0;
  transform: translateX(20px);
}

.nested-enter-to .inner {
  opacity: 1;
  transform: translateX(0);
}
</style>
