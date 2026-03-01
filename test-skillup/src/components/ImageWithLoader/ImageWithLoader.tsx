import { HRSpinner } from '@hackerrank/hrds-components';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

import styles from './ImageWithLoader.module.scss';

type ImageWithLoaderProps = ImageProps & {
  isDisabled?: boolean;
  className?: string;
  fallbackImageRetryCount?: number;
  fallbackImagePath?: string;
  loadingSpinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

/**
 *
 * A loader will draw attention and hence must be used on direct images only.
 *
 *  - Don't use for icons used as images unless it takes up
 * considerable screen real estate and/or load time
 * - Don't use for preloaded images
 * - Don't use for background images - they are not the main focus
 * since they are in "background"
 */
export function ImageWithLoader(props: ImageWithLoaderProps) {
  const {
    src = '',
    alt = 'Image',
    width = 0,
    height = 0,
    isDisabled = false,
    className = '',
    fallbackImageRetryCount = 1,
    fallbackImagePath = '',
    loadingSpinnerSize = 'xs',
    ...restNextImageProps
  } = props;

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [fallbackImgRetryCount, setFallbackImgRetryCount] = useState(fallbackImageRetryCount);
  const [imageFilePath, setImageFilePath] = useState(src);

  return (
    <>
      {isImageLoading && (
        <div
          className="hr-flex hr-justify-center hr-align-center"
          style={{ height: `${height}px`, width: `${width}px` }}
        >
          <HRSpinner size={loadingSpinnerSize} />
        </div>
      )}
      <Image
        src={imageFilePath}
        alt={alt}
        width={width}
        height={height}
        className={`hr-select-none hr-pointer-none ${
          isDisabled ? styles.disabled : ''
        } ${className}`}
        onLoadingComplete={() => setIsImageLoading(false)}
        onError={() => {
          setIsImageLoading(false);
          if (fallbackImagePath && fallbackImgRetryCount > 0) {
            setFallbackImgRetryCount((count) => count - 1);
            setImageFilePath(fallbackImagePath);
            setIsImageLoading(true);
          }
        }}
        {...restNextImageProps}
      />
    </>
  );
}
