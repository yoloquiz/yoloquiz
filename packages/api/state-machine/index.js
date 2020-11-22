import _ from 'lodash';

export class StateMachine {
  constructor({ init, transitions, methods }) {
    this.state = init;
    this.transitions = transitions;
    this.methods = methods;

    this.runState({ state: init });
  }

  async run({ transition }) {
    const transitionConfig = _.find(this.transitions, { name: transition });
    if (!transitionConfig) {
      throw new Error('Transition does not exist!');
    }

    if (transitionConfig.from !== this.state) {
      throw new Error('This transition is not available');
    }

    try {
      await this.runTransition({ transition });
    } catch (error) {
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
  
  setState({ transitionConfig }) {
    this.state = transitionConfig.to;
    return this.runState({ state: this.state });
  }
}
