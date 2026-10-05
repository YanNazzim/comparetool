// src/App.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import {
  findProductById,
  getProductSpecInfo,
  resolveVonDuprinCallout,
  resolveSargentCallout,
  parseHardwareQuery
} from './utils/hardwareEngine';

describe('Sargent Compare Tool & AI Spec Advisor', () => {
  it('renders without crashing and displays header and switcher tabs', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText(/Sargent Product Comparison Tool/i)).toBeDefined();
    expect(screen.getAllByText(/AI Spec Advisor/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Classic Comparison/i)).toBeDefined();
  });

  it('switches between AI Spec Advisor and Classic Comparison modes', () => {
    render(<App />);
    const classicTab = screen.getByText(/Classic Comparison/i);
    fireEvent.click(classicTab);
    expect(screen.getByText(/Select Product Category:/i)).toBeDefined();

    const aiTab = screen.getByText(/AI Spec Advisor/i);
    fireEvent.click(aiTab);
    expect(screen.getByText(/Welcome to the Architectural Hardware Spec Advisor/i)).toBeDefined();
  });

  describe('Von Duprin Device Callout Accuracy', () => {
    it('properly calls out 9875 Mortise Lock exit device as 9875L (NOT RIM-L-89)', () => {
      const p = findProductById('vd-9875-l');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('9875L');
      expect(spec.combinedNumber).not.toContain('RIM');
      expect(spec.combinedNumber).not.toContain('89');
      expect(spec.trimStyle).toContain('996L');
    });

    it('properly calls out 78 Series Wide Stile Rim as 78L (NOT RIM-L-89)', () => {
      const p = findProductById('vd-78-rim-l-89');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('78L');
      expect(spec.combinedNumber).not.toContain('RIM');
      expect(spec.combinedNumber).not.toContain('89');
      expect(spec.trimStyle).toContain('780L');
    });

    it('properly calls out 75 Series Narrow Stile Rim as 75L (NOT RIM-L-89)', () => {
      const p = findProductById('vd-75-rim-l-89');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('75L');
      expect(spec.combinedNumber).not.toContain('RIM');
      expect(spec.combinedNumber).not.toContain('89');
      expect(spec.trimStyle).toContain('360L');
    });

    it('properly calls out 88 Series Crossbar Rim as 88L (NOT RIM-L-89)', () => {
      const p = findProductById('vd-88-rim-l-89');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('88L');
      expect(spec.combinedNumber).not.toContain('RIM');
      expect(spec.combinedNumber).not.toContain('89');
    });

    it('properly calls out 8875 Mortise Lock as 8875L (NOT 8875-L-89 or RIM)', () => {
      const p = findProductById('vd-88-8875-l-89');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('8875L');
      expect(spec.combinedNumber).not.toContain('89');
    });

    it('properly calls out 33A Narrow Stile Rim as 33A-L (NOT RIM-L-89)', () => {
      const p = findProductById('vd-33-rim-l-89');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('33A-L');
      expect(spec.combinedNumber).not.toContain('RIM');
      expect(spec.combinedNumber).not.toContain('89');
    });

    it('properly calls out 55 Series Rim as 55L', () => {
      const p = findProductById('vd-55-rim-l');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('55L');
      expect(spec.trimStyle).toContain('379L');
    });
  });

  describe('Sargent Device Callout Accuracy', () => {
    it('properly decodes Sargent 8313 ET as Function 13 (ANSI 08)', () => {
      const p = findProductById('sargent-8313-et');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('8313 ET');
      expect(spec.functionCode).toBe('13');
      expect(spec.ansiCode).toBe('ANSI 08');
    });

    it('properly decodes Sargent 8804 ET as Function 04 (ANSI 03)', () => {
      const p = findProductById('sargent-8804-et');
      expect(p).toBeDefined();
      const spec = getProductSpecInfo(p);
      expect(spec.combinedNumber).toBe('8804 ET');
      expect(spec.functionCode).toBe('04');
      expect(spec.ansiCode).toBe('ANSI 03');
    });
  });

  describe('Offline NLP Query Processor', () => {
    it('parses "8313" and returns Sargent 8313 ET vs Von Duprin equivalent', () => {
      const res = parseHardwareQuery('8313');
      expect(res.type).toBe('PRODUCT_MATCH');
      expect(res.product1.id).toBe('sargent-8313-et');
      expect(res.text).toContain('8313 ET');
    });

    it('parses "what is ANSI 08" and explains Classroom operation', () => {
      const res = parseHardwareQuery('what is ANSI 08');
      expect(res.type).toBe('SPEC_EXPLANATION');
      expect(res.text).toContain('Classroom Function');
      expect(res.text).toContain('Function 13');
      expect(res.text).toContain('Suffix L');
    });
  });
});
