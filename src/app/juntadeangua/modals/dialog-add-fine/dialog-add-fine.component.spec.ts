import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddFineComponent } from './dialog-add-fine.component';

describe('DialogAddFineComponent', () => {
  let component: DialogAddFineComponent;
  let fixture: ComponentFixture<DialogAddFineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddFineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddFineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
