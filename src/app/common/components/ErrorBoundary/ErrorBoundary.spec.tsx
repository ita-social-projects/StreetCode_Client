import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Error thrown from problem child');
};

describe('ErrorBoundary', () => {
  test('renders children without error', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <div>Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  test('renders fallback UI on error', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  test('sets hasError state to true on error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});