import { Component, useEffect, useRef, useState } from 'react';
import { SpecContext, observeVisible, pad2 } from './hooks';
import { fx } from '../utils/fx';

/* One broken specimen must not take its page with it: it says so, quietly, and
   the console error is what the tests listen for. */
class Guard extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(`Specimen "${this.props.name}" failed to draw:`, error);
  }

  render() {
    return this.state.failed ? <p className="sc-fail">This specimen could not be drawn.</p> : this.props.children;
  }
}

/**
 * A specimen: one component on show. The frame (its look is the page's `frame`,
 * set on the stage as data-frame) carries a code, the name and how to use it
 * (click, drag, hover, type, auto…). It tells its contents whether it is on
 * screen, so loops can stop while it is not, and it is `inert` while a stage has
 * it out of reach (offscreen on a belt, behind the camera) so keyboard focus
 * never disappears into a clipped region.
 */
export function Specimen({ no, i, name, mode, slug, inert = false, children }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => observeVisible(ref.current, setOn), []);

  return (
    <figure
      ref={ref}
      id={`${slug}-${i + 1}`}
      className="sc-spec"
      data-spec
      data-i={i}
      data-on={on ? '1' : '0'}
      inert={inert || undefined}
      {...fx(`showcase.${slug}.${pad2(i + 1)}`)}
    >
      <figcaption className="sc-cap">
        <span className="sc-no">{pad2(no)}.{pad2(i + 1)}</span>
        <span className="sc-name">{name}</span>
        <span className="sc-mode">{mode}</span>
      </figcaption>
      <div className="sc-bed">
        <SpecContext.Provider value={on}>
          <Guard name={name}>{children}</Guard>
        </SpecContext.Provider>
      </div>
    </figure>
  );
}

export default Specimen;
