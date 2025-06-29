import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig, LovelaceCard } from 'custom-card-helpers';

interface LovelaceCardEditor extends HTMLElement {
  setConfig(config: CustomBottomNavConfig): void;
}

interface RouteConfig {
  path: string;
  icon: string;
  label?: string;
  active_icon?: string;
  type?: 'dashboard' | 'entity';
  entity?: string;
}

export interface CustomBottomNavConfig extends LovelaceCardConfig {
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

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./custom-bottom-nav-editor');
    return document.createElement('custom-bottom-nav-editor');
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

  private _navigate(route: RouteConfig): void {
    if (route.type === 'entity' && route.entity) {
      this._handleEntityRoute(route.entity);
    } else {
      history.pushState(null, '', route.path);
      window.dispatchEvent(new Event('location-changed'));
    }
  }

  private _handleEntityRoute(entityId: string): void {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
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
              @click=${() => this._navigate(route)}
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
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05);
        padding: 8px 0;
        position: fixed;
        left: 16px;
        right: 16px;
        z-index: 100;
        border-radius: 20px;
        max-width: 400px;
        margin: 0 auto;
      }

      @media (prefers-color-scheme: dark) {
        .bottom-nav {
          background: rgba(38, 38, 38, 0.7);
        }
      }

      .bottom-nav.bottom {
        bottom: 16px;
      }

      .bottom-nav.top {
        top: 16px;
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
        color: rgba(60, 60, 67, 0.6);
        transition: all 0.2s ease;
        flex: 1;
        max-width: 100px;
        position: relative;
      }

      @media (prefers-color-scheme: dark) {
        .nav-item {
          color: rgba(235, 235, 245, 0.6);
        }
      }

      .nav-item:hover {
        color: var(--primary-color, #007AFF);
      }

      .nav-item.active {
        color: var(--primary-color, #007AFF);
      }

      @media (prefers-color-scheme: dark) {
        .nav-item:hover,
        .nav-item.active {
          color: var(--primary-color, #0A84FF);
        }
      }

      .nav-item ha-icon {
        --mdc-icon-size: 24px;
        margin-bottom: 2px;
        transition: transform 0.2s ease;
      }

      .nav-item.active ha-icon {
        transform: scale(1.1);
      }

      .label {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: -0.2px;
        opacity: 0.8;
      }

      @media (max-width: 600px) {
        .bottom-nav {
          padding: 6px 0;
          left: 12px;
          right: 12px;
          border-radius: 16px;
        }

        .nav-item {
          padding: 6px 8px;
        }

        .label {
          font-size: 9px;
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