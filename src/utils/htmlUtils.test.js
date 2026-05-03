import { describe, it, expect } from 'vitest';
import { renderHtmlContent } from './htmlUtils';

describe('renderHtmlContent', () => {
   it('returns empty object for null input', () => {
      expect(renderHtmlContent(null)).toEqual({ __html: '' });
   });

   it('returns empty object for undefined input', () => {
      expect(renderHtmlContent(undefined)).toEqual({ __html: '' });
   });

   it('returns empty object for non-string input', () => {
      expect(renderHtmlContent(123)).toEqual({ __html: '' });
   });

   it('returns empty object for empty string', () => {
      expect(renderHtmlContent('')).toEqual({ __html: '' });
   });

   it('sanitizes script tags', () => {
      const result = renderHtmlContent('<script>alert("xss")</script>Hello');
      expect(result.__html).not.toContain('<script>');
      expect(result.__html).not.toContain('alert');
   });

   it('allows bold tags', () => {
      const result = renderHtmlContent('<b>Bold text</b>');
      expect(result.__html).toContain('<b>');
      expect(result.__html).toContain('Bold text');
   });

   it('allows italic tags', () => {
      const result = renderHtmlContent('<i>Italic text</i>');
      expect(result.__html).toContain('<i>');
   });

   it('allows paragraph tags', () => {
      const result = renderHtmlContent('<p>Paragraph</p>');
      expect(result.__html).toContain('<p>');
   });

   it('allows list tags', () => {
      const result = renderHtmlContent('<ul><li>Item</li></ul>');
      expect(result.__html).toContain('<ul>');
      expect(result.__html).toContain('<li>');
   });

   it('allows links with href', () => {
      const result = renderHtmlContent('<a href="https://example.com">Link</a>');
      expect(result.__html).toContain('<a');
      expect(result.__html).toContain('href="https://example.com"');
   });

   it('strips event handlers', () => {
      const result = renderHtmlContent('<div onclick="alert(1)">Click</div>');
      expect(result.__html).not.toContain('onclick');
   });

   it('returns object with __html property', () => {
      const result = renderHtmlContent('Hello');
      expect(result).toHaveProperty('__html');
   });

   it('preserves table elements', () => {
      const result = renderHtmlContent('<table><tr><th>Header</th></tr><tr><td>Data</td></tr></table>');
      expect(result.__html).toContain('<table>');
      expect(result.__html).toContain('<th>');
      expect(result.__html).toContain('<td>');
   });
});
