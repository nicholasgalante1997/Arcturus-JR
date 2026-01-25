# SPEC-14: V2 Contact Page

## Context

This spec implements the V2 Contact page with a contact form, social links, and optional FAQ section. This page enables visitors to reach out while filtering spam through client-side validation.

## Prerequisites

- SPEC-01 through SPEC-09 completed (layout and components ready)
- SPEC-04 completed (form components available)
- Form submission backend endpoint configured (or email service)

## Requirements

### 1. Contact Page Types

Create `apps/web/src/components/v2/Contact/types.ts`:

```typescript
export interface V2ContactViewProps {
  // Static page - no queries needed
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export interface ContactInfoProps {
  email: string;
  socialLinks: SocialLinkItem[];
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  username: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
```

### 2. Contact Form Component

Create `apps/web/src/components/v2/Contact/components/ContactForm/View.tsx`:

```tsx
import { memo, useState } from "react";
import clsx from "clsx";

import { Input, Textarea, Select } from "@arcjr/void-components";
import { pipeline } from "@/utils/pipeline";
import type { ContactFormProps, ContactFormData } from "../../types";

const SUBJECT_OPTIONS = [
  { value: "", label: "Select a subject..." },
  { value: "general", label: "General Inquiry" },
  { value: "collaboration", label: "Collaboration Opportunity" },
  { value: "feedback", label: "Feedback" },
  { value: "bug", label: "Bug Report" },
  { value: "other", label: "Other" },
];

function ContactFormView({
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (submitSuccess) {
    return (
      <div className="v2-contact-form__success">
        <div className="v2-contact-form__success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 24l6 6 12-12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="v2-contact-form__success-title">Message Sent!</h3>
        <p className="v2-contact-form__success-text">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form className="v2-contact-form" onSubmit={handleSubmit} noValidate>
      <div className="v2-contact-form__row">
        <Input
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          fullWidth
          autoComplete="name"
        />
      </div>

      <div className="v2-contact-form__row">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          fullWidth
          autoComplete="email"
        />
      </div>

      <div className="v2-contact-form__row">
        <Select
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          required
          fullWidth
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="v2-contact-form__row">
        <Textarea
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          required
          fullWidth
          rows={6}
          placeholder="Tell me about your project, question, or idea..."
        />
      </div>

      {submitError && (
        <div className="v2-contact-form__error" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {submitError}
        </div>
      )}

      <button
        type="submit"
        className={clsx(
          "void-button void-button--primary void-button--lg v2-contact-form__submit",
          isSubmitting && "void-button--loading"
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default pipeline(memo)(ContactFormView);
```

### 3. Contact Info Component

Create `apps/web/src/components/v2/Contact/components/ContactInfo/View.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import type { ContactInfoProps } from "../../types";

function ContactInfoView({ email, socialLinks }: ContactInfoProps) {
  return (
    <aside className="v2-contact-info">
      <h2 className="v2-contact-info__title">Other Ways to Connect</h2>

      <div className="v2-contact-info__section">
        <h3 className="v2-contact-info__section-title">Email</h3>
        <a href={`mailto:${email}`} className="v2-contact-info__email">
          {email}
        </a>
      </div>

      <div className="v2-contact-info__section">
        <h3 className="v2-contact-info__section-title">Social</h3>
        <ul className="v2-contact-info__social-list">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                className="v2-contact-info__social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="v2-contact-info__social-icon">{link.icon}</span>
                <span className="v2-contact-info__social-name">{link.name}</span>
                <span className="v2-contact-info__social-username">
                  @{link.username}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="v2-contact-info__section">
        <h3 className="v2-contact-info__section-title">Response Time</h3>
        <p className="v2-contact-info__text">
          I typically respond within 24-48 hours during weekdays.
        </p>
      </div>
    </aside>
  );
}

export default pipeline(memo)(ContactInfoView);
```

### 4. FAQ Section Component

Create `apps/web/src/components/v2/Contact/components/FAQSection/View.tsx`:

