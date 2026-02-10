import api from './axios-instance';

export class StoreService {
  static list(params?: any) {
    return api.get('/stores', { params });
  }

  static add(data: any) {
    return api.post('/stores', data);
  }

  static edit(id: string, data: any) {
    return api.put(`/stores/${id}`, data);
  }

  static delete(id: string) {
    return api.delete(`/stores/${id}`);
  }
}
