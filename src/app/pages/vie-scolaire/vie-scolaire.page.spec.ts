import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VieScolairePage } from './vie-scolaire.page';

describe('VieScolairePage', () => {
  let component: VieScolairePage;
  let fixture: ComponentFixture<VieScolairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VieScolairePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VieScolairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
