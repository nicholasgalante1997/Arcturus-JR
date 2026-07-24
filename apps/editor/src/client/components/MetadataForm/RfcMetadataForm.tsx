import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { rfcFrontmatterSchema, type RfcFrontmatter } from '@arcjr/content';

import type { RfcMetadataFormHandle, RfcMetadataFormProps } from './types';

function toCsv(values: string[] | undefined): string {
  return (values ?? []).join(', ');
}

function fromCsv(csv: string): string[] {
  return csv
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

const RfcMetadataForm = forwardRef<RfcMetadataFormHandle, RfcMetadataFormProps>(function RfcMetadataForm(
  { values, onDirtyChange },
  ref
) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<RfcFrontmatter>({
    resolver: zodResolver(rfcFrontmatterSchema),
    values,
    mode: 'onBlur'
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve) => {
        handleSubmit(
          (data) => resolve(data),
          () => resolve(null)
        )();
      })
  }));

  return (
    <form className="editor-metadata-form" onSubmit={(e) => e.preventDefault()}>
      <div className="editor-field editor-field--span-2">
        <label htmlFor="title">Title</label>
        <input id="title" type="text" {...register('title')} />
        {errors.title && <span className="editor-field__error">{errors.title.message}</span>}
      </div>

      <div className="editor-field">
        <label htmlFor="version">Version</label>
        <input id="version" type="text" {...register('version')} />
        {errors.version && <span className="editor-field__error">{errors.version.message}</span>}
      </div>

      <div className="editor-field">
        <label htmlFor="status">Status</label>
        <input id="status" type="text" {...register('status')} />
        {errors.status && <span className="editor-field__error">{errors.status.message}</span>}
      </div>

      <div className="editor-field">
        <label htmlFor="date">Date</label>
        <input id="date" type="text" placeholder="YYYY-MM-DD" {...register('date')} />
        {errors.date && <span className="editor-field__error">{errors.date.message}</span>}
      </div>

      <div className="editor-field">
        <label htmlFor="author">Author</label>
        <input id="author" type="text" {...register('author')} />
        {errors.author && <span className="editor-field__error">{errors.author.message}</span>}
      </div>

      <div className="editor-field editor-field--checkbox">
        <input id="visible" type="checkbox" {...register('visible')} />
        <label htmlFor="visible">Visible (published)</label>
      </div>

      <div className="editor-field editor-field--span-2">
        <label htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" {...register('excerpt')} />
        {errors.excerpt && <span className="editor-field__error">{errors.excerpt.message}</span>}
      </div>

      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <div className="editor-field editor-field--span-2">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={toCsv(field.value)}
              onChange={(e) => field.onChange(fromCsv(e.target.value))}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </form>
  );
});

export default RfcMetadataForm;
