<template>
  <ul class="notify">
    <li
      class="notify__item"
      v-for="[notificationId, notification] in notifications"
      :key="notificationId"
      :class="notificationClasses(notification)"
    >
      {{ notification.message }}
    </li>
  </ul>
</template>

<script>
export default {
  render: () => null,
  data() {
    return {
      nextId: 0,
      notifications: new Map(),
    };
  },
  mounted() {
    this.$notifyBus.on('addNotification', this.addNotification);
  },
  methods: {
    addNotification({ message, variant }) {
      const id = this.nextId;
      this.notifications.set(id, {
        id,
        message,
        variant,
        timer: setTimeout(() => {
          this.destroyOnTimeout({
            notificationId: id,
          });
        }, 5000),
      });
      this.nextId += 1;
    },
    destroyOnTimeout({ notificationId }) {
      this.notifications.get(notificationId).fadeOut = true;
      setTimeout(() => {
        this.notifications.delete(notificationId);
      }, 5000);
    },
    notificationClasses({ variant, fadeOut }) {
      return {
        error: variant === 'error',
        success: variant === 'success',
        'fade-out': fadeOut,
      };
    },
  },
};
</script>

@<style lang="scss" scoped>
.notify__item {
  animation: fadeIn ease 500ms;
  position: relative;
}

.fade-out {
  animation: fadeOut ease 1s forwards;
  position: relative;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    left: 50%;
  }
  75% {
    left: -10%;
    opacity: 1;
  }
  100% {
    left: 0;
  }
}

@keyframes fadeOut {
  0% {
    left: 0;
  }
  25% {
    left: -10%;
    opacity: 1;
  }
  100% {
    left: 50%;
    opacity: 0;
  }
}
</style>
