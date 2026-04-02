import { setupServer } from 'msw/node';
import { eventHandlers } from './handlers/event.handlers';
import { notificationHandlers } from './handlers/notification.handlers';
import { subscriptionHandlers } from './handlers/subscription.handlers';
import { userHandlers } from './handlers/user.handlers';

export const server = setupServer(
  ...eventHandlers,
  ...notificationHandlers,
  ...subscriptionHandlers,
  ...userHandlers
);
