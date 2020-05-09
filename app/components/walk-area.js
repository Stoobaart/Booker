import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class WalkAreaComponent extends Component {

  @service moveActions;

  constructor() {
    super(...arguments);
    scheduleOnce('afterRender', this, this.moveActions.setSpriteScale);
  }

  @action
  walk(e) {
    this.moveActions.walk(e);
  }

  @action
  teleport(e) {
    this.moveActions.teleport(e);
  }
}
