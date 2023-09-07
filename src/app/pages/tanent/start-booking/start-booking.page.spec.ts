import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartBookingPage } from './start-booking.page';

describe('StartBookingPage', () => {
  let component: StartBookingPage;
  let fixture: ComponentFixture<StartBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartBookingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
