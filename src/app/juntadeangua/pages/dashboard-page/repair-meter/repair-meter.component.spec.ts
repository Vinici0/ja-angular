import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMeterComponent } from './repair-meter.component';

describe('RepairMeterComponent', () => {
  let component: RepairMeterComponent;
  let fixture: ComponentFixture<RepairMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairMeterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
