import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoachSearchPage } from './coach-search.page';

describe('CoachSearchPage', () => {
  let component: CoachSearchPage;
  let fixture: ComponentFixture<CoachSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CoachSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
