import { Routes } from '@angular/router';
import { List } from './pages/list/list';
import { BookForm } from './components/book-form/book-form';

export const routes: Routes = [
  { path: '', component: List },
  { path: 'create', component: BookForm },
  { path: 'edit/:id', component: BookForm },
];
