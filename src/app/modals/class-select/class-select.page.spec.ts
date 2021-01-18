import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassSelectPage } from './class-select.page';

describe('ClassSelectPage', () => {
  let component: ClassSelectPage;
  let fixture: ComponentFixture<ClassSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
