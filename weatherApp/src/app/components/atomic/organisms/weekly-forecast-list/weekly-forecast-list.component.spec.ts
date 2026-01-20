import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeeklyForecastListComponent } from './weekly-forecast-list.component';

describe('WeeklyForecastListComponent', () => {
  let component: WeeklyForecastListComponent;
  let fixture: ComponentFixture<WeeklyForecastListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WeeklyForecastListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyForecastListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
