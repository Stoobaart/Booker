import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class TheBottomController extends Controller {
  @service talkActions;

  @tracked animateCar;

  init() {
    super.init();
    const rain = new Audio('/assets/sound-fx/rain-interior.wav');
    rain.play();
    rain.addEventListener('timeupdate', function() {
      const buffer = 3;
      if (this.currentTime > this.duration - buffer) {
        this.currentTime = 0;
        this.play();
      }
    });

    const carPassing = new Audio('/assets/sound-fx/car-passing.wav');

    this.carInterval = setInterval(() => {
      carPassing.play();
      this.animateCar = true;

      this.removeCar = later(() => {
        this.animateCar = false;
      }, 2500);
    }, 9000);

    this.sceneOne();
  }

  get manageScene() {
    if (this.talkActions.sceneSequenceTracker === 0) {
      console.log('Sequence started');
    } else if (this.talkActions.sceneSequenceTracker > 0) {
      console.log('Next sequence started');
    }
  }

  sceneOne() {
    const lines = [
      {
        character: 'frank',
        mood: 'angry',
        line: 'AAARGH!'
      }, {
        character: 'frank',
        mood: 'regular',
        line: `Every god damn night, Frank.`
      }, {
        character: 'frank',
        mood: 'regular',
        line: `Every...god...damn...night`
      }
    ]
    this.talkActions.setLinesAndSpeak(lines);
  }
}