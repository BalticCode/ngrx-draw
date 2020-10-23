import { Observable, OperatorFunction } from 'rxjs';

import { RxjsDraw } from '../classes/rxjs-draw';
import { SourceGroup } from '../classes/source-group';
import { findRootObservable } from '../utils/utils';

export const draw = <T = any>(label: string, selector?: string): OperatorFunction<T, T> => (source: Observable<T>): Observable<T> => {

    // Grouping diagrams by root observable
    let sourceGroup = RxjsDraw.getInstance().findGroup(source, selector);
    if (!sourceGroup) {
        const container = RxjsDraw.getInstance().findContainer(selector, true);
        sourceGroup = new SourceGroup(
            container.element,
            findRootObservable(source)
        );
        container.groups.push(sourceGroup);
    }

    // Adding this observable to the source list and create operator boxes
    sourceGroup.addSource(source);
    sourceGroup.drawOperatorBoxes(source);

    // Create source box
    const sourceBox = sourceGroup.addSourceBox(label, selector);

    // Start timeline
    sourceBox.timeline.start();

    const drawObs = new Observable<T>(observer => {
        return source.subscribe(
            (next: T) => {
                try {
                    sourceBox.timeline.push(next);
                    observer.next(next);
                } catch (err) {
                    sourceBox.timeline.stop();
                    sourceBox.timeline.error();
                    observer.error(err);
                }
            },
            (error: any) => {
                sourceBox.timeline.stop();
                sourceBox.timeline.error();
                observer.error(error);
            },
            () => {
                sourceBox.timeline.stop();
                sourceBox.timeline.complete();
                observer.complete();
            }
        );
    });
    drawObs.source = source;
    return drawObs;
};
