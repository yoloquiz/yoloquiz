import _ from 'lodash-es';
import mitt from 'mitt';
import config from '@/config';

const stateData = {
  gameState: undefined,
  quiz: undefined,
  scoreBoard: undefined,
  activeQuestion: undefined,
  players: undefined,
  correctChoices: undefined,
  playerChoiceId: undefined,
  timer: undefined,
};

export const rx = mitt();
export const tx = mitt();

const getters = {
  isGameAdmin: (state, localGetters, rootState, rootGetters) => {
    if (_.isEmpty(state.players)) return false;

    const userId = rootGetters['auth/getUserId'];

    return _.some(state.players, { userId, isOwner: true });
  },
  isScoreBoardActive: (state) => !_.isEmpty(state.scoreBoard),
  getPlayersScore: (state, localGetters) => {
    if (!localGetters.isScoreBoardActive) return [];
    return _.chain(state.scoreBoard)
      .reduce((playersScore, questionPlayersScore) => {
        return {
          ...playersScore,
          ..._.mapValues(questionPlayersScore, (playerScore, playerId) => {
            const totalPlayerScore = _.get(playersScore, playerId, 0);

            const { isCorrectAnswer, timeToAnswerRatio } = _.defaults(playerScore, {
              isCorrectAnswer: false,
              timeToAnswerRatio: 0,
            });

            if (!isCorrectAnswer) return totalPlayerScore;

            return totalPlayerScore + (1000 - Math.round(timeToAnswerRatio * 1000));
          }),
        };
      }, {})
      .mapValues((score, userId) => {
        const player = _.find(state.players, { userId });
        return {
          ...player,
          score,
        };
      });
  },
  getChoices: (state) => {
    return _.get(state.activeQuestion, 'answers.choices.choices', []);
  },
};

const mutations = {
  reset(state) {
    rx.all.clear();
    tx.all.clear();

    state.gameState = undefined;
    state.scoreBoard = undefined;
    state.quiz = undefined;
    state.activeQuestion = undefined;
    state.players = undefined;
    state.correctChoices = undefined;
    state.playerChoiceId = undefined;
    state.timer = undefined;
  },
  setQuiz(state, quiz) {
    state.quiz = quiz;
  },
  setPlayers(state, players) {
    state.players = players;
  },
  setGameState(state, gameState) {
    state.gameState = gameState;
  },
  removePlayer(state, player) {
    state.players = state.players.filter(({ userId }) => userId !== player.userId);
  },
  addPlayer(state, player) {
    state.players.push(player);
  },
  setActiveQuestion(state, question) {
    state.correctChoices = undefined;
    state.scoreBoard = undefined;
    state.activeQuestion = question;
  },
  setCorrectChoices(state, correctChoices) {
    state.correctChoices = correctChoices;
  },
  setPlayerChoiceId(state, playerChoiceId) {
    state.playerChoiceId = playerChoiceId;
  },
  setScoreBoard(state, scoreBoard) {
    state.scoreBoard = scoreBoard;
  },
  setTimer(state, timer) {
    state.timer = timer;
  },
};

function handleMessage(event) {
  try {
    const { name, payload } = JSON.parse(event.data);

    rx.emit(name, payload);
  } catch (error) {
    console.error(error);
  }
}

const actions = {
  initSocketConnection({ commit, dispatch, rootGetters }, { roomId }) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${config.socketUrl}/games/${roomId}?token=${rootGetters['auth/getAccessToken']}`);

      ws.onmessage = handleMessage;
      ws.onclose = resolve;
      ws.onerror = reject;

      tx.on('*', (name, payload) => ws.send(JSON.stringify({ name, payload })));
      rx.on('quiz-data', (quiz) => commit('setQuiz', quiz));
      rx.on('user-list', (players) => commit('setPlayers', players));
      rx.on('user-left', (playerLeft) => commit('removePlayer', playerLeft));
      rx.on('user-joined', (playerJoined) => commit('addPlayer', playerJoined));
      rx.on('game-state', (gameState) => commit('setGameState', gameState));
      rx.on('game-next-question', (question) => commit('setActiveQuestion', question));
      rx.on('game-question-answers', (correctChoices) => commit('setCorrectChoices', correctChoices));
      rx.on('game-show-score-board', (scoreBoard) => commit('setScoreBoard', scoreBoard));
      rx.on('game-timer', (timer) => dispatch('setupTimer', timer));
    });
  },
  closeSocketConnection({ commit }) {
    commit('reset');
  },
  startGame() {
    tx.emit('game-start');
  },
  sendGameProceed() {
    tx.emit('game-proceed');
  },
  sendChoice({ commit }, choiceId) {
    commit('setPlayerChoiceId', choiceId);
    tx.emit('player-answer', { choiceId });
  },
  setupTimer({ commit }, timer) {
    commit('setTimer', timer);

    setTimeout(() => {
      commit('setTimer', undefined);
    }, timer);
  },
};

export default {
  namespaced: true,
  state: { ...stateData },
  getters,
  mutations,
  actions,
};
