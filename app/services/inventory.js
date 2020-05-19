import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InventoryService extends Service {
  @tracked isOpen = false;

  @tracked items = [];

  @action
  toggle() {
    const open = document.getElementById('drawer-open');
    const close = document.getElementById('drawer-close');
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      const drawer = document.getElementsByClassName('items');
      const width = this.items.length * 4.5;
      drawer[0].style.width = `${width}rem`;
      open.play();
    } else {
      close.play();
    }
  }

  @action
  close() {
    const close = document.getElementById('drawer-close');
    if (this.isOpen) {
      close.play();
    }
    this.isOpen = false;
  }

  @action
  addItem(object) {
    this.items.push(object);
  }
}
