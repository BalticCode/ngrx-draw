import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { draw, RxjsDraw } from '@balticcode/ngrx-draw-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'ngrx-draw-demo';

  public ngOnInit(): void {
    RxjsDraw.getInstance().init('#marble');

    interval(1000)
      .pipe(
        take(4),
        draw('interval'),
        map(val => val + 2),
        draw('val => val + 2')
      )
      .subscribe(
        (value: any) => console.log(`%c[Next]`, 'background: #009688; color: #fff; padding: 3px; font-size: 9px;', value),
        (error: any) => console.log(`%[Error]`, 'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;', error),
        () => console.log(`%cComplete`, 'background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;')
      );
  }
}
