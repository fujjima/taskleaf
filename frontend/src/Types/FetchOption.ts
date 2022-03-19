const HTTP_REQUEST_HEADER = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const FETCH_OPTIONS: RequestInit = {
  mode: 'cors',
  credentials: 'include',
  headers: HTTP_REQUEST_HEADER
}

export const FETCH_GET_OPTIONS = {
  ...FETCH_OPTIONS,
  method: 'GET',
}

export const FETCH_POST_OPTIONS = {
  ...FETCH_OPTIONS,
  method: 'POST',
}

export const FETCH_PATCH_OPTIONS = {
  ...FETCH_OPTIONS,
  method: 'PATCH',
}

export const FETCH_DELETE_OPTIONS = {
  ...FETCH_OPTIONS,
  method: 'DELETE',
}
