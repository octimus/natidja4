import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParamsCandidatPage } from './params-candidat.page';

describe('ParamsCandidatPage', () => {
  let component: ParamsCandidatPage;
  let fixture: ComponentFixture<ParamsCandidatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamsCandidatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParamsCandidatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
