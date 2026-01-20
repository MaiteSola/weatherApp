import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeatherPageTemplateComponent } from './weather-page-template.component';

describe('WeatherPageTemplateComponent', () => {
  let component: WeatherPageTemplateComponent;
  let fixture: ComponentFixture<WeatherPageTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WeatherPageTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherPageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
