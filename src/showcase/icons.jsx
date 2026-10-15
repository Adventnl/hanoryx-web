/* A small set of line icons for specimens, drawn on a 24 grid and styled by
   the global .sc-ico rule (showcase.css): stroke only, current colour. */
const PATHS = {
  home: 'M4 11 12 4l8 7M6 10v9h12v-9',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM16.5 16.5 21 21',
  bell: 'M12 3a6 6 0 0 0-6 6c0 5-2 6-2 6h16s-2-1-2-6a6 6 0 0 0-6-6ZM10 19a2 2 0 0 0 4 0',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 20c0-4 4-6 8-6s8 2 8 6',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  camera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  play: 'M8 5v14l11-7z',
  pause: 'M8 5v14M16 5v14',
  next: 'M6 5v14l9-7zM18 5v14',
  prev: 'M18 5v14l-9-7zM6 5v14',
  star: 'M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 19.2 8 13.7 4 9.8 9.5 9z',
  trash: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13',
  folder: 'M3 7h7l2 2h9v10H3z',
  bold: 'M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z',
  italic: 'M10 5h8M6 19h8M14 5 10 19',
  underline: 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14',
  link: 'M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01',
  chat: 'M4 5h16v11H9l-5 4z',
  cart: 'M3 4h3l2 11h10l2-8H7M10 20h.01M17 20h.01',
  mic: 'M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3ZM6 11a6 6 0 0 0 12 0M12 17v3',
  bolt: 'M13 3 5 13h6l-1 8 8-10h-6z',
  down: 'M6 9l6 6 6-6',
  up: 'M6 15l6-6 6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12l5 5 9-10',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  pen: 'M4 20l1-5L16 4l4 4L9 19zM14 6l4 4',
  copy: 'M8 8h11v12H8zM5 16V4h11',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 10.6l6.8-4M8.6 13.4l6.8 4',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  upload: 'M12 16V5M7 9l5-5 5 5M5 20h14',
  flag: 'M6 21V4M6 5h11l-2 4 2 4H6',
  pin: 'M12 21v-6M8 4h8l-1 6 3 3H6l3-3z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8v4l3 2',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19',
  moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z',
};

export function Ico({ n, className = '' }) {
  return (
    <svg className={`sc-ico ${className}`.trim()} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[n] || PATHS.plus} />
    </svg>
  );
}

export default Ico;
