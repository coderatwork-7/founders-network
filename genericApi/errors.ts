export class GenericError extends Error {
  message = '';
  constructor(errorMessage: string) {
    super();
    this.message = errorMessage;
  }
}

export class NoDataFoundError extends GenericError {}

export class ConcurrentApiNotAllowed extends GenericError {}
