import { Observable } from 'rxjs';

import { createElementAndAppend } from '../utils/utils';
import { SourceBox } from './source-box';

export class SourceGroup<T = any> {

    public readonly groupDiv: HTMLDivElement;
    private readonly sources: Observable<any>[] = [];
    private readonly sourceBoxes: SourceBox[] = [];

    constructor(
        private readonly parentDiv: HTMLDivElement,
        public readonly rootObservable: Observable<T>
    ) {
        this.groupDiv = createElementAndAppend('div', this.parentDiv, { class: 'rxjs-group' });
    }

    public addSource(source: Observable<any>): void {
        this.sources.push(source);
    }

    public addSourceBox(label?: string, selector?: string): SourceBox {
        const sourceBox = new SourceBox(this.groupDiv, label, selector);
        this.sourceBoxes.push(sourceBox);
        return sourceBox;
    }

    public drawOperatorBoxes(observable: Observable<any>): void {
        const operatorsDiv = createElementAndAppend('div', this.groupDiv, { class: 'rxjs-operators' });

        // Find all the operators (which is not in the sources list) between input observable and last draw observable.
        while (observable !== this.sources[this.sources.length - 2]) {

            if (!!observable.operator) {
                createElementAndAppend('div', operatorsDiv, {
                    class: 'rxjs-operator',
                    innerHTML: observable.operator.constructor.name
                });
            }
            if (observable === this.rootObservable) {
                createElementAndAppend('div', operatorsDiv, {
                    class: 'rxjs-operator',
                    innerHTML: observable.constructor.name
                });
            }
            observable = observable.source;
        }
    }

    public stop(): void {
        this.sourceBoxes.forEach((sourceBox: SourceBox) => sourceBox.timeline?.stop());
    }
}
