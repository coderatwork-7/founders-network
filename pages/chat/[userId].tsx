import React, {useCallback, useState, useEffect} from 'react';
import {ChatModal} from '@/components/Chat';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

const ChatPage: React.FC = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const userInfo = useSelector(selectUserInfo());
  const userId = userInfo?.id;
  const router = useRouter();
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  const handleCloseModal = useCallback(() => {
    setIsChatModalOpen(false);
    window.location.href = '/';
  }, []);

  useEffect(() => {
    setIsChatModalOpen(true);
  }, []);

  return (
    <>
      <Head>
        <title>chat| Founders Network</title>
      </Head>
      {isChatModalOpen ? (
        <ChatModal handleCloseModal={handleCloseModal} />
      ) : null}
      ;
    </>
  );
};

export default ChatPage;
