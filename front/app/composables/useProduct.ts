export default () => {
  const endpoint = "products";
  const api = useRestAPI<Product>(endpoint);

  return {
    all: async (query: Ref<Record<string, any>> = ref({})) => {
      const { data, status, refresh, error } = await api.all(query);
      if (error.value) {
        throw createError({
          statusCode: error.value.statusCode,
          statusMessage: error.value.data.message,
          fatal: true,
        });
      }

      return {
        data,
        status,
        refresh,
        error,
      };
    },
    show: async (id: number) => {
      const { data, error, status } = await api.one(id);
      if (error.value) {
        throw createError({
          statusCode: error.value.statusCode,
          statusMessage: error.value.data.message,
          fatal: true,
        });
      }
      return { data, status };
    },
    create: async (body: Product) => await api.create(body),
    update: async (id: number, body: Product) => await api.update(id, body),
    destroy: async (id: number) => await api.destroy(id),
  };
};
