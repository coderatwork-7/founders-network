import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useFileUploadMutation = () => {
  const {data: session} = useSession();

  const putFileUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('s3file', file);

    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/fileupload`,
      formData,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );
  };

  return useMutation({
    mutationFn: putFileUpload
  });
};
