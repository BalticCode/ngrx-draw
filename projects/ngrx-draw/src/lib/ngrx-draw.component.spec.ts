import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxDrawComponent } from './ngrx-draw.component';

describe('NgrxDrawComponent', () => {
  let component: NgrxDrawComponent;
  let fixture: ComponentFixture<NgrxDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgrxDrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
