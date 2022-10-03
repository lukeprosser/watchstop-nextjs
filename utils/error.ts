import { AxiosError } from 'axios';

export const getErrorMsg = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response ? error.response.data.message : error.message;
  } else {
    return 'An unexpected error occurred, please try again.';
  }
};
