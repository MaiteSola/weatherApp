import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeatherHeaderComponent } from './weather-header.component';

describe('WeatherHeaderComponent', () => {
  let component: WeatherHeaderComponent;
  let fixture: ComponentFixture<WeatherHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WeatherHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
