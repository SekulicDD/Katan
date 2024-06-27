import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPlayerInfoComponent } from './ui-player-info.component';

describe('UiPlayerInfoComponent', () => {
  let component: UiPlayerInfoComponent;
  let fixture: ComponentFixture<UiPlayerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPlayerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
