import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EcolagesPage } from './ecolages.page';

describe('EcolagesPage', () => {
  let component: EcolagesPage;
  let fixture: ComponentFixture<EcolagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcolagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EcolagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
