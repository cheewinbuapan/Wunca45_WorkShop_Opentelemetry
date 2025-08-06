interface BreadcrumbsModel {
  items: NavigationLinkItem[];
}

export const breadcrumbs = defineStore("breadcrumbs", {
  state: () => {
    return {
      items: [],
    } as BreadcrumbsModel;
  },
  actions: {
    setItems(payload: NavigationLinkItem[]) {
      this.items = payload;
    },
    appends(payload: NavigationLinkItem[]) {
      this.items = [...this.items, ...payload];
    },
    replaceLast(payload: NavigationLinkItem) {
      if (this.hasItem()) {
        this.items[this.items.length - 1] = payload;
      } else {
        this.items.push(payload);
      }
    },
    hasItem() {
      return this.items.length > 0;
    },
    lastItem() {
      return this.hasItem() ? this.items[this.items.length - 1] : null;
    },
    hasBackground() {
      return this.hasItem() && this.lastItem()?.background;
    },
    clear() {
      this.items = [];
    },
  },
});
