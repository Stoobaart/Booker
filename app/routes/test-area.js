import Route from '@ember/routing/route';

export default class TestAreaRoute extends Route {
  model() {
    const objects = [
      {
        name: 'couch',
        isInteractive: true,
        isCollected: false,
        hasInteractAction: false,
        interactionCoord: {
          pageY: 569,
          pageX: 730
        },
        action: {
          comment: 'standing up',
        },
        lines: [
          {
            character: 'frank',
            mood: 'regular',
            line: `IT'S A COUCH`
          }, {
            character: 'frank',
            mood: 'angry',
            line: `IT'S OBVIOUS, YOU DAMN FOOL!`
          }
        ]
      }, {
        name: 'pillar',
        isInteractive: false,
        isCollected: false
      }, {
        name: 'banana',
        canPickUp: true,
        isInteractive: true,
        isCollected: false,
        hasInteractAction: true,
        interactionCoord: {
          pageY: 609,
          pageX: 1030
        },
        action: {
          comment: 'standing right',
          interact: 'pickup'
        },
        lines: [
          {
            character: 'frank',
            mood: 'regular',
            line: `IT'S A BANANA`
          }, {
            character: 'frank',
            mood: 'regular',
            line: `IT LOOKS LONELY`
          }
        ],
        interactiveLines: [
          {
            character: 'frank',
            mood: 'regular',
            line: `GIMME BANANA`
          }
        ]
      },
    ];
    return {
      objects
    };
  }
}
