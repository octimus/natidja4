import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamSelectPage } from './exam-select.page';

describe('ExamSelectPage', () => {
  let component: ExamSelectPage;
  let fixture: ComponentFixture<ExamSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
