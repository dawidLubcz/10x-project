import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from '@/lib/hooks/useForm';

type FormState = { foo: string; bar: string };
const initialState: FormState = { foo: '', bar: '' };

function TestForm({
  validators,
  onSubmit
}: {
  validators: Record<keyof FormState, (value: any) => string | null>;
  onSubmit: (values: FormState) => Promise<void>;
}) {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    handleSubmit,
    reset
  } = useForm<FormState>(initialState);

  return (
    <>
      <input data-testid="foo-input" name="foo" value={values.foo} onChange={handleChange} />
      <input data-testid="bar-input" name="bar" value={values.bar} onChange={handleChange} />
      <button data-testid="validate-btn" onClick={() => validate(validators)}>
        Validate
      </button>
      <button data-testid="reset-btn" onClick={reset}>Reset</button>
      <button data-testid="submit-btn" onClick={handleSubmit(validators, onSubmit)}>
        Submit
      </button>
      <div data-testid="foo-value">{values.foo}</div>
      <div data-testid="bar-value">{values.bar}</div>
      <div data-testid="foo-error">{errors.foo || ''}</div>
      <div data-testid="bar-error">{errors.bar || ''}</div>
      <div data-testid="isSubmitting">{String(isSubmitting)}</div>
    </>
  );
}

describe('useForm hook', () => {
  it('initializes with provided state and empty errors', () => {
    // Given: a fresh form with default initial values and no validators triggered
    render(<TestForm validators={{ foo: () => null, bar: () => null }} onSubmit={vi.fn()} />);

    // Then: values are empty, no errors, and not submitting
    expect(screen.getByTestId('foo-value').textContent).toBe('');
    expect(screen.getByTestId('bar-value').textContent).toBe('');
    expect(screen.getByTestId('foo-error').textContent).toBe('');
    expect(screen.getByTestId('bar-error').textContent).toBe('');
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });

  it('updates values on handleChange', () => {
    // Given: a rendered form
    render(<TestForm validators={{ foo: () => null, bar: () => null }} onSubmit={vi.fn()} />);
    const fooInput = screen.getByTestId('foo-input') as HTMLInputElement;

    // When: user types into the foo field
    fireEvent.change(fooInput, { target: { value: 'abc' } });

    // Then: foo-value should update
    expect(screen.getByTestId('foo-value').textContent).toBe('abc');
  });

  it('validate returns false and sets errors for invalid fields', () => {
    // Given: validators that require non-empty values
    const validators = {
      foo: (v: string) => (!v ? 'required' : null),
      bar: (v: string) => (!v ? 'requiredBar' : null)
    };
    render(<TestForm validators={validators} onSubmit={vi.fn()} />);

    // When: clicking the Validate button with empty fields
    fireEvent.click(screen.getByTestId('validate-btn'));

    // Then: errors should be shown for each field and isSubmitting remains false
    expect(screen.getByTestId('foo-error').textContent).toBe('required');
    expect(screen.getByTestId('bar-error').textContent).toBe('requiredBar');
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });

  it('validate returns true and clears errors when valid', () => {
    // Given: validators that always pass
    const validators = { foo: () => null, bar: () => null };
    render(<TestForm validators={validators} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByTestId('foo-input'), { target: { value: 'x' } });
    fireEvent.change(screen.getByTestId('bar-input'), { target: { value: 'y' } });

    // When: clicking the Validate button with valid inputs
    fireEvent.click(screen.getByTestId('validate-btn'));

    // Then: all validation errors should be cleared
    expect(screen.getByTestId('foo-error').textContent).toBe('');
    expect(screen.getByTestId('bar-error').textContent).toBe('');
  });

  it('reset restores initial values and clears errors', () => {
    // Given: form with values and validation errors
    const validators = { foo: () => 'error', bar: () => 'error' };
    render(<TestForm validators={validators} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByTestId('foo-input'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByTestId('bar-input'), { target: { value: 'def' } });
    fireEvent.click(screen.getByTestId('validate-btn'));

    // When: clicking the Reset button
    fireEvent.click(screen.getByTestId('reset-btn'));

    // Then: values and errors should be reset to initial state
    expect(screen.getByTestId('foo-value').textContent).toBe('');
    expect(screen.getByTestId('bar-value').textContent).toBe('');
    expect(screen.getByTestId('foo-error').textContent).toBe('');
    expect(screen.getByTestId('bar-error').textContent).toBe('');
  });

  it('does not call onSubmit when validation fails', async () => {
    // Given: form with validators that cause validation failure
    const onSubmit = vi.fn(() => Promise.resolve());
    const validators = { foo: () => 'error', bar: () => null };
    render(<TestForm validators={validators} onSubmit={onSubmit} />);

    // When: clicking the Submit button
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      // Then: onSubmit should not be called and isSubmitting resets to false
      expect(onSubmit).not.toHaveBeenCalled();
    });
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });

  it('calls onSubmit when validation passes', async () => {
    // Given: form with valid inputs and validators that pass
    const onSubmit = vi.fn(() => Promise.resolve());
    const validators = { foo: () => null, bar: () => null };
    render(<TestForm validators={validators} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId('foo-input'), { target: { value: 'hello' } });
    fireEvent.change(screen.getByTestId('bar-input'), { target: { value: 'world' } });

    // When: clicking the Submit button
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      // Then: onSubmit should be called with form values and isSubmitting resets to false
      expect(onSubmit).toHaveBeenCalledWith({ foo: 'hello', bar: 'world' });
    });
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });
}); 