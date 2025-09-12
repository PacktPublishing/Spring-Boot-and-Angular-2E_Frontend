import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

// Setup Angular testing environment with current APIs
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);
