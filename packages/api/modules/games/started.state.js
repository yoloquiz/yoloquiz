import _ from 'lodash';
import { race, timer } from 'rxjs';
import {
  createShowScoreBoardMessage,
  createNextQuestionMessage,
  getAllPlayersAnswered$,
  getPlayerAnswerMessage$,
  getOwnerProceedMessage$,
  createCorrectAnswersMessage
} from './started.functions.js';

const QUESTION_TIMER = 30 * 1000;

// TODO: Handle questions loop and remove correct answers from payload
export async function onStartedState(context) {
  const { messages$, players$, quiz, sendToEveryone, ownerUserId, finish } = context;
  
  const playerAnswerMessage$ = getPlayerAnswerMessage$({
    messages$,
  });

  const scoreBoard = {};
  
  // // On boucle sur les questions
  for (const question of quiz.questions) {
    scoreBoard[question._id] = {};
    const questionStartAt = process.hrtime();

    sendToEveryone({
      message: createNextQuestionMessage({ question }),
    });
    const questionTimer$ = timer(QUESTION_TIMER);

    const allPlayersAnswered$ = getAllPlayersAnswered$({
      playerAnswerMessage$,
      players$,
    });

    const playerAnswersSub = playerAnswerMessage$.subscribe(({ userId, payload }) => {
      const userChoiceId = _.get(payload, 'choiceId');
      const choices = _.get(question, 'answers.choices.choices', []);
      const userChoice = _.find(choices, ({ _id: choiceId }) => {
          return choiceId.toString() === userChoiceId;
      });
      const isCorrectAnswer = _.get(userChoice, 'isCorrectAnswer', false);
      const [tSeconds, tNanoseconds] = process.hrtime(questionStartAt);
      const timeToAnswerInMs = tSeconds * 1000 + tNanoseconds / 1000000;
      _.set(scoreBoard, [question._id, userId], {
        isCorrectAnswer,
        timeToAnswerInMs,
        timeToAnswerRatio: timeToAnswerInMs / QUESTION_TIMER,
      });
    });
    
    const allPlayersAnsweredOrTimeout$ = race(
      questionTimer$,
      allPlayersAnswered$,
    );
      
    await allPlayersAnsweredOrTimeout$.toPromise();

    playerAnswersSub.unsubscribe();

    /**
     * We send all 
     */
    sendToEveryone({
      message: createCorrectAnswersMessage({ question }),
    });


    await getOwnerProceedMessage$({
      messages$,
      ownerUserId,
    }).toPromise();


    sendToEveryone({
      message: createShowScoreBoardMessage({ scoreBoard }),
    });

    await getOwnerProceedMessage$({
      messages$,
      ownerUserId,
    }).toPromise();
  }
  playerAnswerMessage$.complete();
  finish();
}