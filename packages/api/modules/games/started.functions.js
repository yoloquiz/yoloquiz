import _ from 'lodash';
import { filter, map, scan, take, withLatestFrom } from 'rxjs/operators/index.js';
import { getOwnerMessage$ } from './games.functions.js';
import { messageType } from './messages.constants.js';

export function createNextQuestionMessage({ question }) {
  const choices = _.chain(question)
    .get('answers.choices.choices', [])
    .map((choice) => _.omit(choice, 'isCorrectAnswer'))
    .value();

  return {
    name: messageType.gameNextQuestion,
    payload: {
      ...question,
      answers: {
        choices: {
          choices,
        }
      }
    },
  }
}

export function createShowScoreBoardMessage({ scoreBoard }) {
  return {
    name: messageType.gameShowScoreBoard,
    payload: scoreBoard,
  }
}

export function createCorrectAnswersMessage({ question }) {
  const answers = _.chain(question)
    .get('answers.choices.choices', [])
    .filter({ isCorrectAnswer: true })
    .map('_id');
  return {
    name: messageType.gameQuestionAnswers,
    payload: answers,
  }
}

export const getOwnerProceedMessage$ = ({ messages$, ownerUserId }) => {
  const ownerMessage$ = getOwnerMessage$({ messages$, ownerUserId });
  
  return ownerMessage$
    .pipe(
      filter(({ name }) => name === messageType.gameProceed),
      take(1),
    );
}

export const getPlayerAnswerMessage$ = ({ messages$ }) => messages$
  .pipe(
    filter(({ name }) => name === messageType.playerAnswer),
  );

export function areAllPlayersAnswered({ players }) {
  return !_.some(players, { isAnswerSubmitted: false })
}

export const getAllPlayersAnswered$ = ({ playerAnswerMessage$, players$ }) => playerAnswerMessage$
  .pipe(
    withLatestFrom(players$),
    scan((acc, [playerAnswerMessage, players]) => {
      const { userId } = playerAnswerMessage;

      const playersAnswered = _.mapValues(_.mapKeys(players, 'userId'), (player) => ({
        isAnswerSubmitted: player.userId === userId
          ? true
          : _.get(acc, [player.userId, 'isAnswerSubmitted'], false),
      }));

      return playersAnswered;
    }, {}),
    map((players) => areAllPlayersAnswered({ players })),
    filter(areAllPlayersAnswerSubmitted => areAllPlayersAnswerSubmitted),
    take(1),
  );