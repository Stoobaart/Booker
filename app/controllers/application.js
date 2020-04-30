import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service router;
  @tracked gameEntered = false;
  @tracked showLogo = true;
  @tracked fadeOut = false;

  // SET TO TRUE WHILE DEVELOPING TO SKIP START SCREEN
  @tracked gameStarted = false;

  @action
  enterGame() {
    this.gameEntered = true;
    later(() => {
      document.getElementById('footsteps').play();
    }, 500);
    later(() => {
      this.showLogo = false;
      document.getElementById('intro').play();
    }, 8000);
  }

  @action
  skipLogo() {
    this.showLogo = false;
    document.getElementById('footsteps').pause();
    document.getElementById('intro').play();
  }

  @action
  startGame() {
    this.fadeOut = true;
    later(() => {
      this.gameStarted = true;
      this.router.transitionTo('beginnings');
    }, 3500);
    
  }
}
