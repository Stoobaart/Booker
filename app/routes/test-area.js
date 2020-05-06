import Route from '@ember/routing/route';

export default class TestAreaRoute extends Route {
  model() {
    const objects = [
      {
        name: 'couch',
        isInteractive: true,
        isCollected: false
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
