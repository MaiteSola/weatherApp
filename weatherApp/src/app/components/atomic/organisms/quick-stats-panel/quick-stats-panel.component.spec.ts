import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickStatsPanelComponent } from './quick-stats-panel.component';

describe('QuickStatsPanelComponent', () => {
  let component: QuickStatsPanelComponent;
  let fixture: ComponentFixture<QuickStatsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuickStatsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickStatsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
