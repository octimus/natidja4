import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoachProfilePage } from './coach-profile.page';

describe('CoachProfilePage', () => {
  let component: CoachProfilePage;
  let fixture: ComponentFixture<CoachProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CoachProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
