import api from "../api";

const pipelineService = {
  getAll: async () => {
    const res = await api.get("/pipeline");
    return res.data;
  },
  getStages: async () => {
    const res = await api.get("/pipeline/stages");
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post("/pipeline", data);
    return res.data.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/pipeline/${id}`, data);
    return res.data.data;
  },
  move: async (id, stageId) => {
    const res = await api.put(`/pipeline/${id}/move`, { stageId });
    return res.data;
  },
  advance: async (id) => {
    const res = await api.put(`/pipeline/${id}/advance`);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/pipeline/${id}`);
    return res.data;
  },
};

export default pipelineService;
