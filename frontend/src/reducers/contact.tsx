import { IContact } from '../types'

export type ContactAction =
  | { type: 'FETCH_CONTACT_BEGIN' }
  | {
      type: 'FETCH_CONTACT_SUCCESS'
      payload: IContact
    }
  | { type: 'FETCH_CONTACT_ERROR'; error: string }

export interface ContactState {
  contact: IContact | null
  loading: boolean
  error: string | null
}

export const initialState: ContactState = {
  contact: null,
  loading: false,
  error: null,
}

export function contactReducer(
  state: ContactState,
  action: ContactAction,
): ContactState {
  switch (action.type) {
    case 'FETCH_CONTACT_BEGIN':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_CONTACT_SUCCESS':
      return {
        ...state,
        loading: false,
        contact: action.payload,
      }
    case 'FETCH_CONTACT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
        contact: null,
      }
    default:
      return state
  }
}
