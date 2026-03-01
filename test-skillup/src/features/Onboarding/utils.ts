import { OnboardingStatusType } from 'src/types/common';

export async function handleOnboardingStatusUpdate(
  setIsDisabled: (value: boolean) => void,
  updateOnboardingStatus: (status: OnboardingStatusType) => Promise<boolean>,
  toast: {
    notify: Function;
  },
  message: string,
  status: OnboardingStatusType,
) {
  setIsDisabled(true);
  const result = await updateOnboardingStatus(status);
  if (!result) {
    setIsDisabled(false);
    toast.notify({
      type: 'error_strong',
      message,
      closable: true,
      placement: 'topCenter',
    });
  }
}
