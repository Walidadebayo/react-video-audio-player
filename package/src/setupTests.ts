import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserver;

// Mock HTMLMediaElement.prototype.play
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
});

// Mock HTMLMediaElement.prototype.pause
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: jest.fn(),
});

// Mock HTMLMediaElement.prototype.load
Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: jest.fn(),
});

// Mock Fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  configurable: true,
  enumerable: true,
  get: jest.fn(() => null),
});

Object.defineProperty(document, 'exitFullscreen', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: jest.fn().mockImplementation(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      enumerable: true,
      get: jest.fn(() => null),
    });
    return Promise.resolve();
  }),
});

Object.defineProperty(HTMLDivElement.prototype, 'requestFullscreen', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: jest.fn().mockImplementation(function (this: HTMLDivElement) {
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      enumerable: true,
      get: () => this,
    });
    return Promise.resolve();
  }),
});