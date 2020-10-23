import { animationFrameScheduler, fromEvent, Observable, scheduled, Subscription } from 'rxjs';
import { filter, map, pairwise, pluck, repeat, share, takeUntil, throttleTime } from 'rxjs/operators';

import { Marble } from '../interfaces/marble';
import { createElementAndAppend } from '../utils/utils';
import { RxjsDraw } from './rxjs-draw';
import { TimeBeam } from './time-beam';

export class TimelineBox {

    private readonly timelineDiv: HTMLDivElement;
    private readonly timeBeam: TimeBeam;

    private readonly pxPerSec = 100;
    private readonly startTime: number;
    private readonly timer$: Observable<number>;
    private readonly scroll$: Observable<any>;

    private readonly syncScrollSubsciption: Subscription;
    private autoScrollSubscription: Subscription;
    private timerSubscription: Subscription;

    private readonly marbles: Marble[] = [];

    constructor(
        private readonly sourceBoxDiv: HTMLDivElement,
        private readonly selector?: string
    ) {
        this.timelineDiv = createElementAndAppend('div', this.sourceBoxDiv, { class: 'rxjs-timeline-container' });
        this.timeBeam = new TimeBeam(this.timelineDiv);

        this.startTime = Date.now();
        this.timer$ = scheduled([0], animationFrameScheduler)
            .pipe(
                repeat(),
                map(Date.now),
                share()
            );
        this.scroll$ = fromEvent(this.timelineDiv, 'scroll').pipe(share());

        this.initMarbleHoverEvents();

        // Timeline scroll synchronizing event
        this.syncScrollSubsciption = this.scroll$
            .subscribe(() => {
                const sourceGroupDiv = this.timelineDiv.parentNode.parentElement as HTMLDivElement;
                const timelineContainers = sourceGroupDiv.querySelectorAll('.rxjs-timeline-container');
                timelineContainers.forEach((element: Element) => {
                    element.scrollLeft = this.timelineDiv.scrollLeft;
                });
            });
    }

    private initMarbleHoverEvents(): void {

        fromEvent(this.timelineDiv, 'mousemove')
            .pipe(
                takeUntil(RxjsDraw.getInstance().clean$)
            )
            .subscribe((event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const container = RxjsDraw.getInstance().findContainer(this.selector, true);
                if (target.matches('.rxjs-marble')) {
                    const index = Array.from(target.parentNode.childNodes).indexOf(target);
                    const data = this.marbles[index];
                    let display = data.value;
                    if (typeof data.value === 'object' && data.value) {
                        if (data.value.constructor.name === 'Object') {
                            try {
                                display = JSON.stringify(display, null, 2);
                            } catch (err) {
                                display = data.value;
                            }
                        }
                    }
                    // Apply marble data to tooltip DOM
                    container.toolTip.innerHTML = display;
                    createElementAndAppend('div', container.toolTip, {
                        innerHTML: 'Type: ' + typeof data.value
                    });
                    createElementAndAppend('div', container.toolTip, {
                        innerHTML: 'Time: ' + (data.time - this.startTime) + 'ms'
                    });
                    container.toolTip.style.left = event.clientX + 'px';
                    container.toolTip.style.top = event.clientY + 'px';
                    container.toolTip.style.display = 'inline-block';
                } else {
                    container.toolTip.style.display = 'none';
                }
            });

        fromEvent(this.timelineDiv, 'mouseleave')
            .pipe(
                takeUntil(RxjsDraw.getInstance().clean$)
            )
            .subscribe(() => {
                const container = RxjsDraw.getInstance().findContainer(this.selector, true);
                container.toolTip.style.display = 'none';
            });
    }

    public start(): void {
        this.timerSubscription = this.timer$
            .subscribe((value: number) => {
                this.timeBeam.width = (value - this.startTime) * this.pxPerSec / 1000;
                this.timeBeam.timeBeamDiv.style.width = `${this.timeBeam.width}px`;
            });

        // If timeline is scrolled back, stop auto scrolling.
        const scrollBack$ = this.scroll$
            .pipe(
                throttleTime(100),
                pluck('target', 'scrollLeft'),
                pairwise(),
                filter((scrolls: [number, number]) => {
                    return scrolls[0] > scrolls[1];
                })
            );
        this.autoScrollSubscription = this.timer$
            .pipe(
                takeUntil(scrollBack$)
            )
            .subscribe(() => {
                this.timelineDiv.scrollLeft = this.timelineDiv.scrollWidth;
            });
    }

    public stop(): void {
        this.syncScrollSubsciption.unsubscribe();
        this.timerSubscription.unsubscribe();
        this.autoScrollSubscription.unsubscribe();
    }

    public push(value: any): void {
        let display = value;
        if (typeof value === 'number') {
            display = value.toString();
            if (display.length > 4) {
                display = '[N]';
            }
        } else if (typeof value === 'string') {
            if (value.length > 4) {
                display = '[S]';
            }
        } else if (typeof value === 'boolean') {
            display = value.toString();
        } else if (typeof value === 'function') {
            display = '[F]';
        } else if (typeof value === 'object') {
            if (value === null) {
                display = 'null';
            } else {
                display = '[O]';
            }
        } else if (typeof value === 'undefined') {
            display = '[U]';
        }

        const previous = this.marbles.length ? this.marbles[this.marbles.length - 1] : null;
        let top = 0;
        const left = this.timeBeam.width;
        if (previous && previous.left === left) {
            top = previous.top + 5;
        }

        const marble: Marble = {
            time: new Date().getTime(),
            value,
            display,
            top,
            left
        };
        this.marbles.push(marble);
        const marbleDiv = createElementAndAppend('div', this.timeBeam.timeBeamDiv, {
            class: 'rxjs-marble',
            innerHTML: display
        });
        marbleDiv.style.top = `${marble.top}px`;
        marbleDiv.style.left = `${marble.left}px`;
    }

    public error(): void {
        this.timeBeam.timeBeamDiv.classList.add('rxjs-timeline-error');
    }

    public complete(): void {
        this.timeBeam.timeBeamDiv.classList.add('rxjs-timeline-complete');
    }
}
