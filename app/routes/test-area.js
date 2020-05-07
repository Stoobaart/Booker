import Route from '@ember/routing/route';

export default class TestAreaRoute extends Route {
  model() {
    const objects = [
      {
        name: 'couch',
        isInteractive: true,
        isCollected: false,
        canInteractWith: true,
        interactionCoord: {
          pageY: 569,
          pageX: 730
        }
      }, {
        name: 'pillar',
        isInteractive: false,
        isCollected: false
      }
    ];
    return {
      objects
    };
  }
}
