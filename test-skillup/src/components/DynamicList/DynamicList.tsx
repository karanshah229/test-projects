import { useEffect, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from 'src/hooks/useIsomorphicLayoutEffect';
import { useResize } from 'src/hooks/useResize';

import styles from './DynamicList.module.scss';
import { RemainingSkillsTrigger } from './RemainingSkillsTrigger';

type Props = {
  items: string[];
  seperator?: string;
  lines?: number;
  lineHeight?: number;
  as?: keyof HTMLElementTagNameMap;
  contentClassName?: string;
};

type Props2 =
  | {
      showTrigger: true;
      isTriggerInline?: boolean;
      showEllipsis?: false;
      showEllipsisTooltip?: never;
    }
  | {
      showTrigger?: false;
      isTriggerInline?: never;
      showEllipsis: true;
      showEllipsisTooltip?: boolean;
    };

type DynamicListProps = Props & Props2;

const ELLIPSIS = '...';

export function DynamicList({
  items = [],
  seperator = ' , ',
  lines = 1,
  lineHeight = 20,
  as = 'div',
  contentClassName = '',
  showTrigger = false,
  isTriggerInline = true,
  showEllipsis = false,
  showEllipsisTooltip = true,
}: DynamicListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const [overflowedSkills, setOverflowedSkills] = useState([]);

  const { width } = useResize(parentRef);

  const maxContentHeight =
    showTrigger && !isTriggerInline ? (lines + 1) * lineHeight : lines * lineHeight;
  const ContainerTag = as;

  // Just used to rerender the component, not used for UI
  const [fontProperties, setFontProperties] = useState({});

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      let index = 0;
      for (
        ;
        index < items.length && (containerRef.current.scrollHeight || 0) <= maxContentHeight;
        index += 1
      ) {
        containerRef.current.append(items[index]);
        if (index !== items.length - 1) containerRef.current.append(seperator);
      }

      if (containerRef.current.scrollHeight > maxContentHeight) {
        // Not all items could fit, content overflowed {x} lines

        // Make space for `not inline` trigger on next line
        const newMaxHeight = lines * lineHeight;

        // Remove items & seperator till content does not overflow
        // and to show trigger (if not inline)
        while (containerRef.current.scrollHeight > newMaxHeight) {
          if (containerRef.current.lastChild) {
            if (seperator && containerRef.current.lastChild.textContent !== seperator) {
              // To compute the correct index only of items that have not overflown and not seperator
              index -= 1;
            }
            containerRef.current.removeChild(containerRef.current.lastChild);
          }
        }

        // If seperator is last 'thing' after removing items, then remove the seperator
        if (
          seperator &&
          containerRef.current.lastChild &&
          containerRef.current.lastChild.textContent === seperator
        ) {
          containerRef.current.removeChild(containerRef.current.lastChild);
        }

        if (showEllipsis) {
          containerRef.current.append(ELLIPSIS);
          // Check if content overflows after adding ellipsis
          if (containerRef.current.scrollHeight > newMaxHeight) {
            // Remove ellipsis
            containerRef.current.removeChild(containerRef.current.lastChild);

            // Replace last 3 characters of last item with ellipsis
            if (containerRef.current.lastChild) {
              containerRef.current.lastChild.textContent =
                containerRef.current.lastChild.textContent.slice(0, -3) + ELLIPSIS;
            }
          }
        }

        if (showTrigger) setOverflowedSkills(items.slice(index, items.length));
      }
    }
  }, [items, maxContentHeight, seperator, width, fontProperties]);

  useEffect(() => {
    // Re-render card to account for font properties which may cause content
    // to overflow since uselayoutEffect runs before browser paints DOM.
    if (containerRef.current) {
      setFontProperties({
        fontSize: window.getComputedStyle(containerRef.current).fontSize,
        fontWeight: window.getComputedStyle(containerRef.current).fontWeight,
      });
    }
  }, []);

  if (items?.length === 0) return null;

  return (
    <div
      ref={parentRef}
      className={isTriggerInline ? 'hr-flex hr-align-center hr-justify-between' : ''}
    >
      {/* @ts-ignore */}
      <ContainerTag
        ref={containerRef}
        className={`${styles.container} ${contentClassName}`}
        title={showEllipsisTooltip ? items.join(seperator) : ''}
        style={{
          maxHeight: maxContentHeight,
        }}
      >
        {items.map((item, idx) =>
          idx !== items.length - 1 && seperator ? item + seperator : item,
        )}
      </ContainerTag>
      {showTrigger ? (
        <RemainingSkillsTrigger
          overflowedSkills={overflowedSkills}
          isTriggerInline={isTriggerInline}
        />
      ) : null}
    </div>
  );
}
