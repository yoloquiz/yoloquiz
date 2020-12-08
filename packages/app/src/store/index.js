import { createStore } from 'vuex';

import auth from '@/modules/auth/auth.store';
import quizzes from '@/modules/quizzes/quizzes.store';

export default createStore({
  modules: {
    auth,
    quizzes,
  },
});
