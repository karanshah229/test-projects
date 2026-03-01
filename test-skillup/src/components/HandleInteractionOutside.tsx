import { ReactNode, RefObject, useCallback, useEffect, useRef } from 'react';

type KeyUpProps =
  | {
      onKeyUpOutside: Function;
      onKeyUpKeys: KeyboardEvent['key'][];
    }
  | {
      onKeyUpOutside?: never;
      onKeyUpKeys?: never;
    };

type Props = KeyUpProps & {
  passedRef?: RefObject<HTMLDivElement>;
  onClickOutside?: Function;
  ignoreRefs?: RefObject<any>[]; // refs that you want to ignore the events on
  children: ReactNode;
};

export function HandleInteractionOutside({
  passedRef,
  onClickOutside = () => {},
  onKeyUpOutside = () => {},
  onKeyUpKeys = [],
  ignoreRefs = [],
  children,
}: Props) {
  const internalRef = useRef();
  const ref = passedRef ?? internalRef;

  const registerKeyUpHandler = onKeyUpKeys.length !== 0;

  const handleClickOutside = useCallback(
    (event: Event) => {
      if (
        !ref.current?.contains(event?.target as Node) &&
        !ignoreRefs.some((_ref) => _ref.current?.contains(event?.target as Node))
      ) {
        onClickOutside();
      }
    },
    [ignoreRefs, onClickOutside, ref],
  );

  const handleKeyUpOutside = useCallback(
    (event: KeyboardEvent) => {
      if (onKeyUpKeys.includes(event.key)) {
        onKeyUpOutside();
      }
    },
    [onKeyUpKeys, onKeyUpOutside],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    if (registerKeyUpHandler) document.addEventListener('keyup', handleKeyUpOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      if (registerKeyUpHandler) document.removeEventListener('keyup', handleKeyUpOutside, true);
    };
  }, [handleClickOutside, handleKeyUpOutside, registerKeyUpHandler]);

  return <div ref={passedRef ? null : internalRef}>{children}</div>;
}
