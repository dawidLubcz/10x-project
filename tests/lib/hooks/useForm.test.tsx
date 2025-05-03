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
    render(<TestForm validators={{ foo: () => null, bar: () => null }} onSubmit={vi.fn()} />);
    expect(screen.getByTestId('foo-value').textContent).toBe('');
    expect(screen.getByTestId('bar-value').textContent).toBe('');
    expect(screen.getByTestId('foo-error').textContent).toBe('');
    expect(screen.getByTestId('bar-error').textContent).toBe('');
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });

  it('updates values on handleChange', () => {
    render(<TestForm validators={{ foo: () => null, bar: () => null }} onSubmit={vi.fn()} />);
    const fooInput = screen.getByTestId('foo-input') as HTMLInputElement;
    fireEvent.change(fooInput, { target: { value: 'abc' } });
    expect(screen.getByTestId('foo-value').textContent).toBe('abc');
  });

  it('validate returns false and sets errors for invalid fields', () => {
    const validators = {
      foo: (v: string) => (!v ? 'required' : null),
      bar: (v: string) => (!v ? 'requiredBar' : null)
    };
    render(<TestForm validators={validators} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByTestId('validate-btn'));
    expect(screen.getByTestId('foo-error').textContent).toBe('required');
    expect(screen.getByTestId('bar-error').textContent).toBe('requiredBar');
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });

  it('validate returns true and clears errors when valid', () => {
    const validators = {
      foo: () => null,
      bar: () => null
    };
    render(<TestForm validators={validators} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByTestId('foo-input'), { target: { value: 'x' } });
    fireEvent.change(screen.getByTestId('bar-input'), { target: { value: 'y' } });
    fireEvent.click(screen.getByTestId('validate-btn'));
    expect(screen.getByTestId('foo-error').textContent).toBe('');
    expect(screen.getByTestId('bar-error').textContent).toBe('');
  });

  it('reset restores initial values and clears errors', () => {
    const validators = { foo: () => 'error', bar: () => 'error' };
    render(<TestForm validators={validators} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByTestId('foo-input'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByTestId('bar-input'), { target: { value: 'def' } });
    fireEvent.click(screen.getByTestId('validate-btn'));
    fireEvent.click(screen.getByTestId('reset-btn'));
    expect(screen.getByTestId('foo-value').textContent).toBe('');
    expect(screen.getByTestId('bar-value').textContent).toBe('');
    expect(screen.getByTestId('foo-error').textContent).toBe('');
    expect(screen.getByTestId('bar-error').textContent).toBe('');
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const validators = { foo: () => 'error', bar: () => null };
    render(<TestForm validators={validators} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });

  it('calls onSubmit when validation passes', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const validators = { foo: () => null, bar: () => null };
    render(<TestForm validators={validators} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId('foo-input'), { target: { value: 'hello' } });
    fireEvent.change(screen.getByTestId('bar-input'), { target: { value: 'world' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ foo: 'hello', bar: 'world' });
    });
    expect(screen.getByTestId('isSubmitting').textContent).toBe('false');
  });
}); 