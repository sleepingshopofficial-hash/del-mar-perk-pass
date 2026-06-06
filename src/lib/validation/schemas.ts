import { z } from 'zod'

// ============================================================
// Session Schemas
// ============================================================

export const createSessionSchema = z.object({
  event_name: z.string().min(1).max(200),
  page: z.string().min(1).max(500),
  domain: z.string().min(1).max(200),
  partner_offer: z.string().max(200).nullable().optional(),
  qr_source: z.string().max(200).nullable().optional(),
  qr_location: z.string().max(200).nullable().optional(),
  language: z.string().max(10).default('en'),
  device_type: z.string().max(50).nullable().optional(),
  consent_status: z.enum(['granted', 'denied', 'pending']).default('pending'),
})

export const updateSessionSchema = z.object({
  session_id: z.string().uuid(),
  first_click_path: z.string().max(200).nullable().optional(),
  selected_path: z.string().max(200).nullable().optional(),
  completed: z.boolean().optional(),
  language: z.string().max(10).optional(),
})

// ============================================================
// Lead Schemas
// ============================================================

export const createLeadSchema = z.object({
  session_id: z.string().uuid().optional(),
  first_name: z.string().min(1).max(100),
  mobile_number: z.string().min(7).max(20),
  email: z.string().email().max(200).optional().or(z.literal('')),
  at_del_mar_today: z.boolean().default(false),
  selected_path: z.string().min(1).max(200),
  tags: z.array(z.string().max(100)).default([]),
  sorting_answers: z
    .array(
      z.object({
        question_key: z.string().max(200),
        answer_value: z.string().max(500),
      })
    )
    .optional(),
  language: z.string().max(10).default('en'),
})

// ============================================================
// Buyer Schemas
// ============================================================

export const createBuyerSchema = z.object({
  first_name: z.string().min(1).max(100),
  mobile_number: z.string().min(7).max(20),
  email: z.string().email().max(200).optional().or(z.literal('')),
  purchase_date: z.string().min(1),
  units_purchased: z.number().int().min(1),
  pickup_status: z.enum(['picked_up', 'needs_pickup', 'shipping']),
  salesperson: z.string().max(100).optional().or(z.literal('')),
})

// ============================================================
// Referral Schemas
// ============================================================

export const createReferralSchema = z.object({
  referrer_name: z.string().min(1).max(100),
  referrer_mobile: z.string().min(7).max(20),
  friend_name: z.string().min(1).max(100),
  friend_contact: z.string().min(1).max(200),
  friend_offer: z.enum(['cookie_perk', 'cooling_perk', 'general']),
})

// ============================================================
// Analytics Schemas
// ============================================================

export const createAnalyticsEventSchema = z.object({
  session_id: z.string().uuid().optional(),
  event_type: z.string().min(1).max(100),
  event_data: z.record(z.string(), z.unknown()).nullable().optional(),
  page_path: z.string().max(500).optional(),
})

// ============================================================
// Dashboard Schemas
// ============================================================

export const dateRangeSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export const searchSchema = z.object({
  q: z.string().max(200).default(''),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const exportSchema = z.object({
  type: z.enum(['leads', 'buyers', 'referrals']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})
