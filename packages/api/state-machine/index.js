/* {
  init: 'solid',
  transitions: [
      { name: 'melt',     from: 'solid',  to: 'liquid' },
      { name: 'freeze',   from: 'liquid', to: 'solid'  },
      { name: 'vaporize', from: 'liquid', to: 'gas'    },
      { name: 'condense', from: 'gas',    to: 'liquid' }
  ],
} */

// Lance la transition
// Lance le code du state
import _ from 'lodash';

export class StateMachine {
  constructor({ init, transitions, methods }) {
    this.state = init;
    this.transitions = transitions;
    this.methods = methods;

    this.runState({ state: init });
  }

  async run({ transition }) {
    console.log('STATE RUN', {transition})
    const transitionConfig = _.find(this.transitions, { name: transition });
    if (!transitionConfig) {
      throw new Error('Transition does not exist!');
    }

    if (transitionConfig.from !== this.state) {
      throw new Error('Peux pas executer');
    }

    try {
      await this.runTransition({ transition });
    } catch (error) {
      console.log('Transition failed to run', error);
      return this.runState({ state: this.state });
    }
    
    return this.setState({ transitionConfig });
  }

  runState({ state }) {
    this.runMethod({ methodName: 'onEnterState', methodArgs: { state } });

    const stateMethod = _.camelCase(`on_${state}_state`);

    return this.runMethod({ methodName: stateMethod });
  }

  runMethod({ methodName, methodArgs }) {
    if (!this.methods[methodName]) return;

    return this.methods[methodName](methodArgs);
  }

  runTransition({ transition }) {
    this.runMethod({ methodName: 'onEnterTransition', methodArgs: { transition } });

    const transitionMethodName = _.camelCase(`on_${transition}_transition`);

    return this.runMethod({ methodName: transitionMethodName });
  }
  
  async setState({ transitionConfig }) {
    this.state = transitionConfig.to;
    return this.runState({ state: this.state });
  }
}
