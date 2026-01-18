import {
  ref,
  computed,
  watch,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

export type PaginationMode = "client" | "server";

export type UsePaginationOptions<T = any> = {
  perPage?: number;
  initialPage?: number;
  totalItems?: MaybeRefOrGetter<number>;
  mode?: PaginationMode;
  onPageChange?: (page: number) => void | Promise<void>;
  scrollOnChange?: boolean;
  scrollBehavior?: ScrollBehavior;
  scrollTarget?: string | HTMLElement;
  // Server mode options
  fetchItems?: (page: number, perPage: number) => Promise<T[]>;
  // URL sync
  syncWithUrl?: boolean;
  urlParam?: string;
};

export function usePagination<T>(
  items: MaybeRefOrGetter<T[] | null | undefined>,
  options: UsePaginationOptions<T> = {}
) {
  const {
    perPage: initialPerPage = 20,
    initialPage = 1,
    mode = "client",
    onPageChange,
    scrollOnChange = true,
    scrollBehavior = "smooth",
    scrollTarget,
    fetchItems,
    syncWithUrl = false,
    urlParam = "page",
  } = options;

  // State
  const perPage = ref(initialPerPage);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Initialize from URL if sync is enabled
  const getInitialPage = () => {
    if (syncWithUrl && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlPage = parseInt(params.get(urlParam) || "1");
      return isNaN(urlPage) ? initialPage : urlPage;
    }
    return initialPage;
  };

  const currentPage = ref(getInitialPage());

  // Server mode state - properly typed
  const serverItems: Ref<T[]> = ref([]);

  // Computed
  const totalItems = computed<number>(() => {
    if (options.totalItems !== undefined) {
      return toValue(options.totalItems);
    }
    if (mode === "server") {
      return 0; // Must be provided in server mode
    }
    const arr = toValue(items) ?? [];
    return Array.isArray(arr) ? arr.length : 0;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / perPage.value))
  );

  const pagedItems = computed<T[]>(() => {
    if (mode === "server") {
      return serverItems.value;
    }
    const arr = toValue(items) ?? [];
    if (!Array.isArray(arr)) return [];
    const start = (currentPage.value - 1) * perPage.value;
    return arr.slice(start, start + perPage.value);
  });

  const hasNext = computed(() => currentPage.value < totalPages.value);
  const hasPrev = computed(() => currentPage.value > 1);
  const isFirstPage = computed(() => currentPage.value === 1);
  const isLastPage = computed(() => currentPage.value === totalPages.value);

  const startIndex = computed(() =>
    totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * perPage.value, totalItems.value)
  );

  // Methods
  function scrollToTop() {
    if (!scrollOnChange || typeof window === "undefined") return;

    if (scrollTarget) {
      const element =
        typeof scrollTarget === "string"
          ? document.querySelector(scrollTarget)
          : scrollTarget;
      element?.scrollIntoView({ behavior: scrollBehavior });
    } else {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }

  function updateUrl(page: number) {
    if (!syncWithUrl || typeof window === "undefined") return;

    const url = new URL(window.location.href);
    if (page === 1) {
      url.searchParams.delete(urlParam);
    } else {
      url.searchParams.set(urlParam, page.toString());
    }
    window.history.replaceState({}, "", url.toString());
  }

  async function changePage(page: number, skipScroll = false) {
    if (page < 1 || page > totalPages.value || page === currentPage.value)
      return;

    const previousPage = currentPage.value;
    currentPage.value = page;

    try {
      loading.value = true;
      error.value = null;

      // Server mode: fetch new items
      if (mode === "server" && fetchItems) {
        serverItems.value = await fetchItems(page, perPage.value);
      }

      // Call user callback
      await onPageChange?.(page);

      // Update URL
      updateUrl(page);

      // Scroll
      if (!skipScroll) {
        scrollToTop();
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      currentPage.value = previousPage; // Rollback on error
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function next() {
    if (hasNext.value) await changePage(currentPage.value + 1);
  }

  async function prev() {
    if (hasPrev.value) await changePage(currentPage.value - 1);
  }

  async function goToFirst() {
    await changePage(1);
  }

  async function goToLast() {
    await changePage(totalPages.value);
  }

  function setPerPage(value: number) {
    if (value < 1) return;
    perPage.value = value;
    // Reset to page 1 when changing page size
    if (currentPage.value !== 1) {
      changePage(1);
    }
  }

  function reset() {
    currentPage.value = 1;
    error.value = null;
    if (mode === "server") {
      serverItems.value = [];
    }
  }

  // Watch for total pages changes
  watch(totalPages, (tp) => {
    if (currentPage.value > tp && tp > 0) {
      changePage(Math.max(1, tp), true);
    }
  });

  // Sync URL on page load
  if (syncWithUrl && typeof window !== "undefined") {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlPage = parseInt(params.get(urlParam) || "1");
      if (!isNaN(urlPage) && urlPage !== currentPage.value) {
        changePage(urlPage, true);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup would need to be handled by the component using onUnmounted
  }

  return {
    // State
    perPage,
    currentPage,
    loading,
    error,

    // Computed
    totalItems,
    totalPages,
    pagedItems,
    hasNext,
    hasPrev,
    isFirstPage,
    isLastPage,
    startIndex,
    endIndex,

    // Methods
    changePage,
    next,
    prev,
    goToFirst,
    goToLast,
    setPerPage,
    reset,
  } as const;
}
