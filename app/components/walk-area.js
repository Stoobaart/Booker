import Component from '@glimmer/component';
import { action } from '@ember/object';
import { cancel, later, scheduleOnce } from '@ember/runloop';

export default class WalkAreaComponent extends Component {

  walkAnimationInProgress = false;
  animationTimeout = null;

  interval = null;

  constructor() {
    super(...arguments);
    scheduleOnce('afterRender', this, this.setSpriteScale);
  }

  setSpriteScale() {
    const walkArea = document.getElementById('walk-area');
    const walkAreaHalfwayPoint = walkArea.offsetHeight / 2;
    let maxScale;
    if (window.innerHeight < 768) {
      maxScale = window.innerHeight * 1.35;
    } else {
      maxScale = window.innerHeight - walkAreaHalfwayPoint;
    }
    const sprite = document.getElementById('player-container');
    const scaling = (sprite.offsetTop + 304) / maxScale;
    const increasedScaling = scaling * scaling;
    sprite.style.transform = `scale(${increasedScaling})`;
  }

  @action
  walk(e) {
    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');
    const clickXPosition = e.pageX - 74;
    let adjustedScaleSpriteHeight;
    if (window.innerHeight < 768) {
      adjustedScaleSpriteHeight = e.pageY < 304 ? 210 : 224;
      console.log(e.pageY)
    } else {
      adjustedScaleSpriteHeight = e.pageY < 640 ? 254 : 304;
    }

    const clickYPosition = e.pageY - adjustedScaleSpriteHeight;
    const playerXPosition = playerContainer.offsetLeft;
    const playerYPosition = playerContainer.offsetTop;
    const playerPositionXDiff = clickXPosition - playerXPosition;
    const playerPositionYDiff = clickYPosition - playerYPosition;

    const timeToWalk = (Math.abs(playerPositionXDiff) + Math.abs(playerPositionYDiff)) * 4;

    playerContainer.style.top = `${clickYPosition}px`;
    playerContainer.style.left = `${clickXPosition}px`;
    playerContainer.style.transition = `top ${timeToWalk}ms linear, left ${timeToWalk}ms linear`;

    let direction;

    if ((playerPositionXDiff > 0) && ((Math.abs(playerPositionXDiff)) > (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk right';
      direction = 'right';
    } else if ((playerPositionYDiff > 0 ) && ((Math.abs(playerPositionXDiff)) < (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk down';
      direction = 'down';
    } else if ((playerPositionYDiff < 0 ) && ((Math.abs(playerPositionXDiff)) < (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk up';
      direction = 'up';
    } else if ((playerPositionXDiff < 0) && ((Math.abs(playerPositionXDiff)) > (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk left';
      direction = 'left';
    }

    if (this.walkAnimationInProgress) {
      cancel(this.animationTimeout);
      window.clearInterval(this.interval);
    }

    const checkPositionAndSetScale = () => {
      this.setSpriteScale();
    };

    this.interval = window.setInterval(checkPositionAndSetScale, 100);

    this.animationTimeout = later(() => {
      playerSprite.className = `standing ${direction}`;
      this.walkAnimationInProgress = false;
      window.clearInterval(this.interval);
    }, timeToWalk);

    this.walkAnimationInProgress = true;
  }
}
