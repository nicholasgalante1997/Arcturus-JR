import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { postFrontmatterSchema, type PostFrontmatter } from '@arcjr/content';

import { ImagePicker } from '../ImagePicker';
import type { PostMetadataFormHandle, PostMetadataFormProps } from './types';

function toCsv(values: string[] | undefined): string {
  return (values ?? []).join(', ');
}

function fromCsv(csv: string): string[] {
  return csv
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

const PostMetadataForm = forwardRef<PostMetadataFormHandle, PostMetadataFormProps>(function PostMetadataForm(
  { values, imageOptions, onDirtyChange },
  ref
) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<PostFrontmatter>({
    resolver: zodResolver(postFrontmatterSchema),
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
        <label htmlFor="date">Date</label>
        <input id="date" type="text" placeholder="YYYY-MM-DD" {...register('date')} />
        {errors.date && <span className="editor-field__error">{errors.date.message}</span>}
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

      <div className="editor-field">
        <label htmlFor="category">Category</label>
        <input id="category" type="text" {...register('category')} />
        {errors.category && <span className="editor-field__error">{errors.category.message}</span>}
      </div>

      <div className="editor-field">
        <label htmlFor="subcategory">Subcategory</label>
        <input id="subcategory" type="text" {...register('subcategory')} />
        {errors.subcategory && <span className="editor-field__error">{errors.subcategory.message}</span>}
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

      <Controller
        control={control}
        name="searchTerms"
        render={({ field }) => (
          <div className="editor-field editor-field--span-2">
            <label htmlFor="searchTerms">Search terms (comma-separated, optional — defaults to tags)</label>
            <input
              id="searchTerms"
              type="text"
              value={toCsv(field.value)}
              onChange={(e) => field.onChange(e.target.value === '' ? undefined : fromCsv(e.target.value))}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />

      <div className="editor-field">
        <label htmlFor="readingTime">Reading time (optional — auto-computed when blank)</label>
        <input id="readingTime" type="text" {...register('readingTime')} />
      </div>

      <div className="editor-field">
        <label htmlFor="slug">Slug (optional — defaults to filename)</label>
        <input id="slug" type="text" {...register('slug')} />
      </div>

      <div className="editor-fieldset-title">Cover image</div>

      <Controller
        control={control}
        name="image.src"
        render={({ field }) => (
          <div className="editor-image-picker">
            <label htmlFor="image.src">Source</label>
            <input id="image.src" type="text" placeholder="/assets/..." {...field} />
            {errors.image?.src && <span className="editor-field__error">{errors.image.src.message}</span>}
            <ImagePicker options={imageOptions} value={field.value} onChange={field.onChange} />
          </div>
        )}
      />

      <div className="editor-field">
        <label htmlFor="image.alt">Alt text</label>
        <input id="image.alt" type="text" placeholder="Describe the image" {...register('image.alt')} />
        {errors.image?.alt && <span className="editor-field__error">{errors.image.alt.message}</span>}
      </div>

      <div className="editor-field">
        <label htmlFor="image.aspectRatio">Aspect ratio</label>
        <input id="image.aspectRatio" type="text" placeholder="16 / 9" {...register('image.aspectRatio')} />
        {errors.image?.aspectRatio && <span className="editor-field__error">{errors.image.aspectRatio.message}</span>}
      </div>
    </form>
  );
});

export default PostMetadataForm;
