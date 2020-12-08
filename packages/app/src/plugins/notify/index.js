/* eslint-disable no-param-reassign */
import Notifications from '@/plugins/notify/Notifications.vue';
import mitt from 'mitt';
import { inject } from 'vue';

export function useNotify() {
  return inject('notify');
}

export default {
  install: (app, options) => {
    app.component('Notifications' || options.componentName, Notifications);

    const emitter = mitt();
    function notify(params) {
      if (typeof params === 'string') {
        emitter.emit('addNotification', {
          message: params,
          type: 'default',
        });
        return;
      }
      emitter.emit('addNotification', params);
    }

    notify.error = (message) => notify({ variant: 'error', message });
    notify.success = (message) => notify({ variant: 'success', message });
    notify.warning = (message) => notify({ variant: 'warning', message });
    notify.info = (message) => notify({ variant: 'warning', message });

    app.config.globalProperties.$notifyBus = emitter;

    app.config.globalProperties.$notify = notify;
    app.provide('notify', notify);
  },
};
