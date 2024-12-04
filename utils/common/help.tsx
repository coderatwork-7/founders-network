import {
  DOMNode,
  Element,
  attributesToProps,
  domToReact
} from 'html-react-parser';
import {linkConverter} from './helper';
import Link from 'next/link';
import {ProfileTooltip} from '@/components/ProfileTooltip';

//Hierarchy starts here: don't change the order of the code and don't add code in between the hierarchy
export const replaceAnchorTag = (node: DOMNode) => {
  if (
    node instanceof Element &&
    node?.tagName === 'a' &&
    node?.attribs &&
    node?.attribs?.target !== '_blank'
  ) {
    const {matched, url} = linkConverter(node.attribs?.href);
    if (matched) {
      const profileMatch =
        /members\.foundersnetwork\.com\/profile\/(\d+)\/?\s*$/.exec(
          node?.attribs?.href
        );
      if (profileMatch) {
        const id = profileMatch?.[1];
        return (
          <ProfileTooltip profile={{id}}>
            <Link href={url ?? ''}>
              {domToReact(node?.children, replaceAnchorTag as any)}
            </Link>
          </ProfileTooltip>
        );
      }
      return (
        <Link href={url ?? ''}>
          {domToReact(node?.children, replaceAnchorTag as any)}
        </Link>
      );
    }
  }
};

export const processAnchorTagAndEmoji = (node: DOMNode) => {
  const replaceAnchor = replaceAnchorTag(node);
  if (replaceAnchor) return replaceAnchor;
  if (node instanceof Element && node?.tagName === 'a') {
    const props = {...attributesToProps(node?.attribs), target: '_blank'};
    return (
      <a {...props}>
        {domToReact(node?.children, processAnchorTagAndEmoji as any)}
      </a>
    );
  }
  if (node instanceof Element && node?.tagName === 'img') {
    if (
      node?.attribs?.['data-stringify-type'] === 'emoji' ||
      node?.attribs?.src?.includes('fnsite/js/tinymce/plugins/emoticons/img/')
    ) {
      const {style, height, width, ...rest} = attributesToProps(node?.attribs);
      return <img {...rest}></img>;
    }
  }
};
//Hierarchy ends, you can add code below or above the hierarchy
