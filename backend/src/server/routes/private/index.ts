import express from 'express';
import CheerService from '../../../database/lib/cheer';
import HostService from '../../../database/lib/host';
import SubscriptionService from '../../../database/lib/subscription';
import TipService from '../../../database/lib/tip';
import * as twitchIrc from '../../../twitch/twitch_irc';
import ClearService from '../../services/clear/clear_service';
import HoursService from '../../services/hours/hours_service';

const router = express.Router();

router.get('/user', (req, res, next) => {
  res.status(200).json(req.user);
});

router.get('/lists', async (req, res, next) => {
  try {
    const payload = {
      cheers: await CheerService.list(),
      hosts: await HostService.list(),
      subscriptions: await SubscriptionService.list(),
      tips: await TipService.list(),
    };
    res.status(200).json(payload);
  } catch (e) {
    next(e);
  }
});

router.post('/say', (req, res, next) => {
  const { message } = req.body as { [key: string]: string | undefined };
  if (!message) {
    res.sendStatus(400);
    return;
  }
  try {
    twitchIrc.say(message);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

router.post('/clear', (req, res, next) => {
  const { name, id } = req.body as { [key: string]: string | undefined };
  if (!name || !id) {
    res.sendStatus(400);
    return;
  }
  try {
    ClearService.clearOne(name, id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

router.post('/clear/all', (req, res, next) => {
  try {
    ClearService.clearAll();
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

router.get('/hours', async (req, res, next) => {
  try {
    const response = await HoursService();
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/restart', (req, res, next) => {
  if (req.user === '51533859') {
    // TODO
    res.sendStatus(204);
    process.exit(0);
  }
});

export default router;
