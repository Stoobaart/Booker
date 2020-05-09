import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ObjectComponent extends Component {

  @service playerActions;

  @tracked isClicked = false;

  object = this.args.object;
  checkIfArrivedInterval = null;

  @action
  showIcons(e) {
    this.isClicked = true;

    later(() => {
      const iconsContainer = document.getElementById('interaction-icons');
      iconsContainer.style.top = `${e.pageY - 50}px`;
      iconsContainer.style.left = `${e.pageX - 45}px`;
    });
  }

  @action
  removeIcons() {
    this.isClicked = false;
  }

  @action
  clearInterval() {
    window.clearInterval(this.checkIfArrivedInterval);
    this.checkIfArrivedInterval = null;
  }

  @action
  lookAt() {
    this.playerActions.walk(this.object.interactionCoord, { coordsFromObject: true });
    const checkIfArrived = () => {
      if (this.playerActions.hasArrived) {
        this.clearInterval();
        return this.test(this.object);
      }
    };
    if (!this.checkIfArrivedInterval) {
      this.checkIfArrivedInterval = window.setInterval(checkIfArrived, 1000);
    }
    
    this.isClicked = false;
  }

  @action
  interactWith() {
    this.isClicked = false;
  }

  test(object) {
    console.log(object.name);
  }
}
