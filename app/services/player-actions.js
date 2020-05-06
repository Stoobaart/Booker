import Service from '@ember/service';
import { cancel, later } from '@ember/runloop';

export default class PlayerActionsService extends Service {

  walkAnimationInProgress = false;
  animationTimeout = null;
  currentlyPathfinding = false;
  desiredLocation = null;
  direction = null;

  manage3DnessInterval = null;
  manageSpriteScaleInterval = null;

  setSpriteScale() {
    const walkArea = document.getElementById('walk-area');
    const screenArea = document.getElementById('game-container');
    const walkAreaHalfwayPoint = walkArea.offsetHeight / 2;
    
    let maxScale;
    if (screenArea.offsetHeight < 768) {
      maxScale = screenArea.offsetHeight * 1.35;
    } else {
      maxScale = screenArea.offsetHeight - walkAreaHalfwayPoint;
    }
    const sprite = document.getElementById('player-container');
    const scaling = (sprite.offsetTop + 304) / maxScale;
    const increasedScaling = scaling * scaling;
    sprite.style.transform = `scale(${increasedScaling})`;
  }

  setObjectsZIndices() {
    const objectsHTMLCollection = document.getElementsByClassName('object');
    const objects = [...objectsHTMLCollection];
    const playerContainer = document.getElementById('player-container').getBoundingClientRect();
    const playerBottom = playerContainer.bottom + 25;

    objects.forEach((object) => {
      const objectFloorArea = object.children[1].getBoundingClientRect();
      const objectBottomPosition = objectFloorArea.top + objectFloorArea.height;

      if (objectBottomPosition < playerBottom) {
        object.style.zIndex = 1;
      } else {
        object.style.zIndex = 3;
      }
    });
  }

  pathfind() {
    const objectsHTMLCollection = document.getElementsByClassName('object');
    const objects = [...objectsHTMLCollection];

    const playerContainer = document.getElementById('player-container').getBoundingClientRect();
    const playerBottom = playerContainer.bottom;
    const playerXCenter = playerContainer.right - ((playerContainer.right - playerContainer.left) / 2);
    const playerWidth = playerContainer.width;

    objects.forEach((object) => {
      const objectFloorArea = object.children[1].getBoundingClientRect();
      const objectWidth = objectFloorArea.width;
      const objectHeight = objectFloorArea.height;
      const objectTop = objectFloorArea.top;
      const objectBottom = objectFloorArea.top + objectFloorArea.height;
      const objectLeft = objectFloorArea.left;
      const objectRight = objectFloorArea.left + objectFloorArea.width;
      const objectXCenter = objectRight - ((objectRight - objectLeft) / 2);
      const objectYCenter = objectBottom - ((objectBottom - objectTop) / 2);

      const playerWithinObjectBounds = (playerContainer.right / .95) > objectLeft && (playerContainer.left + 1.05) < objectRight && playerBottom > objectTop && playerBottom < objectBottom;

      if (playerWithinObjectBounds && !this.currentlyPathfinding) {
        this.currentlyPathfinding = true;

        const goingDown = playerBottom < objectYCenter && playerXCenter > objectLeft + (objectWidth * .1) && playerXCenter < objectRight - (objectWidth * .1);
        const goingUp = playerBottom > objectYCenter && playerXCenter > objectLeft + (objectWidth * .1) && playerXCenter < objectRight - (objectWidth * .1);
        const goingRight = playerXCenter < objectXCenter && !goingUp && !goingDown;
        const goingLeft = playerXCenter > objectXCenter && !goingUp && !goingDown;

        if (goingLeft || goingRight) {
          const nearestY = this.desiredLocation.pageY > objectYCenter ? (objectBottom + (objectHeight * .01)) : (objectTop - (objectHeight * .01));
          const adjustedLeft = goingLeft ? playerContainer.left * 1.02 : playerContainer.left * 1.6 ;
          const coord = { pageY: nearestY, pageX: adjustedLeft };
          this.walk(coord);
          const timeToWalk = Math.abs(nearestY - playerBottom) * 10;

          later(() => {
            const playerContainer = document.getElementById('player-container').getBoundingClientRect();
            const playerXCenter = playerContainer.right - ((playerContainer.right - playerContainer.left) / 2);
            const adjustedX = goingLeft ? this.desiredLocation.pageX * .95 : this.desiredLocation.pageX * 1.05;
            const coord = { pageY: nearestY, pageX: adjustedX }
            this.walk(coord);
            const timeToWalk = Math.abs(this.desiredLocation.pageX - playerXCenter) * 5;

            later(() => {
              const coord = { pageY: this.desiredLocation.pageY, pageX: adjustedX }
              this.walk(coord);
            }, timeToWalk);
          }, timeToWalk);
        } else {
          const nearestX = playerXCenter > objectXCenter ? (objectRight + playerWidth) : (objectLeft - playerWidth);
          const coord = { pageY: playerBottom, pageX: nearestX };
          this.walk(coord);
          const timeToWalk = Math.abs(nearestX - playerContainer.right) * 5;

          later(() => {
            const coord = { pageY: this.desiredLocation.pageY, pageX: this.desiredLocation.pageX }
            this.walk(coord);
          }, timeToWalk);
        }
      }
    });
  }

