import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectTypePage } from './select-type.page';

describe('SelectTypePage', () => {
  let component: SelectTypePage;
  let fixture: ComponentFixture<SelectTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
