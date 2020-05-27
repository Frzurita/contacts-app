import { IContact } from '../types'

export type ContactListAction =
  | { type: 'FETCH_CONTACTS_BEGIN' }
  | {
      type: 'FETCH_CONTACTS_SUCCESS'
      payload: Array<IContact>
    }
  | { type: 'FETCH_CONTACTS_ERROR'; error: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_CONTACT_SEARCH'; contactSearch: string }
  | { type: 'SET_IS_PAGINATION_FINISHED'; isPaginationFinished: Boolean }

export interface ContactListState {
  contacts: Array<IContact>
  loading: boolean
  error: string | null
  page: number
  contactSearch: string
  isPaginationFinished: Boolean
}

export const initialState: ContactListState = {
  contacts: [],
  loading: false,
  error: null,
  page: 0,
  contactSearch: '',
  isPaginationFinished: false,
}

export function contactsReducer(
  state: ContactListState,
  action: ContactListAction,
): ContactListState {
  switch (action.type) {
    case 'FETCH_CONTACTS_BEGIN':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_CONTACTS_SUCCESS':
      return {
        ...state,
        loading: false,
        contacts: action.payload,
      }
    case 'FETCH_CONTACTS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
        contacts: [],
      }
    case 'SET_PAGE':
      return {
        ...state,
        page: action.page,
      }
    case 'SET_CONTACT_SEARCH':
      return {
        ...state,
        contactSearch: action.contactSearch,
      }
    case 'SET_IS_PAGINATION_FINISHED':
      return {
        ...state,
        isPaginationFinished: action.isPaginationFinished,
      }
    default:
      return state
  }
}