```tsx
import { memo, useState } from "react";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { FAQItem } from "../../types";

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Are you available for freelance work?",
    answer:
      "I selectively take on freelance projects that align with my expertise. Feel free to reach out with details about your project.",
  },
  {
    question: "Do you do consulting?",
    answer:
      "Yes, I offer consulting services for architecture reviews, performance optimization, and technical strategy. Let's discuss your needs.",
  },
  {
    question: "Can I use your code examples?",
    answer:
      "All code examples on this blog are available under the MIT license unless otherwise noted. Attribution is appreciated but not required.",
  },
  {
    question: "How can I support your work?",
    answer:
      "The best way to support is by sharing articles you find helpful, providing feedback, or connecting with me on social media.",
  },
];

function FAQSectionView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="v2-contact-faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="v2-contact-faq__title">
        Frequently Asked Questions
      </h2>

      <div className="v2-contact-faq__list">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className={clsx(
              "v2-contact-faq__item",
              openIndex === index && "v2-contact-faq__item--open"
            )}
          >
            <button
              type="button"
              className="v2-contact-faq__question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {item.question}
              <svg
                className="v2-contact-faq__icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              id={`faq-answer-${index}`}
              className="v2-contact-faq__answer"
              hidden={openIndex !== index}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(FAQSectionView);
```

### 5. Contact Page View Component

Create `apps/web/src/components/v2/Contact/View.tsx`:

```tsx
import { memo, useState, useCallback } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";
import ContactFormView from "./components/ContactForm/View";
import ContactInfoView from "./components/ContactInfo/View";
import FAQSectionView from "./components/FAQSection/View";
import type { ContactFormData, SocialLinkItem } from "./types";

// Icons
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    name: "GitHub",
    url: "https://github.com/yourusername",
    icon: <GitHubIcon />,
    username: "yourusername",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: <TwitterIcon />,
    username: "yourusername",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: <LinkedInIcon />,
    username: "yourusername",
  },
];

const EMAIL = "hello@example.com";

function V2ContactPageView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = useCallback(async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Replace with actual API call
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="v2-contact-page">
      <div className="v2-container">
        {/* Header */}
        <header className="v2-contact-page__header">
          <h1 className="v2-contact-page__title">Get in Touch</h1>
          <p className="v2-contact-page__description">
            Have a question, project idea, or just want to say hello? I'd love
            to hear from you.
          </p>
        </header>

        {/* Main Content */}
        <div className="v2-contact-page__content">
          <div className="v2-contact-page__form-section">
            <ContactFormView
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              submitSuccess={submitSuccess}
            />
          </div>

          <ContactInfoView email={EMAIL} socialLinks={SOCIAL_LINKS} />
        </div>

        {/* FAQ */}
        <FAQSectionView />
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler("v2_Contact_Page_View"))(V2ContactPageView);
```

### 6. Contact Page Container

Create `apps/web/src/components/v2/Contact/Component.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2ContactPageView from "./View";

function V2ContactPage() {
  // Static page - no data fetching needed
  return <V2ContactPageView />;
}

export default pipeline(withProfiler("v2_Contact_Page"), memo)(V2ContactPage);
```

### 7. Contact Page Styles

Create `apps/web/public/css/pages/v2-contact.css`:

