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

export const game = {
  rx: mitt(),
  tx: mitt(),
  ws: undefined,
};

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
    if (game.ws instanceof WebSocket) {
      game.ws.close();
      game.ws = undefined;
    }

    game.rx.all.clear();
    game.tx.all.clear();

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

    game.rx.emit(name, payload);
  } catch (error) {
    console.error(error);
  }
}

const actions = {
  initSocketConnection({ commit, dispatch, rootGetters }, { roomId }) {
    return new Promise((resolve, reject) => {
      game.ws = new WebSocket(`${config.socketUrl}/games/${roomId}?token=${rootGetters['auth/getAccessToken']}`);

      game.ws.onmessage = handleMessage;
      game.ws.onclose = resolve;
      game.ws.onerror = reject;

      game.tx.on('*', (name, payload) => game.ws.send(JSON.stringify({ name, payload })));
      game.rx.on('quiz-data', (quiz) => commit('setQuiz', quiz));
      game.rx.on('user-list', (players) => commit('setPlayers', players));
      game.rx.on('user-left', (playerLeft) => commit('removePlayer', playerLeft));
      game.rx.on('user-joined', (playerJoined) => commit('addPlayer', playerJoined));
      game.rx.on('game-state', (gameState) => commit('setGameState', gameState));
      game.rx.on('game-next-question', (question) => commit('setActiveQuestion', question));
      game.rx.on('game-question-answers', (correctChoices) => commit('setCorrectChoices', correctChoices));
      game.rx.on('game-show-score-board', (scoreBoard) => commit('setScoreBoard', scoreBoard));
      game.rx.on('game-timer', (timer) => dispatch('setupTimer', timer));
    });
  },
  closeSocketConnection({ commit }) {
    commit('reset');
  },
  startGame() {
    game.tx.emit('game-start');
  },
  sendGameProceed() {
    game.tx.emit('game-proceed');
  },
  sendChoice({ commit }, choiceId) {
    commit('setPlayerChoiceId', choiceId);
    game.tx.emit('player-answer', { choiceId });
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
