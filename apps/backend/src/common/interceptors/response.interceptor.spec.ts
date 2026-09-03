import { ExecutionContext, CallHandler } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
import { of, Observable } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: Partial<CallHandler>;
  let mockResponse: any;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();

    mockResponse = {
      statusCode: 200,
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;
  });

  it('should wrap response with proper envelope for 200 status', (done) => {
    const testData = { id: '123', name: 'Test' };
    mockCallHandler = {
      handle: (): Observable<any> => of(testData),
    };

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler as CallHandler);

    result$.subscribe((response) => {
      expect(response).toEqual({
        statusCode: 200,
        message: 'Request successful',
        data: testData,
        timestamp: expect.any(String),
      });
      expect(response.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
      done();
    });
  });

  it('should wrap response with proper envelope for 201 status', (done) => {
    mockResponse.statusCode = 201;
    const testData = { id: '123', name: 'Created' };
    mockCallHandler = {
      handle: (): Observable<any> => of(testData),
    };

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler as CallHandler);

    result$.subscribe((response) => {
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('Resource created successfully');
      expect(response.data).toEqual(testData);
      done();
    });
  });

  it('should use generic message for unknown status codes', (done) => {
    mockResponse.statusCode = 999;
    const testData = { test: 'data' };
    mockCallHandler = {
      handle: (): Observable<any> => of(testData),
    };

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler as CallHandler);

    result$.subscribe((response) => {
      expect(response.message).toBe('Success');
      done();
    });
  });

  it('should include timestamp in ISO format', (done) => {
    mockCallHandler = {
      handle: (): Observable<any> => of({ test: 'data' }),
    };

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler as CallHandler);

    result$.subscribe((response) => {
      expect(response.timestamp).toBeTruthy();
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
      done();
    });
  });

  it('should handle different response types', (done) => {
    const arrayData = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    mockCallHandler = {
      handle: (): Observable<any> => of(arrayData),
    };

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler as CallHandler);

    result$.subscribe((response) => {
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toEqual(arrayData);
      done();
    });
  });

  it('should handle null data', (done) => {
    mockCallHandler = {
      handle: (): Observable<any> => of(null),
    };

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler as CallHandler);

    result$.subscribe((response) => {
      expect(response.data).toBeNull();
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
