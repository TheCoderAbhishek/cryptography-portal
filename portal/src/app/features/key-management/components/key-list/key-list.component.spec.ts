import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyListComponent } from './key-list.component';

describe('KeyListComponent', () => {
  let component: KeyListComponent;
  let fixture: ComponentFixture<KeyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
