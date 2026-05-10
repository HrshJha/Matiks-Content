export interface ProviderResult<T> {
  success: boolean;
  data?: T;
  error?: ProviderError;
}

export interface ProviderError {
  code: string;
  message: string;
  provider: string;
  details?: unknown;
}

export interface ProviderClient<I, O> {
  call(input: I): Promise<ProviderResult<O>>;
  mock(input: I): Promise<ProviderResult<O>>;
}

export function createProviderError(
  code: string,
  message: string,
  provider: string,
  details?: unknown
): ProviderError {
  return { code, message, provider, details };
}