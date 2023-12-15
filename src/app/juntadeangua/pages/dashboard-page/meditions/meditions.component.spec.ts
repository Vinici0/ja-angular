import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeditionsComponent } from './meditions.component';

describe('MeditionsComponent', () => {
  let component: MeditionsComponent;
  let fixture: ComponentFixture<MeditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
