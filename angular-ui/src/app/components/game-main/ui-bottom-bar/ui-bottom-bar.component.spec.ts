import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBottomBarComponent } from './ui-bottom-bar.component';

describe('UiBottomBarComponent', () => {
  let component: UiBottomBarComponent;
  let fixture: ComponentFixture<UiBottomBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBottomBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBottomBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
