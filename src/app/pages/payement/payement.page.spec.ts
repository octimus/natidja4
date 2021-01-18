import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayementPage } from './payement.page';

describe('PayementPage', () => {
  let component: PayementPage;
  let fixture: ComponentFixture<PayementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
