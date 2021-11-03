import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AffiliatePage } from './affiliate.page';

describe('AffiliatePage', () => {
  let component: AffiliatePage;
  let fixture: ComponentFixture<AffiliatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
