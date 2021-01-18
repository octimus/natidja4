import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BulletinPage } from './bulletin.page';

describe('BulletinPage', () => {
  let component: BulletinPage;
  let fixture: ComponentFixture<BulletinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BulletinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
