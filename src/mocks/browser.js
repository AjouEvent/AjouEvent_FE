import { setupWorker } from 'msw';
import { eventHandlers } from './handlers/event.handlers';
import { notificationHandlers } from './handlers/notification.handlers';
import { subscriptionHandlers } from './handlers/subscription.handlers';
import { userHandlers } from './handlers/user.handlers';

export const worker = setupWorker(
  ...eventHandlers,
  ...notificationHandlers,
  ...subscriptionHandlers,
  ...userHandlers
);
