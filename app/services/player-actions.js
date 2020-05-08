import Service from '@ember/service';
import { cancel, later } from '@ember/runloop';

export default class PlayerActionsService extends Service {

  walkAnimationInProgress = false;
  animationTimeout = null;
  currentlyPathfinding = false;
  desiredLocation = null;
  direction = null;

  manage3DnessInterval = null;
  manage3dnessInterval = null;

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
      const objectArea = object.children[1].getBoundingClientRect();
      const objectBottomPosition = objectArea.top + objectArea.height;

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
      const objectArea = object.children[1].getBoundingClientRect();
      const objectTop = objectArea.top;
      const objectBottom = objectArea.bottom;
      const objectLeft = objectArea.left;
      const objectRight = objectArea.right;
      const objectXCenter = objectRight - ((objectRight - objectLeft) / 2);
      const objectYCenter = objectBottom - ((objectBottom - objectTop) / 2);

      const playerWithinObjectBounds = playerXCenter > objectLeft && playerXCenter < objectRight && playerBottom > objectTop && playerBottom < objectBottom;

      if (playerWithinObjectBounds && !this.currentlyPathfinding) {
        this.currentlyPathfinding = true;
        // get all object sides into an array
        const objectSidesArray = [ 
          { name: 'top', value: (objectTop - (playerBottom * 1.075)) }, 
          { name: 'bottom', value: (objectBottom - (playerBottom * .935)) }, 
          { name: 'left', value: (objectLeft - playerContainer.right) }, 
          { name: 'right', value: (objectRight - playerContainer.left) } 
        ];
        // find the side of the object that the player is closest to
        const closestSide = objectSidesArray.reduce(function(prev, curr) {
          return (Math.abs(curr.value - 0) < Math.abs(prev.value - 0) ? curr : prev);
        });

        if (closestSide.name === 'left' || closestSide.name === 'right') {
          const nearestY = this.desiredLocation.pageY > objectYCenter ? (objectBottom * 1.05) : (objectTop * .95);
          const adjustedX = closestSide.name === 'left' ? objectLeft * .98 : objectRight * .98;
          const coord = { pageY: nearestY, pageX: adjustedX };
          this.walk(coord);
          const timeToWalk = Math.abs(nearestY - playerBottom) * 10;

          later(() => {
            const playerContainer = document.getElementById('player-container').getBoundingClientRect();
            const playerXCenter = playerContainer.right - ((playerContainer.right - playerContainer.left) / 2);
            const adjustedX = closestSide.name === 'left' ? objectRight + playerWidth : objectLeft - playerWidth;
            const coord = { pageY: nearestY, pageX: adjustedX }
            this.walk(coord);
            const timeToWalk = Math.abs(this.desiredLocation.pageX - playerXCenter) * 5;

            later(() => {
              const coord = { pageY: this.desiredLocation.pageY, pageX: this.desiredLocation.pageX }
              this.walk(coord);
            }, timeToWalk);
          }, timeToWalk);
        } else {
          const nearestX = playerXCenter > objectXCenter ? (objectRight + playerWidth) : (objectLeft - playerWidth);
          const adjustedY = closestSide.name === 'top' ? playerBottom * .98 : playerBottom * 1.02;
          const coord = { pageY: adjustedY, pageX: nearestX };
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

  walk(e, objectInteraction) {
    // Reset lingering intervals
    window.clearInterval(this.manage3dnessInterval);

    // if click triggered walk
    if (e.target) {
      this.currentlyPathfinding = false;
      // Set the desired location used for the pathfinding final position
      this.desiredLocation = { pageY: e.pageY, pageX: e.pageX };
    }

    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');
    
    // click position to use when clicking directly on the screen, 
    // center sprite X and adjust Y for sprite changing size when scaling for perspective
    let clickXPosition = e.pageX - 50;
    let clickYPosition = e.pageY - this.adjustedScaleSpriteHeight(e.pageY);

    // If walking due to an object interaction, ensure the passed value is made proportional for different screen sizes
    if (objectInteraction) {
      clickXPosition = (e.pageX * window.innerWidth / 1440) - 50;
      const convertedY = e.pageY * window.innerHeight / 798;
      clickYPosition = convertedY - this.adjustedScaleSpriteHeight(convertedY);
    }
    
    // Get differences between click location and sprite position
    const playerPositionXDiff = clickXPosition - playerContainer.offsetLeft;
    const playerPositionYDiff = clickYPosition - playerContainer.offsetTop;
    // Calculate the time it takes to walk to destination
    const timeToWalk = (Math.abs(playerPositionXDiff) + Math.abs(playerPositionYDiff)) * 4;
    // Animate the sprite container to the position
    playerContainer.style.top = `${clickYPosition}px`;
    playerContainer.style.left = `${clickXPosition}px`;
    playerContainer.style.transition = `top ${timeToWalk}ms linear, left ${timeToWalk}ms linear`;
    // Figure out which direction the sprite is moving in and add the corresponding class
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
    // Cancel the animation if the player clicks somewhere else before finishing the current animation
    if (this.walkAnimationInProgress) {
      cancel(this.animationTimeout);
    }
    // Callback for the methods that manage pathfinding, and depth effects
    const manage3dness = () => {
      this.pathfind();
      this.setObjectsZIndices(e);
      this.setSpriteScale();
    };
    // Set an interval to call the above callback every millisecond
    this.manage3dnessInterval = window.setInterval(manage3dness, 30);
    // clear everything after arriving at destination
    this.animationTimeout = later(() => {
      playerSprite.className = `standing ${this.direction}`;
      this.walkAnimationInProgress = false;
      window.clearInterval(this.manage3dnessInterval);
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
