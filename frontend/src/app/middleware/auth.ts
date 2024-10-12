import { createListenerMiddleware } from '@reduxjs/toolkit';
import { usersApi } from '../services/usersApi';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: usersApi.endpoints.login.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    if (action.payload.token) {
      localStorage.setItem('token', action.payload.token);
    }
  },
});
