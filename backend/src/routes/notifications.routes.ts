import { Router } from "express";
import {
  deleteNotificationHandler,
  getNotificationsHandler,
  getUnreadCountHandler,
  markAllNotificationsAsReadHandler,
  markNotificationAsReadHandler,
} from "../controllers/notifications.controller";

const notificationsRouter = Router();

notificationsRouter.get("/", getNotificationsHandler);
notificationsRouter.get("/unread-count", getUnreadCountHandler);
notificationsRouter.post("/mark-all-read", markAllNotificationsAsReadHandler);
notificationsRouter.post("/:id/read", markNotificationAsReadHandler);
notificationsRouter.post("/read", markNotificationAsReadHandler);
notificationsRouter.delete("/:id", deleteNotificationHandler);

export default notificationsRouter;

