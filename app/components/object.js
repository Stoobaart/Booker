import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

export default class ObjectComponent extends Component {
  @tracked isClicked = false;

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
    this.isClicked = false;
  }

  @action
  interactWith() {
    this.isClicked = false;
  }
}
