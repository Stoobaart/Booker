import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class BeginningsController extends Controller {
  @tracked endHallway = false;

  init() {
    super.init();
    document.getElementById('intro').pause();
    document.getElementById('hallway').play();

    later(() => {
      this.endHallway = true;
    }, 10000);
  }
}
