import { describe, expect, it } from 'vitest';
import { pt } from '../translations/pt';
import { en } from '../translations/en';
import { es } from '../translations/es';
import { translate } from '../core';

describe('translation catalogs', () => {
  it('keeps PT, EN and ES in exact key parity', () => {
    const ptKeys = Object.keys(pt).sort();
    expect(Object.keys(en).sort()).toEqual(ptKeys);
    expect(Object.keys(es).sort()).toEqual(ptKeys);
  });

  it('never ships empty translation values', () => {
    for (const catalog of [pt, en, es]) {
      for (const value of Object.values(catalog)) {
        expect(typeof value).toBe('string');
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('defines Portuguese as the visible first-run experience', () => {
    expect(pt['landing.division']).toBe('DIVISÃO DE PERFORMANCE');
    expect(pt['landing.system']).toBe('O SISTEMA DE PERFORMANCE MENTAL');
    expect(pt['landing.focus']).toBe('FOCO');
    expect(pt['landing.discipline']).toBe('DISCIPLINA');
    expect(pt['landing.resilience']).toBe('RESILIÊNCIA');
    expect(pt['landing.betterDecisions']).toBe('MELHORES DECISÕES');
    expect(pt['landing.longerGame']).toBe('UM JOGO MAIS LONGO');
    expect(pt['landing.enter']).toBe('ENTRAR NO ENDURANCE');
    expect(pt['nav.home']).toBe('INÍCIO');
    expect(pt['nav.session']).toBe('SESSÃO');
    expect(pt['nav.train']).toBe('TREINO');
    expect(pt['nav.profile']).toBe('PERFIL');
  });

  it('resolves strings from the requested locale', () => {
    expect(translate('pt', 'nav.home')).toBe('INÍCIO');
    expect(translate('en', 'nav.home')).toBe('HOME');
    expect(translate('es', 'nav.home')).toBe('INICIO');
  });
});
