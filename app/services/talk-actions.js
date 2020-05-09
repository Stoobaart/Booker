import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { action } from '@ember/object';

export default class TalkActionsService extends Service {

  @tracked showTalkOverlay = false;
  @tracked speach = '';
  @tracked portrait = null;
  @tracked mood = null;
  typeWriterInterval = null;

  lines = [];
  letterCount = 0;
  numberOfLines = 0;
  lineNumber = 0;

  setLinesAndSpeak(lines) {
    this.lines = lines;
    this.speak();
  }

  speak() {
    this.showTalkOverlay = true;
    this.portrait = this.lines[this.lineNumber].character;
    this.mood = this.lines[this.lineNumber].mood;
    this.numberOfLines = this.lines.length - 1;
    const charactersInLine = this.lines[this.lineNumber].line.length;
    
    const typeWriter = () => {
      this.letterCount++;
      this.addALetter([...this.lines[this.lineNumber].line ]);
    };

    const timePerLetter = 50;
    this.typeWriterInterval = window.setInterval(typeWriter, timePerLetter);
    const timeToType = charactersInLine * timePerLetter;

    later(() => {
      window.clearInterval(this.typeWriterInterval);
      this.typeWriterInterval = null;
      this.letterCount = 0;
    }, timeToType);
  }

  addALetter(letters) {
    this.speach += letters[this.letterCount - 1];
  }

  @action
  runNextStep() {
    if (this.typeWriterInterval) {
      window.clearInterval(this.typeWriterInterval);
      this.typeWriterInterval = null;
      this.speach = this.lines[this.lineNumber].line;
    } else if (this.lineNumber < this.numberOfLines) {
      this.lineNumber++;
      this.portrait = null;
      this.mood = null;
      this.speach = '';
      this.speak();
    } else {
      window.clearInterval(this.typeWriterInterval);
      this.portrait = null;
      this.mood = null;
      this.speach = '';
      this.lines = [];
      this.letterCount = 0;
      this.numberOfLines = 0;
      this.lineNumber = 0;
      this.typeWriterInterval = null;
      this.showTalkOverlay = false;
    }
  }

}
