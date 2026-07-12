export type IconName =
  | 'flame'
  | 'globe'
  | 'tag'
  | 'chart'
  | 'search'
  | 'hash'
  | 'play'
  | 'users'
  | 'heart'
  | 'calendar';

const paths: Record<IconName, { fill: string; stroke: string }> = {
  flame: {
    fill: 'M12 3c1 3-3 4-3 7a3 3 0 0 0 6 0c0-1-.5-2-.5-2 1.5 1 2.5 3 2.5 5a5 5 0 0 1-10 0c0-4 3-5 5-10Z',
    stroke:
      'M12 3c1 3-3 4-3 7a3 3 0 0 0 6 0c0-1-.5-2-.5-2 1.5 1 2.5 3 2.5 5a5 5 0 0 1-10 0c0-4 3-5 5-10Z',
  },
  globe: {
    fill: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
    stroke:
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M2 12h20 M12 2c2.5 2.7 4 6.2 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.2-4-10s1.5-7.3 4-10Z',
  },
  tag: {
    fill: 'M3 12 12 3h6a3 3 0 0 1 3 3v6l-9 9a2 2 0 0 1-3 0l-6-6a2 2 0 0 1 0-3Z',
    stroke:
      'M3 12 12 3h6a3 3 0 0 1 3 3v6l-9 9a2 2 0 0 1-3 0l-6-6a2 2 0 0 1 0-3Z M16.5 7.5h.01',
  },
  chart: {
    fill: 'M4 20V10h3v10H4Zm6.5 0V4h3v16h-3ZM17 20v-7h3v7h-3Z',
    stroke: 'M4 20V10h3v10H4Zm6.5 0V4h3v16h-3ZM17 20v-7h3v7h-3Z M3 20h18',
  },
  search: {
    fill: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z',
    stroke: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z M16.2 16.2 21 21',
  },
  hash: {
    fill: '',
    stroke: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  },
  play: {
    fill: 'M8 5.5v13l11-6.5Z',
    stroke: 'M8 5.5v13l11-6.5Z',
  },
  users: {
    fill: 'M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M13 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z',
    stroke:
      'M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M9 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z M16 6c1.7.3 3 1.8 3 3.5S17.7 12.7 16 13M22 20c0-2.8-2-5-5-5.8',
  },
  heart: {
    fill: 'M12 20.5s-7.5-4.6-9.7-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.7 5.5c-2.2 4.4-9.7 9-9.7 9Z',
    stroke:
      'M12 20.5s-7.5-4.6-9.7-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.7 5.5c-2.2 4.4-9.7 9-9.7 9Z',
  },
  calendar: {
    fill: 'M4 8h16v12H4Z',
    stroke: 'M4 8h16v12H4Z M4 8V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M8 3v4M16 3v4M4 12h16',
  },
};

export default function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const p = paths[name];
  return (
    <svg
      className={`icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
    >
      {p.fill && <path className="icon-fill" d={p.fill} />}
      <path d={p.stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
