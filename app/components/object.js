import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ObjectComponent extends Component {

  @service playerActions;

  @tracked isClicked = false;

  object = this.args.object;

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
  lookAt() {
    this.playerActions.walk(this.object.interactionCoord, { coordsFromObject: true });
    this.isClicked = false;
  }

  @action
  interactWith() {
    this.isClicked = false;
  }
}
