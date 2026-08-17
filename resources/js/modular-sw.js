import { precacheAndRoute } from 'workbox-precaching';
import { GatekeeperSwHandler } from '@dpb/gatekeeper';

precacheAndRoute(self.__WB_MANIFEST);

const swHandler = new GatekeeperSwHandler();