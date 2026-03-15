import { describe, it, expect } from 'vitest';
import { normalizeApiErrorMessage } from './error-message';

const FALLBACK = 'An unexpected error occurred';

describe('normalizeApiErrorMessage', () => {
  it('should return the message from an Error instance', () => {
    const err = new Error('Something went wrong');
    expect(normalizeApiErrorMessage(err, FALLBACK)).toBe('Something went wrong');
  });

  it('should return the fallback for an Error instance with an empty message', () => {
    const err = new Error('');
    expect(normalizeApiErrorMessage(err, FALLBACK)).toBe(FALLBACK);
  });

  it('should return the top-level message property from a plain object', () => {
    const err = { message: 'Top-level message' };
    expect(normalizeApiErrorMessage(err, FALLBACK)).toBe('Top-level message');
  });

  it('should return the nested error.message property, preferring it over a top-level message', () => {
    const err = { message: 'Top-level', error: { message: 'Nested error message' } };
    expect(normalizeApiErrorMessage(err, FALLBACK)).toBe('Nested error message');
  });

  it('should return the fallback for a plain string', () => {
    expect(normalizeApiErrorMessage('some error string', FALLBACK)).toBe(FALLBACK);
  });

  it('should return the fallback for null', () => {
    expect(normalizeApiErrorMessage(null, FALLBACK)).toBe(FALLBACK);
  });

  it('should return the fallback for undefined', () => {
    expect(normalizeApiErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
  });

  it('should return the fallback for an object with no message field', () => {
    const err = { code: 404, status: 'Not Found' };
    expect(normalizeApiErrorMessage(err, FALLBACK)).toBe(FALLBACK);
  });

  it('should return the fallback when the message is an Angular HTTP noise string', () => {
    const err = { message: 'Http failure response for https://api.example.com/books: 0 Unknown Error' };
    expect(normalizeApiErrorMessage(err, FALLBACK)).toBe(FALLBACK);
  });
});
