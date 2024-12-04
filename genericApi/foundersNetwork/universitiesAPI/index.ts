import {createAPI} from '../apiEndpoints';

export const createGetUniversities = ({queryTerm}: {queryTerm: string}) => {
  return createAPI(false)(
    `https://staging.foundersnetwork.com/v1/api/universities?search=${queryTerm}`
  );
};
