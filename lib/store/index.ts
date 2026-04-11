import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/lib/features/auth/auth-slice'
import uiReducer from '@/lib/features/ui/ui-slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