  adjustedScaleSpriteHeight(clickYPosition) {
    const walkArea = document.getElementById('walk-area');
    if (walkArea.offsetHeight < 268) {
      return clickYPosition < 304 ? 210 : 244;
    } else {
      return clickYPosition < 640 ? 274 : 314;
    }
  }

  walk(e) {
    window.clearInterval(this.manage3DnessInterval);
    window.clearInterval(this.manageSpriteScaleInterval);

    if (e.target) {
      this.currentlyPathfinding = false;
      this.desiredLocation = { pageY: e.pageY, pageX: e.pageX };
    }
    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');
    const clickXPosition = e.pageX - 50;
    const clickYPosition = e.pageY - this.adjustedScaleSpriteHeight(e.pageY);
    const playerXPosition = playerContainer.offsetLeft;
    const playerYPosition = playerContainer.offsetTop;
    const playerPositionXDiff = clickXPosition - playerXPosition;
    const playerPositionYDiff = clickYPosition - playerYPosition;

    const timeToWalk = (Math.abs(playerPositionXDiff) + Math.abs(playerPositionYDiff)) * 4;

    playerContainer.style.top = `${clickYPosition}px`;
    playerContainer.style.left = `${clickXPosition}px`;
    playerContainer.style.transition = `top ${timeToWalk}ms linear, left ${timeToWalk}ms linear`;

    if ((playerPositionXDiff > 0) && ((Math.abs(playerPositionXDiff)) > (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk right';
      this.direction = 'right';
    } else if ((playerPositionYDiff > 0 ) && ((Math.abs(playerPositionXDiff)) < (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk down';
      this.direction = 'down';
    } else if ((playerPositionYDiff < 0 ) && ((Math.abs(playerPositionXDiff)) < (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk up';
      this.direction = 'up';
    } else if ((playerPositionXDiff < 0) && ((Math.abs(playerPositionXDiff)) > (Math.abs(playerPositionYDiff)))) {
      playerSprite.className = 'walk left';
      this.direction = 'left';
    }

    if (this.walkAnimationInProgress) {
      cancel(this.animationTimeout);
    }

    const manage3Dness = () => {
      this.pathfind();
    };

    const manageSpriteScale = () => {
      this.setObjectsZIndices(e);
      this.setSpriteScale();
    };

    this.manage3DnessInterval = window.setInterval(manage3Dness, 1);
    this.manageSpriteScaleInterval = window.setInterval(manageSpriteScale, 1);

    this.animationTimeout = later(() => {
      playerSprite.className = `standing ${this.direction}`;
      this.walkAnimationInProgress = false;
      window.clearInterval(this.manage3DnessInterval);
      window.clearInterval(this.manageSpriteScaleInterval);
      this.currentlyPathfinding = false;
    }, timeToWalk);

    this.walkAnimationInProgress = true;
  }

  teleport(e) {
    cancel(this.animationTimeout);
    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.className = `standing ${this.direction}`;
    const clickXPosition = e.pageX - 74;
    const clickYPosition = e.pageY - this.adjustedScaleSpriteHeight(e.pageY);
    playerContainer.style.top = `${clickYPosition}px`;
    playerContainer.style.left = `${clickXPosition}px`;
    playerContainer.style.transition = 'none';
  }

}
