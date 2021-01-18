import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyGiftsPage } from './my-gifts.page';

describe('MyGiftsPage', () => {
  let component: MyGiftsPage;
  let fixture: ComponentFixture<MyGiftsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGiftsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyGiftsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
