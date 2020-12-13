import Route from '@ember/routing/route';
import { cancel, later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class BeginningsRoute extends Route {
  @service router;

  setupController(controller, model) {
    super.setupController(controller, model);

    document.getElementById('intro').pause();
    document.getElementById('hallway').play();

    controller.timer = later(() => {
      this.router.transitionTo('the-bottom');
    }, 10000);
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      document.getElementById('hallway').pause();
      cancel(controller.timer);
    }
  }
}
