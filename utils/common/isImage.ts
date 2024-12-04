export const isImage = (url: string) => {
  const extension = url.split('.').pop()?.toLowerCase();
  return (
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'gif'
  );
};
