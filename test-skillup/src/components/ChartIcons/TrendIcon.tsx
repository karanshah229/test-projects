import styles from './TrendIcon.module.scss';

type TrendIconProps = {
  percentChange?: number;
  width?: number;
  height?: number;
};

export function TrendIcon({ percentChange = 0, width = 17, height = 12 }: TrendIconProps) {
  return (
    <div className={styles.trendIcon} style={{ minWidth: width }}>
      {percentChange === 0 ? null : (
        <svg
          className={percentChange > 0 ? styles.incline : styles.decline}
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          fill="currentColor"
          viewBox="0 0 17 12"
        >
          <path d="M.744 10.751a.357.357 0 0 0 .512.498l-.512-.498Zm5.742-5.398.202-.295-.249-.17-.21.216.257.249ZM10.6 8.176l-.202.295.282.193.205-.273-.285-.215ZM16.354.95a.357.357 0 0 0-.404-.304l-3.183.45a.357.357 0 1 0 .1.707l2.83-.4.399 2.83a.357.357 0 0 0 .707-.1L16.353.95ZM1.256 11.249l5.486-5.647-.512-.498-5.486 5.647.512.498Zm5.028-5.602 4.114 2.824.404-.589-4.114-2.824-.404.59Zm4.601 2.744 5.4-7.176-.57-.43-5.4 7.177.57.43Z" />
        </svg>
      )}
    </div>
  );
}
