# Forge Fitness — Gym Growth Platform

A production-minded demo of a gym lead-generation and business-growth platform designed to help fitness businesses capture, manage, and convert prospective members.

> **Demo project:** All gym information, trainers, pricing, testimonials, contact details, and lead records are fictional sample data. No real business or personal data is used.

---

## 🎯 The Business Problem

Many local gyms rely on fragmented processes to handle new enquiries:

- Leads arrive through different channels
- Follow-ups can be missed
- Staff have limited visibility into enquiry status
- Trial bookings are difficult to track
- Lead information can become scattered
- Owners lack a simple view of their conversion pipeline

The goal of this platform is to demonstrate how a modern digital system could centralize the journey from:

**Visitor → Enquiry → Trial → Follow-up → Membership**

---

# 🚀 What the Demo Includes

## 1. Gym Marketing Website

A conversion-focused website designed to turn visitors into qualified enquiries.

### Includes

- Hero section
- Book Free Trial CTA
- About section
- Training programs
- Membership plans
- Trainers
- Gallery
- Testimonials
- Opening hours
- FAQ
- Location
- Contact section
- Closing CTA

The interface uses a responsive, mobile-first design with accessible interactions and restrained motion.

---

## 2. Lead Capture

Visitors can click **Book Free Trial** from multiple locations throughout the website.

The enquiry form collects:

- Name
- Phone
- Email
- Fitness goal
- Preferred training type
- Preferred time
- Optional message

After submission, the user receives a confirmation state with a generated enquiry reference number.

---

## 3. Lead Management Dashboard

The `/demo-admin` route demonstrates the operational side of the platform.

### Dashboard capabilities

- Total leads
- New enquiries
- Trials booked
- Joined members
- Searchable lead table
- Lead filtering
- Lead details
- Lead status updates
- Internal notes
- Follow-up tracking
- Overdue follow-up indicators

Website enquiries appear in the dashboard immediately during the current browser session.

---

## 4. Lead Lifecycle

The demo models a simplified business pipeline:

```text
Website Visitor
      ↓
Free Trial Enquiry
      ↓
New Lead
      ↓
Follow-up
      ↓
Trial Booked
      ↓
Membership Decision
      ↓
Joined
