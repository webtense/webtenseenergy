import { describe, it, expect } from 'vitest';
import { normalizePath, withBasePath } from '../paths';

describe('normalizePath', () => {
  it('devuelve / para string vacío', () => {
    expect(normalizePath('')).toBe('/');
  });

  it('añade barra inicial si falta', () => {
    expect(normalizePath('blog')).toBe('/blog');
  });

  it('elimina barra final', () => {
    expect(normalizePath('/blog/')).toBe('/blog');
  });

  it('elimina múltiples barras finales', () => {
    expect(normalizePath('/blog///')).toBe('/blog');
  });

  it('preserva rutas con segmentos múltiples', () => {
    expect(normalizePath('/blog/articulo')).toBe('/blog/articulo');
  });

  it('devuelve / cuando el path es solo barra', () => {
    expect(normalizePath('/')).toBe('/');
  });
});

describe('withBasePath', () => {
  it('combina basePath y path', () => {
    expect(withBasePath('/es', '/blog')).toBe('/es/blog');
  });

  it('devuelve solo el path si basePath está vacío', () => {
    expect(withBasePath('', '/blog')).toBe('/blog');
  });

  it('devuelve basePath cuando el path es /', () => {
    expect(withBasePath('/es', '/')).toBe('/es');
  });

  it('normaliza basePath sin barra inicial', () => {
    expect(withBasePath('es', '/blog')).toBe('/es/blog');
  });
});
