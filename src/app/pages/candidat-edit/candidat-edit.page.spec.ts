import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidatEditPage } from './candidat-edit.page';

describe('CandidatEditPage', () => {
  let component: CandidatEditPage;
  let fixture: ComponentFixture<CandidatEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
