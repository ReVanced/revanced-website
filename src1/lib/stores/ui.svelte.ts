import { modalStack } from './modalStack';

// Central UI actions for opening common modals (settings, login, etc.)
class UIState {
  openSettings() { modalStack.open('settings'); }
  openLogin() { modalStack.open('login'); }
  closeSettings() { modalStack.close('settings'); }
  closeLogin() { modalStack.close('login'); }
  isSettingsOpen(): boolean { return modalStack.isOpen('settings'); }
  isLoginOpen(): boolean { return modalStack.isOpen('login'); }
}

export const ui = new UIState();