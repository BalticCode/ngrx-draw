import { createElementAndAppend } from '../utils/utils';

export class TimeBeam {
    public width = 0;
    public readonly timeBeamDiv: HTMLDivElement;

    constructor(
        private readonly timelineDiv: HTMLDivElement
    ) {
        this.timeBeamDiv = createElementAndAppend('div', this.timelineDiv, { class: 'rxjs-timeline' });
    }
}