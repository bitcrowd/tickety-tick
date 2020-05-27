import octicons from '@primer/octicons';
import { css, customElement, html, LitElement, property } from 'lit-element';

@customElement('gh-octicon')
class Octicon extends LitElement {
  @property({ type: String, reflect: true })
  icon;

  @property({ type: Number, reflect: true })
  width = 16;

  @property({ type: Number, reflect: true })
  height = 16;

  static get styles() {
    return css`
      svg {
        display: inline-block;
        fill: currentcolor;
        user-select: none;
        vertical-align: text-bottom;
      }
    `;
  }

  render() {
    const octicon = octicons[this.icon];

    const options = {
      width: this.width,
      height: this.height,
    };

    return html([octicon.toSVG(options)]);
  }
}

export default Octicon;
