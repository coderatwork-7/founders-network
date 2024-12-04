import {STATE_UPDATE_FLAGS} from '@/utils/common/constants';
const isObject = (value: any) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const deleteFlagged = (obj: any) => {
  Object.keys(obj).forEach(
    key => obj[key] === STATE_UPDATE_FLAGS.DELETE && delete obj[key]
  );
  return obj;
};

const updateEntity = (state: any, delta: any) => {
  if (state == null || delta === null || delta.replaceReduxState) {
    return delta;
  }

  if (isObject(state) && isObject(delta)) {
    return deleteFlagged({
      ...state,
      ...delta
    });
  }
  return state;
};

const updateTable = (state: any, delta: any) => {
  if (state == null || delta.replaceReduxState) {
    return delta;
  }

  if (delta == null) {
    return state;
  }

  const update = (entityState: any, id: any) =>
    Object.assign(entityState, {
      [id]:
        delta[id] === STATE_UPDATE_FLAGS.DELETE
          ? STATE_UPDATE_FLAGS.DELETE
          : updateEntity(state[id], delta[id])
    });

  return deleteFlagged({
    ...state,
    ...Object.keys(delta).reduce(update, {})
  });
};

const updateState = function (state: any, delta: any) {
  if (delta.replaceReduxState) {
    return delta;
  }
  if (delta == null) {
    return state;
  }

  const update = (entityState: any, id: any) =>
    Object.assign(entityState, {
      [id]:
        delta[id] === STATE_UPDATE_FLAGS.DELETE
          ? STATE_UPDATE_FLAGS.DELETE
          : updateTable(state[id], delta[id])
    });

  return deleteFlagged({
    ...state,
    ...Object.keys(delta).reduce(update, {})
  });
};
export default updateState;
