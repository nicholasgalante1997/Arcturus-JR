import { memo, useRef, useState } from 'react';

import copy from '@/content/en.json';
import { pipeline } from '@/utils/pipeline';

import type { ContactFormData } from '../../types';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnnpkkjo';
const { contact } = copy;

function ContactFormView() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = contact.validation.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = contact.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = contact.validation.emailInvalid;
    }

    if (!formData.subject) {
      newErrors.subject = contact.validation.subjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = contact.validation.messageRequired;
    } else if (formData.message.trim().length < 20) {
      newErrors.message = contact.validation.messageLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData(formRef.current);
    fetch(formRef.current.action, {
      method: formRef.current.method,
      body: data,
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          setSubmitSuccess(true);
          setIsSubmitting(false);
          setSubmitError(null);
          formRef.current?.reset();
        } else {
          setSubmitError(contact.submitError);
          setIsSubmitting(false);
          console.error('Form submission error:', response.statusText);
        }
      })
      .catch((error) => {
        setSubmitError(contact.submitError);
        setIsSubmitting(false);
        console.error('Form submission error:', error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (submitSuccess) {
    return (
      <div className="v2-contact-form__success" role="status">
        <p className="v2-contact-form__success-mark" aria-hidden="true">
          ✓
        </p>
        <h3>{contact.successTitle}</h3>
        <p>{contact.successDescription}</p>
      </div>
    );
  }

  return (
    <form
      className="v2-contact-form"
      id="_v2-contact-form"
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
      ref={formRef}
      noValidate
    >
      <div className="v2-contact-field">
        <label htmlFor="contact-name">{contact.fields.name}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="v2-contact-field__error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="v2-contact-field">
        <label htmlFor="contact-email">{contact.fields.email}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="v2-contact-field__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="v2-contact-field">
        <label htmlFor="contact-subject">{contact.fields.subject}</label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        >
          {contact.subjects.map((option) => (
            <option key={option.value || 'empty'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="contact-subject-error" className="v2-contact-field__error">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="v2-contact-field">
        <label htmlFor="contact-message">{contact.fields.message}</label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder={contact.fields.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="v2-contact-field__error">
            {errors.message}
          </p>
        )}
      </div>

      {submitError && (
        <div className="v2-contact-form__error" role="alert">
          {submitError}
        </div>
      )}

      <button type="submit" className="v2-contact-form__submit" disabled={isSubmitting}>
        {isSubmitting ? contact.submitting : contact.submit}
      </button>
    </form>
  );
}

export default pipeline(memo)(ContactFormView);
