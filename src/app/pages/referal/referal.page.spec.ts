import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReferalPage } from './referal.page';

describe('ReferalPage', () => {
  let component: ReferalPage;
  let fixture: ComponentFixture<ReferalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
