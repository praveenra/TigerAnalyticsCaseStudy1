import api from './axios-instance';

export class AuthService {
  static register(data: any) {
    return api.post('/auth/register', data);
  }

  static login(data: any) {
    return api.post('/auth/login', data).then(res => {
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user', res.data.userName);
      return res;
    });
  }

  static refreshToken() {
    return api.post('/auth/refresh-token').then(res => {
    //   localStorage.getItem('refreshToken', res.data.refreshToken);
      return res;
    });
  }

  static logout() {
    return api.post('/auth/logout').then(() => {
      localStorage.removeItem('access_token');
    });
  }
}
