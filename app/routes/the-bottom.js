import Route from '@ember/routing/route';
import { cancel } from '@ember/runloop';

export default class TheBottomRoute extends Route {
  resetController(controller, isExiting) {
    if (isExiting) {
      document.getElementById('hallway').pause();
      clearTimeout(controller.carInterval);
      cancel(controller.removeCar);
    }
  }
}