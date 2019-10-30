const cssClasses = new Set(
  [
    ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')),
    ...Array.from(document.querySelectorAll('style'))
  ]
    .map(element => element.sheet)
    .reduce((arr, sheet) => {
      try {
        // Catch security errors. Firefox will throw if you try to access
        // the rules from from a stylesheet from a different host.
        return [...arr, ...Array.from(sheet.cssRules)];
      } catch (e) {
        return arr;
      }
    }, [])
    .map(rule => rule.selectorText)
    .reduce(
      (arr, fullSelector) =>
        fullSelector
          ? [
              ...arr,
              ...fullSelector
                // Replace CSS selector delimiters (whitespace, plus, angle
                // bracket, tilde, comma) with a semicolon. We'll use that
                // to split the selectors into individual ones in a minute.
                // Also replace pseudoselectors and attribute selectors.
                .replace(/([\s+>~,]|(:|\[)[^\s.+>~,]+)/g, ';')
                .split(';')
                .map(v => v.trim())
                // Filter to get rid of any empties. Empties can happen when
                // multiple delimiters happen togeter (e.g. ".1 + .2" would
                // become ".1;;;.2"), but we don't want them.
                .filter(v => !!v)
            ]
          : arr,
      []
    )
    .filter(clss => clss.startsWith('.'))
    .map(clss => clss.substr(1))
);

const elementClasses = new Set(
  Array.from(document.querySelectorAll('[class]'))
    .map(element => element.getAttribute('class'))
    .reduce(
      (arr, c) => [
        ...arr,
        ...c
          .split(' ')
          .map(v => v.trim())
          .filter(v => !!v)
      ],
      []
    )
);

let noMatchCount = 0;
cssClasses.forEach(c => {
  if (!elementClasses.has(c)) {
    console.log(
      `[${++noMatchCount}] CSS defines class ${c}, but it isn't used in the document`
    );
  }
});
