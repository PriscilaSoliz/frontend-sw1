import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlGenerateComponent } from './sql-generate.component';

describe('SqlGenerateComponent', () => {
  let component: SqlGenerateComponent;
  let fixture: ComponentFixture<SqlGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SqlGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
