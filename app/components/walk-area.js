import Component from '@glimmer/component';
import { action } from '@ember/object';
import { cancel, later } from '@ember/runloop';

export default class WalkAreaComponent extends Component {

  walkAnimationInProgress = false;
  animationTimeout = null;

  @action
  walk(e) {
    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');
    const clickXPosition = e.pageX - 74;
    const clickYPosition = e.pageY - 284;
    const playerXPosition = playerContainer.offsetLeft;
    const playerYPosition = playerContainer.offsetTop;
    const playerPositionXDiff = clickXPosition - playerXPosition;
    const playerPositionYDiff = clickYPosition - playerYPosition;

    const timeToWalk = (Math.abs(playerPositionXDiff) + Math.abs(playerPositionYDiff)) * 4;

    playerContainer.style.top = `${clickYPosition}px`;
    playerContainer.style.left = `${clickXPosition}px`;
    playerContainer.style.transition = `${timeToWalk}ms linear`;


    if((playerPositionXDiff > 0) && ((Math.abs(playerPositionXDiff)) > (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk-right';
    } else if ((playerPositionYDiff > 0 ) && ((Math.abs(playerPositionXDiff)) < (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk-down';
    } else if ((playerPositionYDiff < 0 ) && ((Math.abs(playerPositionXDiff)) < (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk-up';
    } else if ((playerPositionXDiff < 0) && ((Math.abs(playerPositionXDiff)) > (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk-left';
    }

    if(this.walkAnimationInProgress) {
      cancel(this.animationTimeout);
    }

    this.animationTimeout = later(() => {
      playerSprite.className = 'standing';
      this.walkAnimationInProgress = false;
    }, timeToWalk);

    this.walkAnimationInProgress = true;
  }
}
