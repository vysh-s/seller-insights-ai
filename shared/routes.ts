import { z } from 'zod';
import { sellerSummarySchema, metricsSchema, insightsSchema, sellerSchema } from './schema';

export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  sellers: {
    list: {
      method: 'GET' as const,
      path: '/api/sellers' as const,
      responses: {
        200: z.array(sellerSummarySchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/sellers/:id' as const,
      responses: {
        200: sellerSchema,
        404: errorSchemas.notFound,
      },
    },
    metrics: {
      method: 'GET' as const,
      path: '/api/sellers/:id/metrics' as const,
      responses: {
        200: metricsSchema,
        404: errorSchemas.notFound,
      },
    },
    insights: {
      method: 'GET' as const,
      path: '/api/sellers/:id/insights' as const,
      responses: {
        200: insightsSchema,
        404: errorSchemas.notFound,
      },
    },
  },
  health: {
    check: {
      method: 'GET' as const,
      path: '/api/health' as const,
      responses: {
        200: z.object({ status: z.literal("ok") }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
