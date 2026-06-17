import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * App-level error boundary. A thrown render error in a page or scene drops to a
 * controlled "signal fault" panel with a recovery path instead of a white
 * screen. Resets its error state on navigation via the `resetKey` prop.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main className={styles.fault} role="alert">
          <span className={styles.code}>ERR // RENDER FAULT</span>
          <h1 className={styles.title}>Signal Fault</h1>
          <p className={styles.body}>A module failed to render. The system contained the fault.</p>
          <button type="button" className={styles.btn} onClick={() => this.setState({ error: null })}>
            Re-establish signal
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
