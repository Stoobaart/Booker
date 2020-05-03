import Service from '@ember/service';
import { action } from '@ember/object';
import { cancel, later } from '@ember/runloop';

export default class PlayerActionsService extends Service {

  walkAnimationInProgress = false;
  animationTimeout = null;
  pathfinderAnimationTimeout = null;
  currentlyPathfinding = false;
  desiredLocation = null;

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
    const playerBottom = playerContainer.bottom + 50;

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

  pathfind(timeToWalk, direction) {
    const objectsHTMLCollection = document.getElementsByClassName('object');
    const objects = [...objectsHTMLCollection];

    objects.forEach((object) => {
      const playerContainer = document.getElementById('player-container').getBoundingClientRect();
      const playerBottom = playerContainer.bottom;
      const playerXCenter = playerContainer.right - ((playerContainer.right - playerContainer.left) / 2);

      const objectFloorArea = object.children[1].getBoundingClientRect();
      const objectTop = objectFloorArea.top;
      const objectBottom = objectFloorArea.top + objectFloorArea.height;
      const objectLeft = objectFloorArea.left;
      const objectRight = objectFloorArea.left + objectFloorArea.width;

      const playerWithinObjectBounds = playerXCenter > objectLeft && playerXCenter < objectRight && playerBottom > objectTop && playerBottom < objectBottom;

      if (playerWithinObjectBounds && !this.currentlyPathfinding) {
        this.currentlyPathfinding = true;
        
        if (direction === 'left' || direction === 'right') {
          const moveAbovePosition = objectTop - 50;
          const adjustedLeft = direction === 'left' ? playerContainer.left + 74 : playerContainer.left + 244 ;
          const nextPath1 = { pageY: moveAbovePosition, pageX: adjustedLeft }
          this.walk(nextPath1);

          later(() => {
            const nextPath = { pageY: moveAbovePosition, pageX: this.desiredLocation.pageX }
            this.walk(nextPath);

            const secondTimer = timeToWalk - 700;

            this.pathfinderAnimationTimeout = later(() => {
              const nextPath = { pageY: this.desiredLocation.pageY, pageX: this.desiredLocation.pageX }
              this.walk(nextPath);
            }, secondTimer);
          }, 700);
        } else {
          const adjustedTop = playerContainer.top + playerContainer.height + 50;
          const objectCenter = objectRight - ((objectRight - objectLeft) / 2);
          const closestDirectionXCoord = playerXCenter > objectCenter ? (objectRight + 50) : (objectLeft - 50);

          const nextPath1 = { pageY: adjustedTop, pageX: closestDirectionXCoord }
          this.walk(nextPath1);

          later(() => {
            const nextPath = { pageY: this.desiredLocation.pageY, pageX: closestDirectionXCoord }
            this.walk(nextPath);

            const secondTimer = timeToWalk - 700;

            this.pathfinderAnimationTimeout = later(() => {
              const nextPath = { pageY: this.desiredLocation.pageY, pageX: this.desiredLocation.pageX }
              this.walk(nextPath);
            }, secondTimer);
          }, 2000);
        }
      }
    });
  }

  walk(e) {

    if (e.target) {
      cancel(this.pathfinderAnimationTimeout);
      this.desiredLocation = { pageY: e.pageY, pageX: e.pageX };
    }
    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');
    const walkArea = document.getElementById('walk-area');
    const clickXPosition = e.pageX - 74;
    let adjustedScaleSpriteHeight;
    if (walkArea.offsetHeight < 280) {
      adjustedScaleSpriteHeight = e.pageY < 304 ? 200 : 224;
    } else {
      adjustedScaleSpriteHeight = e.pageY < 640 ? 274 : 314;
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
      window.clearInterval(this.manage3DnessInterval);
      window.clearInterval(this.manageSpriteScaleInterval);
    }

    const manage3Dness = () => {
      // this.setObjectsZIndices(e);
      this.pathfind(timeToWalk, direction);
    };

    const manageSpriteScale = () => {
      this.setObjectsZIndices(e);
      this.setSpriteScale();
    };

    this.manage3DnessInterval = window.setInterval(manage3Dness, 10);
    this.manageSpriteScaleInterval = window.setInterval(manageSpriteScale, 100);

    this.animationTimeout = later(() => {
      playerSprite.className = `standing ${direction}`;
      this.walkAnimationInProgress = false;
      window.clearInterval(this.manage3DnessInterval);
      window.clearInterval(this.manageSpriteScaleInterval);
      this.currentlyPathfinding = false;
    }, timeToWalk);

    this.walkAnimationInProgress = true;
  }
}
