import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentSearchesListComponent } from './recent-searches-list.component';

describe('RecentSearchesListComponent', () => {
  let component: RecentSearchesListComponent;
  let fixture: ComponentFixture<RecentSearchesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecentSearchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentSearchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
