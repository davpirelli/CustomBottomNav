import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { CustomBottomNavConfig } from './custom-bottom-nav';

declare global {
  interface Window {
    customCards: any[];
  }
}

interface LovelaceCardEditor extends HTMLElement {
  setConfig(config: CustomBottomNavConfig): void;
}

@customElement('custom-bottom-nav-editor')
export class CustomBottomNavEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: CustomBottomNavConfig;
  @state() private _helpers?: any;
  @state() private _selectedRouteIndex: number = -1;
  
  private _initialized = false;

  public setConfig(config: CustomBottomNavConfig): void {
    this._config = config;
    this.loadCardHelpers();
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  protected firstUpdated(): void {
    this.loadCardHelpers();
  }

  private _computeLabel(schema: any) {
    switch (schema.name) {
      case 'show_labels':
        return 'Show Labels';
      case 'hide_when_scrolling':
        return 'Hide When Scrolling';
      case 'position':
        return 'Position';
      default:
        return schema.label || schema.name;
    }
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) return;

    const target = ev.target as any;
    if (this[`_${target.configValue}`] === target.value) return;

    if (target.configValue) {
      const newConfig = { ...this._config };
      
      if (target.value === '') {
        delete newConfig[target.configValue];
      } else {
        newConfig[target.configValue] = target.value;
      }
      
      fireEvent(this, 'config-changed', { config: newConfig });
    }
  }

  private _addRoute(): void {
    if (!this._config) return;

    const routes = [...(this._config.routes || [])];
    routes.push({
      path: '/lovelace/0',
      icon: 'mdi:home',
      label: 'New Tab',
      type: 'dashboard'
    });

    fireEvent(this, 'config-changed', { 
      config: { ...this._config, routes } 
    });
  }

  private _removeRoute(index: number): void {
    if (!this._config) return;

    const routes = [...(this._config.routes || [])];
    routes.splice(index, 1);

    fireEvent(this, 'config-changed', { 
      config: { ...this._config, routes } 
    });
  }

  private _routeValueChanged(index: number, field: string, value: string): void {
    if (!this._config) return;

    const routes = [...(this._config.routes || [])];
    routes[index] = {
      ...routes[index],
      [field]: value
    };

    fireEvent(this, 'config-changed', { 
      config: { ...this._config, routes } 
    });
  }

  private _moveRoute(index: number, direction: 'up' | 'down'): void {
    if (!this._config) return;

    const routes = [...(this._config.routes || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= routes.length) return;

    [routes[index], routes[newIndex]] = [routes[newIndex], routes[index]];

    fireEvent(this, 'config-changed', { 
      config: { ...this._config, routes } 
    });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const schema = [
      {
        name: 'show_labels',
        selector: { boolean: {} }
      },
      {
        name: 'hide_when_scrolling',
        selector: { boolean: {} }
      },
      {
        name: 'position',
        selector: {
          select: {
            options: [
              { value: 'bottom', label: 'Bottom' },
              { value: 'top', label: 'Top' }
            ]
          }
        }
      }
    ];

    return html`
      <div class="card-config">
        <div class="option">
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${schema}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>

        <div class="routes-section">
          <h3>Navigation Routes</h3>
          
          ${this._config.routes?.map((route, index) => html`
            <div class="route-item">
              <div class="route-header">
                <span class="route-number">${index + 1}</span>
                <div class="route-controls">
                  <ha-icon-button
                    .disabled=${index === 0}
                    @click=${() => this._moveRoute(index, 'up')}
                    .path=${'M7,15L12,10L17,15H7Z'}
                  ></ha-icon-button>
                  <ha-icon-button
                    .disabled=${index === this._config!.routes.length - 1}
                    @click=${() => this._moveRoute(index, 'down')}
                    .path=${'M7,10L12,15L17,10H7Z'}
                  ></ha-icon-button>
                  <ha-icon-button
                    @click=${() => this._removeRoute(index)}
                    .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                  ></ha-icon-button>
                </div>
              </div>
              
              <div class="route-fields">
                <ha-select
                  label="Type"
                  .value=${route.type || 'dashboard'}
                  @selected=${(e: Event) => {
                    const target = e.target as any;
                    this._routeValueChanged(index, 'type', target.value);
                  }}
                >
                  <mwc-list-item value="dashboard">Dashboard</mwc-list-item>
                  <mwc-list-item value="entity">Entity</mwc-list-item>
                </ha-select>

                ${route.type !== 'entity' ? html`
                  <ha-textfield
                    label="Path"
                    .value=${route.path || ''}
                    @input=${(e: Event) => {
                      const target = e.target as any;
                      this._routeValueChanged(index, 'path', target.value);
                    }}
                  ></ha-textfield>
                ` : html`
                  <ha-entity-picker
                    .hass=${this.hass}
                    label="Entity"
                    .value=${route.entity || ''}
                    @value-changed=${(e: CustomEvent) =>
                      this._routeValueChanged(index, 'entity', e.detail.value)
                    }
                  ></ha-entity-picker>
                `}

                <ha-icon-picker
                  label="Icon"
                  .value=${route.icon || ''}
                  @value-changed=${(e: CustomEvent) => 
                    this._routeValueChanged(index, 'icon', e.detail.value)
                  }
                ></ha-icon-picker>

                <ha-textfield
                  label="Label (optional)"
                  .value=${route.label || ''}
                  @input=${(e: Event) => {
                    const target = e.target as any;
                    this._routeValueChanged(index, 'label', target.value);
                  }}
                ></ha-textfield>

                <ha-icon-picker
                  label="Active Icon (optional)"
                  .value=${route.active_icon || ''}
                  @value-changed=${(e: CustomEvent) => 
                    this._routeValueChanged(index, 'active_icon', e.detail.value)
                  }
                ></ha-icon-picker>
              </div>
            </div>
          `)}

          <ha-button @click=${this._addRoute}>
            Add Route
          </ha-button>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        padding: 16px;
      }

      .option {
        margin-bottom: 16px;
      }

      .routes-section {
        margin-top: 24px;
      }

      .routes-section h3 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 500;
      }

      .route-item {
        background: var(--secondary-background-color);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
      }

      .route-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .route-number {
        font-weight: 500;
        color: var(--primary-color);
        padding: 4px 8px;
        background: var(--primary-color-light);
        border-radius: 4px;
        opacity: 0.2;
      }

      .route-controls {
        display: flex;
        gap: 4px;
      }

      .route-fields {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      ha-button {
        margin-top: 8px;
      }

      ha-icon-button {
        --mdc-icon-button-size: 36px;
      }

      ha-textfield,
      ha-icon-picker {
        width: 100%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-bottom-nav-editor': CustomBottomNavEditor;
  }
}