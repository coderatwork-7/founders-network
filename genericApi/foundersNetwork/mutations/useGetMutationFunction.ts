import {TMutation} from '@/utils/types/TMutation';
import {
  useCompanyLogoMutation,
  useCompanyMutation,
  useProfileImageMutation,
  useProfileMutation,
  usePitchdeckMutation,
  useGeneralMutation,
  useFileUploadMutation,
  useInvestorOverviewMutation
} from '.';

export const useGetMutationFunction = (mutation: TMutation) => {
  const company = useCompanyMutation();
  const profile = useProfileMutation();
  const general = useGeneralMutation();
  const profileImage = useProfileImageMutation();
  const companyLogo = useCompanyLogoMutation();
  const pitchDeck = usePitchdeckMutation();
  const fileUpload = useFileUploadMutation();
  const investorOverview = useInvestorOverviewMutation();

  const allMutations = {
    company,
    general,
    fileUpload,
    profile,
    profileImage,
    companyLogo,
    pitchDeck,
    investorOverview
  };

  return allMutations[mutation];
};
