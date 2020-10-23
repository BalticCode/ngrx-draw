import { createElementAndAppend } from '../utils/utils';
import { SourceGroup } from './source-group';

export class DrawContainer {

    public readonly element: HTMLDivElement;
    public readonly groups: SourceGroup[] = [];
    public readonly toolTip: HTMLPreElement;

    constructor(public readonly selector: string) {
        this.element = document.querySelector<HTMLDivElement>(selector);
        if (!this.element) {
            throw Error('Cannot find div in DOM, please provide a valid css selector for a container.');
        }
        this.toolTip = createElementAndAppend('pre', this.element, { class: 'rxjs-tooltip' });
    }

    public stop(): void {
        this.groups.forEach(group => group.stop());
    }
}
