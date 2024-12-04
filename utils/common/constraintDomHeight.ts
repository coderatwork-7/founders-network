export function constraintDomHeightInComment(
  maxTextLength: number,
  staticHtmlString: string
) {
  const DomBody = new DOMParser().parseFromString(
    staticHtmlString,
    'text/html'
  ).body;
  const output = document.createElement('div');
  let outputLength = 0,
    i = 0;
  const length = DomBody.childNodes.length;
  for (i = 0; i < length; i++) {
    const childLength = DomBody.childNodes[i].textContent?.length ?? 0;
    if (childLength + outputLength <= maxTextLength) {
      output.appendChild(DomBody.childNodes[i]), (outputLength += childLength);
    } else {
      const content = DomBody.childNodes[i].textContent?.slice(
        0,
        maxTextLength - outputLength
      );
      const span = document.createElement('span');
      span.innerHTML = (content ?? '') + '...';
      output.appendChild(span);
      break;
    }
  }
  return {cutHTML: output.innerHTML, noOverflow: i === length};
}
