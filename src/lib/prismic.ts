import Prismic from 'prismic-javascript';

export const apiEndpoint = 'https://devcommerce2022.prismic.io/api/v2';

export const client = (req = undefined) => {
  const options = req ? { req } : undefined;

  return Prismic.client(apiEndpoint, options);
};
