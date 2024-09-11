import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpGenerateComponent } from './otp-generate.component';

describe('OtpGenerateComponent', () => {
  let component: OtpGenerateComponent;
  let fixture: ComponentFixture<OtpGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpGenerateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
