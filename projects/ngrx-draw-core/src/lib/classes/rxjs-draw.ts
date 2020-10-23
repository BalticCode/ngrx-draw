import { Observable, Subject } from 'rxjs';

import { findRootObservable } from '../utils/utils';
import { DrawContainer } from './draw-container';
import { SourceGroup } from './source-group';

export class RxjsDraw {

    private static instance: RxjsDraw;

    private containers: DrawContainer[] = [];
    private readonly cleanSubject = new Subject<void>();

    private constructor() { }

    public static getInstance(): RxjsDraw {
        if (!RxjsDraw.instance) {
            RxjsDraw.instance = new RxjsDraw();
        }
        return RxjsDraw.instance;
    }

    public get clean$(): Subject<void> {
        return this.cleanSubject;
    }

    public clean(): void {
        this.stop();
        this.cleanSubject.next();
        this.containers.forEach(container => container.element.innerHTML = '');
        this.containers = [];
    }

    public stop(selector?: string): void {

        if (!!selector) {
            this.containers.find(container => container.selector === selector)?.stop();
        }

        this.containers.forEach(container => container.stop());
    }

    public findGroup(observable: Observable<any>, selector?: string): SourceGroup | null {

        if (!this.containers.length) {
            throw Error('RxjsDraw was not initilized.');
        }

        if (!!selector && this.hasContainer(selector)) {
            return this.getContainer(selector).groups
                .find((group: SourceGroup) => group.rootObservable === findRootObservable(observable));
        }

        return this.containers[0].groups
            .find((group: SourceGroup) => group.rootObservable === findRootObservable(observable));
    }

    public findContainer(selector?: string, withDefault = false): DrawContainer | null {
        if (!this.containers.length) {
            throw Error('RxjsDraw was not initilized.');
        }
        if (this.hasContainer(selector)) {
            return this.getContainer(selector);
        }
        return withDefault ? this.containers[0] : null;
    }

    public init(selector: string): void {
        this.containers = [];

        this.addContainer(selector);
    }

    public addContainer(selector: string): void {
        this.containers.push(new DrawContainer(selector));
    }

    private hasContainer(selector: string): boolean {
        return !!this.containers.find((container: DrawContainer) => container.selector === selector);
    }

    private getContainer(selector: string): DrawContainer | null {
        return this.containers.find((container: DrawContainer) => container.selector === selector);
    }
}
