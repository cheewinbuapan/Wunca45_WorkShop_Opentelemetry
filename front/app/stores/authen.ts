import { useJwt } from "@vueuse/integrations/useJwt";

interface ListModel {
  user: Me | null;
  loggedIn: boolean;
}

const endpoint = "auth";

export const authen = defineStore("authen", {
  state: () => {
    return {
      user: null,
      loggedIn: false,
    } as ListModel;
  },
  actions: {
    isAdmin() {
      return this.user?.role === "Admin";
    },
    loginAdmin(token: string) {
      setToken(token);
    },
    async login(body: Login) {
      const {
        error,
        data,
        status,
        execute: login,
      } = await useIFetch<Token>(`${endpoint}/login`, {
        method: "POST",
        body,
        immediate: false,
        watch: false,
      });

      const onLoggedIn = () => {
        if (data.value) {
          setToken(data.value.token!);
        }
      };
      watch(data, onLoggedIn);

      return {
        error,
        status,
        login,
      };
    },
    async signup(body: Signup) {
      const {
        data,
        error,
        status,
        execute: signup,
      } = await useIFetch<Token>(`${endpoint}/register`, {
        method: "POST",
        body,
        immediate: false,
        watch: false,
      });

      return {
        data,
        error,
        status,
        signup,
      };
    },
    async getUser() {
      if (!this.loggedIn) {
        if (hasToken()) {
          await fetchApiUser();
          if (this.user) {
            this.loggedIn = true;
          }
        }
      }
    },
    async fetchUser() {
      if (this.loggedIn) {
        await fetchApiUser();
      }
    },
    async logout() {
      setToken(null);
      this.user = null;
      this.loggedIn = false;
    },
  },
});

const getToken = () => {
  const jwt = useCookie("jwt");
  return { jwt };
};
const hasToken = (): boolean => {
  const { jwt } = getToken();
  return !!jwt.value;
};
const setToken = (newToken: string | null) => {
  const { jwt } = getToken();
  jwt.value = newToken;
};

const fetchApiUser = async () => {
  const { jwt } = getToken();
  const { payload } = useJwt(jwt.value!);
  const auth = authen();
  auth.user = {
    username: (payload.value as any).username,
    fullName: (payload.value as any).fullName || "",
    phone: (payload.value as any).phone || "",
    role: (payload.value as any).role,
  };
};
