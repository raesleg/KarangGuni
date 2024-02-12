import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommunityHubPage } from './communityhub.page';

describe('CommunityHubPage', () => {
  let component: CommunityHubPage;
  let fixture: ComponentFixture<CommunityHubPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityHubPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
