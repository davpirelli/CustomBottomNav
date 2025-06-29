import{_ as e,n as t,r as o,t as a,i,x as n,a as s}from"./custom-bottom-nav-BouBUzeo.js";var c,l,r;(r=c||(c={})).language="language",r.system="system",r.comma_decimal="comma_decimal",r.decimal_comma="decimal_comma",r.space_comma="space_comma",r.none="none",function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(l||(l={}));var u=function(e,t,o,a){a=a||{},o=null==o?{}:o;var i=new Event(t,{bubbles:void 0===a.bubbles||a.bubbles,cancelable:Boolean(a.cancelable),composed:void 0===a.composed||a.composed});return i.detail=o,e.dispatchEvent(i),i};let h=class extends i{constructor(){super(...arguments),this._selectedRouteIndex=-1,this._initialized=!1}setConfig(e){this._config=e,this.loadCardHelpers()}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}firstUpdated(){this.loadCardHelpers()}_computeLabel(e){switch(e.name){case"show_labels":return"Show Labels";case"hide_when_scrolling":return"Hide When Scrolling";case"position":return"Position";default:return e.label||e.name}}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(this[`_${t.configValue}`]!==t.value&&t.configValue){const e={...this._config};""===t.value?delete e[t.configValue]:e[t.configValue]=t.value,u(this,"config-changed",{config:e})}}_addRoute(){if(!this._config)return;const e=[...this._config.routes||[]];e.push({path:"/lovelace/0",icon:"mdi:home",label:"New Tab",type:"dashboard"}),u(this,"config-changed",{config:{...this._config,routes:e}})}_removeRoute(e){if(!this._config)return;const t=[...this._config.routes||[]];t.splice(e,1),u(this,"config-changed",{config:{...this._config,routes:t}})}_routeValueChanged(e,t,o){if(!this._config)return;const a=[...this._config.routes||[]];a[e]={...a[e],[t]:o},u(this,"config-changed",{config:{...this._config,routes:a}})}_moveRoute(e,t){if(!this._config)return;const o=[...this._config.routes||[]],a="up"===t?e-1:e+1;a<0||a>=o.length||([o[e],o[a]]=[o[a],o[e]],u(this,"config-changed",{config:{...this._config,routes:o}}))}render(){if(!this.hass||!this._config)return n``;return n`
      <div class="card-config">
        <div class="option">
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[{name:"show_labels",selector:{boolean:{}}},{name:"hide_when_scrolling",selector:{boolean:{}}},{name:"position",selector:{select:{options:[{value:"bottom",label:"Bottom"},{value:"top",label:"Top"}]}}}]}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>

        <div class="routes-section">
          <h3>Navigation Routes</h3>
          
          ${this._config.routes?.map((e,t)=>n`
            <div class="route-item">
              <div class="route-header">
                <span class="route-number">${t+1}</span>
                <div class="route-controls">
                  <ha-icon-button
                    .disabled=${0===t}
                    @click=${()=>this._moveRoute(t,"up")}
                    .path=${"M7,15L12,10L17,15H7Z"}
                  ></ha-icon-button>
                  <ha-icon-button
                    .disabled=${t===this._config.routes.length-1}
                    @click=${()=>this._moveRoute(t,"down")}
                    .path=${"M7,10L12,15L17,10H7Z"}
                  ></ha-icon-button>
                  <ha-icon-button
                    @click=${()=>this._removeRoute(t)}
                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  ></ha-icon-button>
                </div>
              </div>
              
              <div class="route-fields">
                <ha-select
                  label="Type"
                  .value=${e.type||"dashboard"}
                  @selected=${e=>{const o=e.target;this._routeValueChanged(t,"type",o.value)}}
                >
                  <mwc-list-item value="dashboard">Dashboard</mwc-list-item>
                  <mwc-list-item value="entity">Entity</mwc-list-item>
                </ha-select>

                ${"entity"!==e.type?n`
                  <ha-textfield
                    label="Path"
                    .value=${e.path||""}
                    @input=${e=>{const o=e.target;this._routeValueChanged(t,"path",o.value)}}
                  ></ha-textfield>
                `:n`
                  <ha-entity-picker
                    .hass=${this.hass}
                    label="Entity"
                    .value=${e.entity||""}
                    @value-changed=${e=>this._routeValueChanged(t,"entity",e.detail.value)}
                  ></ha-entity-picker>
                `}

                <ha-icon-picker
                  label="Icon"
                  .value=${e.icon||""}
                  @value-changed=${e=>this._routeValueChanged(t,"icon",e.detail.value)}
                ></ha-icon-picker>

                <ha-textfield
                  label="Label (optional)"
                  .value=${e.label||""}
                  @input=${e=>{const o=e.target;this._routeValueChanged(t,"label",o.value)}}
                ></ha-textfield>

                <ha-icon-picker
                  label="Active Icon (optional)"
                  .value=${e.active_icon||""}
                  @value-changed=${e=>this._routeValueChanged(t,"active_icon",e.detail.value)}
                ></ha-icon-picker>
              </div>
            </div>
          `)}

          <ha-button @click=${this._addRoute}>
            Add Route
          </ha-button>
        </div>
      </div>
    `}static get styles(){return s`
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
    `}};e([t({attribute:!1})],h.prototype,"hass",void 0),e([o()],h.prototype,"_config",void 0),e([o()],h.prototype,"_helpers",void 0),e([o()],h.prototype,"_selectedRouteIndex",void 0),h=e([a("custom-bottom-nav-editor")],h);export{h as CustomBottomNavEditor};
