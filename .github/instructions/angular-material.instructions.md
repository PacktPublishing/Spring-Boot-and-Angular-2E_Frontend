# Angular Material Patterns

## Form Components
Always use these Material components for forms:
- `mat-form-field` with `appearance="outline"` for consistency
- `mat-input` for text inputs
- `mat-button` and `mat-raise-button` for actions
- `mat-icon` for visual enhancement
- `mat-card` for form containers

## Common Imports
```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
```

### Styling Patterns
- Use Material Design spacing principles
- Implement responsive design with CSS Grid/Flexbox
- Follow the established color scheme and typography
- Use Material Design elevation for cards and overlays

### Accessibility
- Include proper aria-label attributes
- Use autocomplete attributes on form inputs
- Ensure proper color contrast
- Implement keyboard navigation support