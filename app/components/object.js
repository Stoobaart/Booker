import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ObjectComponent extends Component {
  @service moveActions;
  @service talkActions;
  @service inventory;

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
    this.moveActions.walk(this.object.interactionCoord, { coordsFromObject: true });
    const checkIfArrived = () => {
      if (this.moveActions.hasArrived) {
        this.moveActions.action(this.object.action.comment);
        this.clearInterval();
        return this.talkActions.setLinesAndSpeak(this.object.lines);
      }
    };
    if (!this.checkIfArrivedInterval) {
      this.checkIfArrivedInterval = window.setInterval(checkIfArrived, 1000);
    }
    
    this.isClicked = false;
  }

  @action
  interactWith() {
    this.moveActions.walk(this.object.interactionCoord, { coordsFromObject: true });
    const checkIfArrived = () => {
      if (this.moveActions.hasArrived) {
        this.moveActions.action(this.object.action.interact);
        this.clearInterval();
        this.talkActions.setLinesAndSpeak(this.object.interactiveLines);
        if (this.object.canPickUp) {
          later(() => {
            const objectContainer = document.getElementById(this.object.name);
            objectContainer.style.display = 'none';
            this.inventory.addItem(this.object);
          }, 500);
          
        }
      }
    };
    if (!this.checkIfArrivedInterval) {
      this.checkIfArrivedInterval = window.setInterval(checkIfArrived, 1000);
    }
    this.isClicked = false;
  }
}
