import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {createAPI} from '../apiEndpoints';
import {AxiosResponse} from 'axios';
import {processOutput} from '@/genericApi/helper';
import {PARTNER_ROLES, REPOSITORIES} from '@/utils/common/constants';
import {FILE_UPLOAD_URL} from '../fileUploadAPI';

export const typeMapping = {
  pitchDeck: 'pitch-deck',
  profileImageUrl: 'profile-image',
  companyImageUrl: 'company-logo'
};
function denormalizePostUploadImage(
  this: RequestObject,
  response: AxiosResponse,
  state: any
) {
  const res = processOutput(response);
  if (res.data?.locationUrl && this.payload?.type === 'profileImageUrl') {
    const profileId = this?.payload?.profileId;
    const isProfilePresent =
      profileId in (state[REPOSITORIES.PROFILE_REPOSITORY]?.profileData ?? {});
    const isPartner =
      isProfilePresent &&
      PARTNER_ROLES.includes(
        state[REPOSITORIES.PROFILE_REPOSITORY]?.profileData?.[profileId]?.role
      );

    const profileData =
      state.userRepository.details.profileSettings.profileData;
    return {
      [REPOSITORIES.USER_REPOSITORY]: {
        details: {
          profileSettings: {
            profileData: {
              ...profileData,
              profileImageUrl: res.data.locationUrl
            }
          }
        }
      },
      ...(isProfilePresent && {
        [isPartner
          ? REPOSITORIES.PARTNERS_REPOSITORY
          : REPOSITORIES.MEMBERS_REPOSITORY]: {
          [isPartner ? 'partners' : 'posts']: {
            [profileId]: {
              profileAvatarUrl: res.data.locationUrl
            }
          }
        }
      }),
      data: res?.data
    };
  }

  if (!res?.errorCode) {
    return {
      data: res?.data
    };
  }
  return res;
}
export function createPostUploadImage() {
  return function postUploadImage({
    profileId,
    type
  }: {
    type: 'pitchDeck' | 'profileImageUrl' | 'companyImageUrl' | 's3file';
    profileId: number;
  }) {
    if (type === 's3file') return createAPI(false)(FILE_UPLOAD_URL);
    const requestObj = createAPI(false)(
      `/v1/api/users/${profileId}/${typeMapping[type]}`
    );
    requestObj.processOutput = denormalizePostUploadImage;
    return requestObj;
  };
}
