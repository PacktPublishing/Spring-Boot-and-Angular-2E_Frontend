---
applyTo: "**/*.spec.ts"
---
# Unit Testing Instructions - Angular 20 with Vitest

## Framework Setup
- **Test Runner**: Vitest with `@analogjs/vite-plugin-angular`
- **Test Files**: `*.spec.ts` co-located with components
- **Commands**: `npm run test`, `npm run test:coverage`, `npm run test:ui`

When debugging tests make sure to prefer `npm run test:run` over other commands to avoid watch mode so that you can better examine the test output.

## Component Testing Patterns

### Standalone Component Setup
```typescript
describe('Component', () => {
  let component: Component;
  let fixture: ComponentFixture<Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component, MatTableModule, MatIconModule] // Import standalone + Material modules
    }).compileComponents();
    
    fixture = TestBed.createComponent(Component);
    component = fixture.componentInstance;
  });
});
```

### Signal Input/Output Testing
```typescript
// Signal inputs
fixture.componentRef.setInput('items', testData);
fixture.detectChanges();
expect(component.items()).toEqual(testData);

// Signal outputs
component.itemSelected.subscribe(data => receivedData = data);
component.selectItem(mockData);
expect(receivedData).toEqual(mockData);
```

### Service Testing
```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service', () => {
  let service: Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Service]
    });
    service = TestBed.inject(Service);
    httpMock = TestBed.inject(HttpTestingController);
  });
});
```