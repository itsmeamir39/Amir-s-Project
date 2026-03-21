/**
 * Error Handler Service
 * Centralized error handling and user-friendly message generation
 * Follows clean architecture principle of separation of concerns
 */

import type { PostgrestError } from '@supabase/supabase-js';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  statusCode: number;
}

/**
 * Supabase error codes
 */
enum SupabaseErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  NOT_NULL_VIOLATION = '23502',
  INVALID_TEXT_REPRESENTATION = '22P02',
  UNDEFINED_TABLE = '42P01',
  UNDEFINED_COLUMN = '42703',
  PERMISSION_DENIED = '42501',
}

/**
 * Handle Supabase/PostgreSQL errors
 * Maps database errors to user-friendly messages
 * @param error - PostgreSQL error from Supabase
 * @returns AppError with appropriate messaging
 */
export function handleDatabaseError(error: PostgrestError): AppError {
  const errorCode = error.code || 'UNKNOWN';

  switch (errorCode) {
    case SupabaseErrorCode.UNIQUE_VIOLATION:
      return {
        code: 'DUPLICATE_ENTRY',
        message: error.message,
        userMessage: 'This record already exists. Please check your input.',
        statusCode: 409,
      };

    case SupabaseErrorCode.FOREIGN_KEY_VIOLATION:
      return {
        code: 'INVALID_REFERENCE',
        message: error.message,
        userMessage: 'Invalid reference to related record. Please ensure all required items exist.',
        statusCode: 400,
      };

    case SupabaseErrorCode.NOT_NULL_VIOLATION:
      return {
        code: 'MISSING_REQUIRED_FIELD',
        message: error.message,
        userMessage: 'A required field is missing. Please fill in all required information.',
        statusCode: 400,
      };

    case SupabaseErrorCode.INVALID_TEXT_REPRESENTATION:
      return {
        code: 'INVALID_FORMAT',
        message: error.message,
        userMessage: 'Invalid data format. Please check your input.',
        statusCode: 400,
      };

    case SupabaseErrorCode.UNDEFINED_TABLE:
    case SupabaseErrorCode.UNDEFINED_COLUMN:
      return {
        code: 'DATABASE_SCHEMA_ERROR',
        message: error.message,
        userMessage: 'System error: Database schema mismatch. Please contact support.',
        statusCode: 500,
      };

    case SupabaseErrorCode.PERMISSION_DENIED:
      return {
        code: 'PERMISSION_DENIED',
        message: error.message,
        userMessage: 'You do not have permission to perform this action.',
        statusCode: 403,
      };

    default:
      return {
        code: 'DATABASE_ERROR',
        message: error.message,
        userMessage: 'A database error occurred. Please try again later.',
        statusCode: 500,
      };
  }
}

/**
 * Handle authentication errors
 * @param error - Error from auth service
 * @returns AppError with appropriate messaging
 */
export function handleAuthError(error: Error): AppError {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return {
      code: 'INVALID_CREDENTIALS',
      message: error.message,
      userMessage: 'Invalid email or password. Please try again.',
      statusCode: 401,
    };
  }

  if (message.includes('user not found')) {
    return {
      code: 'USER_NOT_FOUND',
      message: error.message,
      userMessage: 'User account not found.',
      statusCode: 404,
    };
  }

  if (message.includes('email already in use')) {
    return {
      code: 'DUPLICATE_EMAIL',
      message: error.message,
      userMessage: 'This email is already registered. Please use a different email or try logging in.',
      statusCode: 409,
    };
  }

  return {
    code: 'AUTH_ERROR',
    message: error.message,
    userMessage: 'Authentication error. Please try again.',
    statusCode: 401,
  };
}

/**
 * Handle validation errors
 * @param fieldName - Field that failed validation
 * @param reason - Reason for validation failure
 * @returns AppError with appropriate messaging
 */
export function handleValidationError(fieldName: string, reason: string): AppError {
  return {
    code: 'VALIDATION_ERROR',
    message: `Validation failed for field ${fieldName}: ${reason}`,
    userMessage: `Invalid ${fieldName.toLowerCase()}: ${reason}. Please correct this before continuing.`,
    statusCode: 400,
  };
}

/**
 * Handle business logic errors (e.g., fine limits, borrow limits)
 * @param reason - Reason for business logic failure
 * @returns AppError with appropriate messaging
 */
export function handleBusinessLogicError(reason: string): AppError {
  return {
    code: 'BUSINESS_LOGIC_ERROR',
    message: reason,
    userMessage: reason,
    statusCode: 422,
  };
}

/**
 * Create a generic application error
 * @param code - Error code
 * @param message - Technical error message
 * @param userMessage - User-friendly message
 * @param statusCode - HTTP status code
 * @returns AppError
 */
export function createError(
  code: string,
  message: string,
  userMessage: string,
  statusCode: number = 500
): AppError {
  return {
    code,
    message,
    userMessage,
    statusCode,
  };
}

/**
 * Check if an error is a PostgrestError
 * @param error - Error object to check
 * @returns Boolean indicating if error is a PostgrestError
 */
export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

/**
 * Safely handle any error type and return AppError
 * @param error - Any error object
 * @returns AppError with appropriate handling
 */
export function handleError(error: unknown): AppError {
  if (isPostgrestError(error)) {
    return handleDatabaseError(error);
  }

  if (error instanceof Error) {
    if (error.message.includes('auth')) {
      return handleAuthError(error);
    }

    return createError(
      'UNKNOWN_ERROR',
      error.message,
      'An unexpected error occurred. Please try again.',
      500
    );
  }

  return createError(
    'UNKNOWN_ERROR',
    String(error),
    'An unexpected error occurred. Please try again.',
    500
  );
}
