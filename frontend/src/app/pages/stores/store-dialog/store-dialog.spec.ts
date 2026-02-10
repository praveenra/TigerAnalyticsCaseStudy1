import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDialog } from './store-dialog';

describe('StoreDialog', () => {
  let component: StoreDialog;
  let fixture: ComponentFixture<StoreDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
