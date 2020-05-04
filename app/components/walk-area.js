import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class WalkAreaComponent extends Component {

  @service playerActions;

  constructor() {
    super(...arguments);
    scheduleOnce('afterRender', this, this.playerActions.setSpriteScale);
  }

  @action
  walk(e) {
    this.playerActions.walk(e);
  }

  @action
  teleport(e) {
    this.playerActions.teleport(e);
  }
}
