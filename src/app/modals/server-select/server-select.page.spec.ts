import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServerSelectPage } from './server-select.page';

describe('ServerSelectPage', () => {
  let component: ServerSelectPage;
  let fixture: ComponentFixture<ServerSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServerSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
