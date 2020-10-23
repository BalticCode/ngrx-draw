import { Observable } from 'rxjs';
import { ElementOptions } from '../interfaces/element-options';

export const findRootObservable = <T = any>(observable: Observable<T>): Observable<T> => {
    let rootObservable = observable;
    // tslint:disable-next-line: deprecation
    while (rootObservable.source) {
        // tslint:disable-next-line: deprecation
        rootObservable = rootObservable.source;
    }
    return rootObservable;
};

export const createElementAndAppend = <
    E extends keyof HTMLElementTagNameMap,
    P extends HTMLElement
>(tagName: E, parent: P, options?: ElementOptions): HTMLElementTagNameMap[E] => {
    const element = document.createElement<E>(tagName);

    if (!!options?.id) {
        element.id = options.id;
    }

    if (!!options?.class) {
        if (Array.isArray(options.class)) {
            element.classList.add.apply(element.classList, options.class);
        } else {
            element.classList.add(options.class);
        }
    }

    if (!!options?.innerHTML) {
        element.innerHTML = options.innerHTML;
    }

    if (!!options?.dataSet) {
        for (const key in options.dataSet) {
            if (options.dataSet.hasOwnProperty(key)) {
                element.dataset[key] = options.dataSet[key];
            }
        }
    }

    parent.appendChild(element);
    return element;
};
