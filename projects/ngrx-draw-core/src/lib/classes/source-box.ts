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
        private readonly name: string,
        private readonly selector?: string
    ) {
        this.boxDiv = createElementAndAppend('div', this.sourceGroupDiv, {
            id: this.name,
            class: 'rxjs-source'
        });
        // Create title
        createElementAndAppend('div', this.boxDiv, {
            class: 'rxjs-name',
            innerHTML: this.name
        });

        // Create timeline
        this.timelineBox = new TimelineBox(this.boxDiv, this.selector);
    }
}
