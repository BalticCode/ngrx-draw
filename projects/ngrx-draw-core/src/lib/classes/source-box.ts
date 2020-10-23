import { createElementAndAppend } from '../utils/utils';
import { TimelineBox } from './timeline-box';

export class SourceBox {

    public readonly boxDiv: HTMLDivElement;
    private readonly timelineBox: TimelineBox;

    public get timeline(): TimelineBox {
        return this.timelineBox;
    }

    constructor(
        private readonly sourceGroupDiv: HTMLDivElement,
        private readonly label?: string,
        private readonly selector?: string
    ) {
        this.boxDiv = createElementAndAppend('div', this.sourceGroupDiv, {
            id: this.label,
            class: 'rxjs-source'
        });
        // Create title
        if (!!this.label) {
            createElementAndAppend('div', this.boxDiv, {
                class: 'rxjs-name',
                innerHTML: this.label
            });
        }

        // Create timeline
        this.timelineBox = new TimelineBox(this.boxDiv, this.selector);
    }
}
