import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatButtonModule, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
