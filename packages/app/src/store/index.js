import { createStore } from 'vuex';

import auth from '@/modules/auth/auth.store';
import quizzes from '@/modules/quizzes/quizzes.store';
import games from '@/modules/games/games.store';

export default createStore({
  modules: {
    auth,
    quizzes,
    games,
  },
});