```css
/**
 * V2 Contact Page Styles
 */

.v2-contact-page {
  padding: var(--void-spacing-8) 0 var(--void-spacing-16);
}

/* Header */
.v2-contact-page__header {
  text-align: center;
  margin-bottom: var(--void-spacing-12);
}

.v2-contact-page__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-4);
}

.v2-contact-page__description {
  font-size: 1.125rem;
  color: var(--void-color-gray-400);
  max-width: 600px;
  margin: 0 auto;
}

/* Content Layout */
.v2-contact-page__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--void-spacing-8);
  margin-bottom: var(--void-spacing-16);
}

@media (min-width: 768px) {
  .v2-contact-page__content {
    grid-template-columns: 1fr 300px;
    gap: var(--void-spacing-12);
  }
}

/* Contact Form */
.v2-contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-4);
}

.v2-contact-form__row {
  /* Wrapper for form fields */
}

.v2-contact-form__error {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-2);
  padding: var(--void-spacing-3) var(--void-spacing-4);
  font-size: 0.875rem;
  color: var(--void-color-semantic-error);
  background-color: rgba(239, 68, 68, 0.1);
  border: var(--void-border-width-thin) solid rgba(239, 68, 68, 0.3);
  border-radius: var(--void-border-radius-md);
}

.v2-contact-form__submit {
  margin-top: var(--void-spacing-2);
  align-self: flex-start;
}

/* Success State */
.v2-contact-form__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--void-spacing-12);
  background-color: var(--void-color-gray-950);
  border: var(--void-border-width-thin) solid var(--void-color-gray-900);
  border-radius: var(--void-border-radius-lg);
}

.v2-contact-form__success-icon {
  color: var(--void-color-semantic-success);
  margin-bottom: var(--void-spacing-4);
}

.v2-contact-form__success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-2);
}

.v2-contact-form__success-text {
  font-size: 1rem;
  color: var(--void-color-gray-400);
  margin: 0;
}

/* Contact Info */
.v2-contact-info {
  padding: var(--void-spacing-6);
  background-color: var(--void-color-gray-950);
  border: var(--void-border-width-thin) solid var(--void-color-gray-900);
  border-radius: var(--void-border-radius-lg);
  height: fit-content;
}

.v2-contact-info__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--void-color-base-white);
  margin-bottom: var(--void-spacing-6);
}

.v2-contact-info__section {
  margin-bottom: var(--void-spacing-6);
}

.v2-contact-info__section:last-child {
  margin-bottom: 0;
}

.v2-contact-info__section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-gray-500);
  margin-bottom: var(--void-spacing-2);
}

.v2-contact-info__email {
  font-size: 1rem;
  color: var(--void-color-brand-azure);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast);
}

.v2-contact-info__email:hover {
  color: var(--void-color-brand-violet);
}

.v2-contact-info__social-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-2);
}

.v2-contact-info__social-link {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-3);
  padding: var(--void-spacing-2);
  margin: calc(var(--void-spacing-2) * -1);
  border-radius: var(--void-border-radius-md);
  text-decoration: none;
  transition: background-color var(--void-transition-duration-fast);
}

.v2-contact-info__social-link:hover {
  background-color: var(--void-color-gray-900);
}

.v2-contact-info__social-icon {
  display: flex;
  color: var(--void-color-gray-400);
}

.v2-contact-info__social-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
}

.v2-contact-info__social-username {
  font-size: 0.875rem;
  color: var(--void-color-gray-500);
  margin-left: auto;
}

.v2-contact-info__text {
  font-size: 0.9375rem;
  color: var(--void-color-gray-400);
  line-height: 1.5;
  margin: 0;
}

/* FAQ Section */
.v2-contact-faq {
  max-width: 800px;
  margin: 0 auto;
  padding-top: var(--void-spacing-12);
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-900);
}

.v2-contact-faq__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--void-color-base-white);
  text-align: center;
  margin-bottom: var(--void-spacing-8);
}

.v2-contact-faq__list {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-2);
}

.v2-contact-faq__item {
  border: var(--void-border-width-thin) solid var(--void-color-gray-900);
  border-radius: var(--void-border-radius-lg);
  overflow: hidden;
}

.v2-contact-faq__question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--void-spacing-4);
  font-size: 1rem;
  font-weight: 500;
  color: var(--void-color-base-white);
  text-align: left;
  background-color: var(--void-color-gray-950);
  border: none;
  cursor: pointer;
  transition: background-color var(--void-transition-duration-fast);
}

.v2-contact-faq__question:hover {
  background-color: var(--void-color-gray-900);
}

.v2-contact-faq__icon {
  flex-shrink: 0;
  color: var(--void-color-gray-500);
  transition: transform var(--void-transition-duration-fast);
}

.v2-contact-faq__item--open .v2-contact-faq__icon {
  transform: rotate(180deg);
}

.v2-contact-faq__answer {
  padding: 0 var(--void-spacing-4) var(--void-spacing-4);
  background-color: var(--void-color-gray-950);
}

.v2-contact-faq__answer p {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--void-color-gray-400);
  margin: 0;
}
```

### 8. Component Exports

Create `apps/web/src/components/v2/Contact/index.ts`:

```typescript
export { default as V2ContactPage } from "./Component";
export type {
  ContactFormData,
  ContactFormProps,
  ContactInfoProps,
  SocialLinkItem,
  FAQItem,
} from "./types";
```

## Acceptance Criteria

- [ ] Contact form validates all required fields
- [ ] Email validation uses proper regex
- [ ] Form submission shows loading state
- [ ] Success state displays after submission
- [ ] Error state displays on failure
- [ ] Contact info shows email and social links
- [ ] FAQ accordion expands/collapses
- [ ] Only one FAQ item open at a time
- [ ] Social links open in new tab
- [ ] Static page prerenders without queries
- [ ] Responsive at all breakpoints
- [ ] Accessible with proper form labels and ARIA

## Notes

- Form validation is client-side for UX
- Backend should also validate (not covered in this spec)
- API endpoint `/api/contact` needs implementation
- Social links/email should be updated with real values
- FAQ content can be customized or moved to CMS
- Consider adding honeypot field for spam prevention
- Success state could include reset button

## Verification

```bash
# Build and test
bun run build
bun run serve
# Navigate to http://localhost:4200/contact
# Test form validation
# Test form submission (need mock API)
# Test FAQ accordion
# Check responsive layout
```
