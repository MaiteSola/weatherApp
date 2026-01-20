import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationBadgeComponent } from './location-badge.component';

describe('LocationBadgeComponent', () => {
  let component: LocationBadgeComponent;
  let fixture: ComponentFixture<LocationBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LocationBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
