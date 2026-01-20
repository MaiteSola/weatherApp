import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HourlyCardComponent } from './hourly-card.component';

describe('HourlyCardComponent', () => {
  let component: HourlyCardComponent;
  let fixture: ComponentFixture<HourlyCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HourlyCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
