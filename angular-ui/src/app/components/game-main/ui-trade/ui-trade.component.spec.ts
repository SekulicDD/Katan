import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTradeComponent } from './ui-trade.component';

describe('UiTradeComponent', () => {
  let component: UiTradeComponent;
  let fixture: ComponentFixture<UiTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
