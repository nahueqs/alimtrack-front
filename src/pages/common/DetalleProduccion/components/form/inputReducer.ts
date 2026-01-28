export interface InputState {
  localValue: string;
  isFocused: boolean;
  hasChanged: boolean;
  error: string | null;
  isSaving: boolean;
}

export type InputAction =
  | { type: 'VALUE_CHANGED'; payload: string }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR'; payload: string }
  | { type: 'SYNC_EXTERNAL'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

export const initialState = (initialValue: string): InputState => ({
  localValue: initialValue,
  isFocused: false,
  hasChanged: false,
  error: null,
  isSaving: false,
});

export const inputReducer = (state: InputState, action: InputAction): InputState => {
  switch (action.type) {
    case 'VALUE_CHANGED':
      return {
        ...state,
        localValue: action.payload,
        hasChanged: true,
        error: null, // Limpiar error al escribir
      };
    case 'FOCUS':
      return {
        ...state,
        isFocused: true,
        error: null,
      };
    case 'BLUR':
      return {
        ...state,
        isFocused: false,
      };
    case 'SAVE_START':
      return {
        ...state,
        isSaving: true,
        error: null,
      };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        isSaving: false,
        hasChanged: false,
      };
    case 'SAVE_ERROR':
      return {
        ...state,
        isSaving: false,
        error: action.payload,
      };
    case 'SYNC_EXTERNAL':
      return {
        ...state,
        localValue: action.payload,
        hasChanged: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
