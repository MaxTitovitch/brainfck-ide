import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputTabComponent } from './output-tab.component';

describe('OutputTabComponent', () => {
  let component: OutputTabComponent;
  let fixture: ComponentFixture<OutputTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
