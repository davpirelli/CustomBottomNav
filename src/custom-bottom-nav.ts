import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig, LovelaceCard } from 'custom-card-helpers';

interface RouteConfig {
  path: string;
  icon: string;
  label?: string;
  active_icon?: string;
}

interface CustomBottomNavConfig extends LovelaceCardConfig {
  type: string;
  routes: RouteConfig[];
  show_labels?: boolean;
  hide_when_scrolling?: boolean;
  position?: 'bottom' | 'top';
}

@customElement('custom-bottom-nav')
export class CustomBottomNav extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CustomBottomNavConfig;
  
  private _currentPath: string = '';

  public setConfig(config: CustomBottomNavConfig): void {
    if (!config.routes || !Array.isArray(config.routes)) {
      throw new Error('You need to define routes');
    }
    this._config = {
      show_labels: true,
      position: 'bottom',
      ...config
    };
  }

  public getCardSize(): number {
    return 3;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._currentPath = window.location.pathname;
    window.addEventListener('location-changed', this._handleLocationChanged);
  }

  disconnectedCallback(): void {
    window.removeEventListener('location-changed', this._handleLocationChanged);
    super.disconnectedCallback();
  }

  private _handleLocationChanged = (): void => {
    this._currentPath = window.location.pathname;
    this.requestUpdate();
  };

  private _navigate(path: string): void {
    history.pushState(null, '', path);
    window.dispatchEvent(new Event('location-changed'));
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const position = this._config.position || 'bottom';

    return html`
      <nav class="bottom-nav ${position}">
        ${this._config.routes.map(route => {
          const isActive = this._currentPath === route.path;
          const icon = isActive && route.active_icon ? route.active_icon : route.icon;
          
          return html`
            <button
              class="nav-item ${isActive ? 'active' : ''}"
              @click=${() => this._navigate(route.path)}
            >
              <ha-icon icon="${icon}"></ha-icon>
              ${this._config.show_labels && route.label
                ? html`<span class="label">${route.label}</span>`
                : ''
              }
            </button>
          `;
        })}
      </nav>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .bottom-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: var(--card-background-color, #fff);
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
        padding: 8px 0;
        position: fixed;
        left: 0;
        right: 0;
        z-index: 100;
      }

      .bottom-nav.bottom {
        bottom: 0;
        border-top: 1px solid var(--divider-color, #e0e0e0);
      }

      .bottom-nav.top {
        top: 0;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px 12px;
        color: var(--secondary-text-color, #727272);
        transition: color 0.2s;
        flex: 1;
        max-width: 100px;
      }

      .nav-item:hover {
        color: var(--primary-color, #03a9f4);
      }

      .nav-item.active {
        color: var(--primary-color, #03a9f4);
      }

      .nav-item ha-icon {
        --mdc-icon-size: 24px;
        margin-bottom: 4px;
      }

      .label {
        font-size: 12px;
        font-weight: 500;
      }

      @media (max-width: 600px) {
        .bottom-nav {
          padding: 4px 0;
        }

        .nav-item {
          padding: 4px 8px;
        }

        .label {
          font-size: 11px;
        }
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-bottom-nav': CustomBottomNav;
  }
}

// Registra la card con Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'custom-bottom-nav',
  name: 'Custom Bottom Navigation',
  description: 'A custom bottom navigation bar for Home Assistant'
});