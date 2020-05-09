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
        },
        lines: [
          {
            character: 'frank',
            mood: 'regular',
            line: `IT'S A COUCH`
          }, {
            character: 'frank',
            mood: 'angry',
            line: `THAT'S OBVIOUS, YOU PENIS!`
          }
        ]
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
