interface SidebarModel {
  init: boolean;
  initBack: boolean;
  // setting: Setting | null;
}
export const apiRefs = defineStore("apiRefs", {
  state: () => {
    return {
      init: false,
      initBack: false,
      // setting: null,
    } as SidebarModel;
  },
  actions: {
    async initialize() {
      if (!this.init) {
        this.update();
      }
    },
    async initializeBack() {
      if (!this.initBack) {
        this.updateBack();
      }
    },
    async update() {
      // const [setting] = await Promise.all([
      //   useSetting(),
      // ]);
      // if (setting.data.value) {
      //   this.setting = setting.data.value;
      // }
      this.init = true;
    },
    async updateBack() {
      this.initBack = true;
    },
  },
});
