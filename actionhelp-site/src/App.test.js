import { highlightSearch } from './highlightSearch';

test('highlights a literal query and restores the original text', () => {
  const container = document.createElement('section');
  container.innerHTML = '<p>Help (now) &amp; learn</p><a href="/contact">Contact</a>';
  document.body.append(container);
  const cleanup = highlightSearch(container, '(now)');
  expect(container.querySelector('mark')?.textContent).toBe('(now)');
  expect(container.querySelector('a')?.getAttribute('href')).toBe('/contact');
  cleanup();
  expect(container.querySelector('mark')).toBeNull();
  expect(container.querySelector('p')?.textContent).toBe('Help (now) & learn');
  container.remove();
});

test('never interprets search text as HTML', () => {
  const container = document.createElement('div');
  container.textContent = '<img src=x onerror=alert(1)>';
  document.body.append(container);
  highlightSearch(container, '<img src=x onerror=alert(1)>');
  expect(container.querySelector('img')).toBeNull();
  expect(container.querySelector('mark')?.textContent).toBe('<img src=x onerror=alert(1)>');
  container.remove();
});
