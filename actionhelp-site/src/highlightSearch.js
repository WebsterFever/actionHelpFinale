/** Highlight a literal search term without interpreting it as HTML or a regular expression. */
export function highlightSearch(container, term) {
  if (!container) return () => {};
  const marks = [];
  const query = term?.trim();
  if (!query) return () => {};

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim() || node.parentElement?.closest('mark, script, style, input, textarea')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  let firstMatch;
  for (const node of nodes) {
    const value = node.nodeValue;
    const lower = value.toLocaleLowerCase();
    const needle = query.toLocaleLowerCase();
    let cursor = 0;
    let match = lower.indexOf(needle);
    if (match === -1) continue;
    const fragment = document.createDocumentFragment();
    while (match !== -1) {
      fragment.append(document.createTextNode(value.slice(cursor, match)));
      const mark = document.createElement('mark');
      mark.className = 'highlight';
      mark.textContent = value.slice(match, match + query.length);
      fragment.append(mark);
      marks.push(mark);
      firstMatch ||= mark;
      cursor = match + query.length;
      match = lower.indexOf(needle, cursor);
    }
    fragment.append(document.createTextNode(value.slice(cursor)));
    node.replaceWith(fragment);
  }
  firstMatch?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  return () => {
    for (const mark of marks) {
      if (mark.isConnected) {
        const parent = mark.parentNode;
        mark.replaceWith(document.createTextNode(mark.textContent));
        parent.normalize();
      }
    }
  };
}
