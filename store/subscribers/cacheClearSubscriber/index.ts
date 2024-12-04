import {queryClient} from '@/pages/_app';
import {DefaultSubscriber} from '@/store/middleware';
import {toast} from 'react-toastify';

const LIBRARY_BASE_PATH = 'library';

function removeForumsCache() {
  queryClient.invalidateQueries({queryKey: ['feeds', 'all']});
  queryClient.invalidateQueries({queryKey: ['feeds', 'ForumThread']});
  queryClient.invalidateQueries({queryKey: ['forums']});
  queryClient.invalidateQueries({queryKey: ['groups_forum']});
}

const apiUpdateCacheServer = async (revalidatePath: any) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_CACHE_SERVER}/revalidate?pathToRevalidate=/${revalidatePath}`
  )
    .then(() => console.log('successful api sended'))
    .catch(e => console.log(e));
  console.log('Api Request Sended to UpdateCacheServer');
};
export const cacheClearSubscriber = ({subscribe}: DefaultSubscriber) => {
  const listener = (action: any) => {
    const {type, response, payload} = action;

    if (type === 'deleteForumPost.Completed' && !response?.errorCode) {
      setTimeout(() => {
        removeForumsCache();
        toast.success('Removing from UI...', {theme: 'dark'});
        console.log('[CACHE CLEAR SUBSCRIBER]', type);
      }, 0);
    }
    if (
      type === 'postCreateForumPost.Completed' &&
      !response?.errorCode &&
      !response?.data?.post?.inModeration
    ) {
      removeForumsCache();
    }
    if (
      type === 'putSettingsGeneralData.Resolved' ||
      type === 'putSettingsProfileData.Resolved' ||
      type === 'putSettingsCompanyData.Resolved'
    ) {
      const revalidatePath = `profile/${payload.profileId}`;
      apiUpdateCacheServer(revalidatePath);
    }
    if (type === 'postEditForumPost.Resolved') {
      const threadId = payload.threadId;
      const revalidatePath = `forum/${threadId}`;

      apiUpdateCacheServer(revalidatePath);
    }
    if (
      type === 'updateLibraryItem.Resolved' ||
      type === 'deleteLibraryItem.Resolved'
    ) {
      apiUpdateCacheServer(LIBRARY_BASE_PATH);
      if (payload.id) {
        apiUpdateCacheServer(`${payload.type}/${payload.id}`);
      }
    }
  };

  return subscribe(listener);
};
