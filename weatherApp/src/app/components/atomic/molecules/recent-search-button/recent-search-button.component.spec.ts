import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentSearchButtonComponent } from './recent-search-button.component';

describe('RecentSearchButtonComponent', () => {
  let component: RecentSearchButtonComponent;
  let fixture: ComponentFixture<RecentSearchButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecentSearchButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentSearchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
