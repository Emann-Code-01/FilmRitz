// Mapping of TMDB provider IDs to their website URLs
export const providerUrls: Record<number, string> = {
  2: "https://tv.apple.com", // Apple TV / iTunes
  3: "https://play.google.com/store/movies", // Google Play Movies
  7: "https://www.vudu.com", // Vudu
  8: "https://www.netflix.com", // Netflix
  9: "https://www.amazon.com/primevideo", // Amazon Prime Video
  10: "https://play.google.com/store/movies", // Google Play Movies
  15: "https://www.hulu.com", // Hulu
  34: "https://www.youtube.com", // YouTube Premium
  43: "https://www.starz.com", // Starz
  68: "https://www.microsoft.com/en-us/store/movies-and-tv", // Microsoft Store
  130: "https://www.sky.com", // Sky Go
  144: "https://www.vudu.com", // Vudu
  157: "https://www.nowtv.com", // NOW
  192: "https://www.youtube.com", // YouTube
  203: "https://www.britbox.com", // BritBox
  212: "https://tubitv.com", // Tubi TV
  257: "https://www.fubo.tv", // FuboTV
  283: "https://www.crunchyroll.com", // Crunchyroll
  300: "https://pluto.tv", // Pluto TV
  337: "https://www.disneyplus.com", // Disney Plus
  350: "https://tv.apple.com", // Apple TV Plus
  384: "https://www.hbomax.com", // HBO Max
  386: "https://www.peacocktv.com", // Peacock Premium
  387: "https://www.peacocktv.com", // Peacock
  389: "https://www.nowtvng.com", // Now TV
  526: "https://www.showtime.com", // Showtime
  531: "https://www.paramountplus.com", // Paramount Plus
  582: "https://www.criterion.com", // Criterion Channel
  613: "https://www.tubi.tv", // Tubi
  619: "https://www.hoopladigital.com", // Hoopla
  1771: "https://www.amcplus.com", // AMC+
  1796: "https://www.netflix.com", // Netflix basic with Ads
  1853: "https://www.discoveryplus.com", // Discovery+
  1875: "https://www.mgmplus.com", // MGM+
  1899: "https://www.max.com", // Max
};

export function getProviderUrl(providerId: number): string | null {
  return providerUrls[providerId] || null;
}
