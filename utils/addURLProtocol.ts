export const addURLProtocol = (link: string) => {
  if (link?.includes('http')) {
    return link;
  } else return 'https://' + link;
};
