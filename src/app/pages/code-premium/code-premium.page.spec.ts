import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CodePremiumPage } from './code-premium.page';

describe('CodePremiumPage', () => {
  let component: CodePremiumPage;
  let fixture: ComponentFixture<CodePremiumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodePremiumPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodePremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
