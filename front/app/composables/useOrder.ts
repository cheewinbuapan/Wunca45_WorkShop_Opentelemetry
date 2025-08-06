export default () => {
  const endpoint = "orders";
  const api = useRestAPI<Order>(endpoint);

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
    create: async (body: Order) => await api.create(body),
    update: async (id: number, body: OrderChangeStatus) =>
      await api.update(id, body),
  };
};
