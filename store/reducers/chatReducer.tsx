import {MessageType} from '@/components/Chat/chatModal';
import {createAction, createReducer} from '@reduxjs/toolkit';

export const addMsgToQueue = createAction<MessageType>('queue');
export const removeMsgFromQueue = createAction<{
  chatUserId: string;
  messageId: string;
}>('unqueue');
export const addChatUser = createAction<MessageType>('addChatUser');
export const setChatLoading = createAction<{userId: number; loading?: boolean}>(
  'setChatLoading'
);
export const setLastActiveChatUser = createAction<{userId: number}>(
  'setLastActiveUser'
);

export default createReducer({}, builder => {
  builder.addCase(addMsgToQueue.type, (state: any, action: any) => {
    if (state[action.payload.recipient]?.messages?.data) {
      state[action.payload.recipient].messages.data = [
        {...action.payload, sending: true},
        ...state[action.payload.recipient].messages.data
      ];
    } else {
      state[action.payload.recipient] = {
        ...state[action.payload.recipient],
        messages: {
          data: [{...action.payload, sending: true}]
        }
      };
    }
  });
  builder.addCase(removeMsgFromQueue.type, (state: any, action: any) => {
    state[action.payload.chatUserId].messages.data = state[
      action.payload.chatUserId
    ].messages.data.filter(
      (msg: any) => msg.messageId !== action.payload.messageId
    );
  });
  builder.addCase(addChatUser.type, (state: any, action: any) => {
    state[action.payload?.userId] = {
      ...state[action.payload?.userId],
      info: {
        ...action.payload
      }
    };
  });
  builder.addCase(setChatLoading.type, (state: any, action: any) => {
    if (action.payload?.userId in state)
      if (
        !state[action.payload?.userId]?.info?.userId &&
        action.payload?.loading === false
      )
        delete state[action.payload?.userId];
      else {
        state[action.payload?.userId].info.isLoading =
          action.payload?.loading ?? true;
      }
    else if (action.payload?.loading !== false) {
      state[action.payload?.userId] = {info: {isLoading: true}};
    }
  });
  builder.addCase(setLastActiveChatUser.type, (state: any, action: any) => {
    if (state.info?.data)
      state.info.data.lastActiveChatUser = action.payload?.userId;
  });
});
