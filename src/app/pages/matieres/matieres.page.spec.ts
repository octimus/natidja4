import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatieresPage } from './matieres.page';

describe('MatieresPage', () => {
  let component: MatieresPage;
  let fixture: ComponentFixture<MatieresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatieresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatieresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
