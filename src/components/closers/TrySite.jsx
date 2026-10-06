import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass, Eye, Keyboard, PauseCircle, Search } from 'lucide-react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { KeyCap } from '../fx/KeyCap';
import { pageRouteKeys, routePath } from '../../app/routeConfig';
import { fx } from '../../utils/fx';
import styles from './TrySite.module.css';

const press = (key) => window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
const setCalmAttribute = (on) => { document.documentElement.dataset.calm = on ? 'on' : 'off'; };
const pickOne = (list) => list[Math.floor(Math.random() * list.length)];

/** Five things worth trying on this site, each a real control: they open the
 *  actual search, the actual shortcuts panel, the actual blueprint mode, the
 *  actual calm setting, and a page chosen at random. A way to end by using it. */
export default function TrySite({ tag, title, lede, onward }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [calm, setCalm] = useState(() => document.documentElement.dataset.calm === 'on');
  const [last, setLast] = useState(null);

  const act = (id) => {
    if (id === 'search') window.dispatchEvent(new Event('hanoryx:search'));
    else if (id === 'keys') press('?');
    else if (id === 'blueprint') press('b');
    else if (id === 'calm') {
      const next = !calm;
      setCalmAttribute(next);
      setCalm(next);
    } else {
      const pool = pageRouteKeys.filter((k) => routePath(k) !== pathname && k !== 'home');
      const key = pickOne(pool);
      setLast(key);
      navigate(routePath(key));
    }
  };

  const items = [
    { id: 'search', icon: Search, name: 'Search everything', keys: ['⌘', 'K'], does: 'Opens the search. It reads the text of every page, not only the titles.' },
    { id: 'keys', icon: Keyboard, name: 'See the shortcuts', keys: ['?'], does: 'A short list of the keys that do something here.' },
    { id: 'blueprint', icon: Eye, name: 'Switch on blueprint mode', keys: ['B'], does: 'Outlines and names the marked parts of the page. Press B again to put it away.' },
    { id: 'calm', icon: PauseCircle, name: calm ? 'Let the page move again' : 'Calm the page', keys: [], does: 'Stops animation and freezes the drawn backgrounds, for as long as this tab stays open.', on: calm },
    { id: 'random', icon: Compass, name: 'Take me somewhere', keys: [], does: 'Opens a page chosen at random from the whole site.' },
  ];

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ul className={styles.grid} {...fx('trysite.grid')}>
        {items.map((it) => (
          <li key={it.id}>
            <button type="button" className={clsx(styles.card, it.on && styles.on)} onClick={() => act(it.id)} aria-pressed={it.id === 'calm' ? it.on : undefined}>
              <it.icon className={styles.icon} size={22} strokeWidth={1.3} aria-hidden="true" />
              <b>{it.name}</b>
              <span>{it.does}</span>
              <span className={styles.keys} aria-hidden="true">{it.keys.map((k) => <KeyCap key={k}>{k}</KeyCap>)}</span>
              <ArrowUpRight className={styles.arrow} size={16} strokeWidth={1.4} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      {last && <p className={styles.note} role="status">Last stop: /{last}</p>}
    </CloserFrame>
  );
}
