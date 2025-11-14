import { defaultSchema } from 'rehype-sanitize';

export const modifiedSanitizationSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...((defaultSchema?.attributes || {})['*'] || []),
      'className',
      'class',
      'id',
      'style',
      'data*' // Allow all data attributes
    ],
    div: ['id', 'className', 'class', 'style', 'data*'],
    span: ['id', 'className', 'class', 'style', 'data*']
  }
};
