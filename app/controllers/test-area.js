import Controller from '@ember/controller';

export default class TestAreaController extends Controller {

  init() {
    super.init();
    document.getElementById('rain-interior').play();
    // document.getElementById('piano').play();
  }
}
