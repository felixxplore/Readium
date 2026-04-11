import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  authModalOpen: boolean
  authModalView: 'login' | 'signup'
  mobileMenuOpen: boolean
}

const initialState: UIState = {
  authModalOpen: false,
  authModalView: 'login',
  mobileMenuOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.authModalOpen = true
      state.authModalView = action.payload
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
  },
})

export const { openAuthModal, closeAuthModal, toggleMobileMenu, closeMobileMenu } = uiSlice.actions
export default uiSlice.reducer
