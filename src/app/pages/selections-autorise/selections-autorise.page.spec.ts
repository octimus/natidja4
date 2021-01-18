import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectionsAutorisePage } from './selections-autorise.page';

describe('SelectionsAutorisePage', () => {
  let component: SelectionsAutorisePage;
  let fixture: ComponentFixture<SelectionsAutorisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionsAutorisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionsAutorisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
