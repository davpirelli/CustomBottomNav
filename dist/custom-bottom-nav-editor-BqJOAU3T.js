import{_ as t,n as e,r as i,t as a,i as o,x as n,a as s}from"./custom-bottom-nav-NuOxcC5U.js";var c,l,d;(d=c||(c={})).language="language",d.system="system",d.comma_decimal="comma_decimal",d.decimal_comma="decimal_comma",d.space_comma="space_comma",d.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(l||(l={}));var r=function(t,e,i,a){a=a||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===a.bubbles||a.bubbles,cancelable:Boolean(a.cancelable),composed:void 0===a.composed||a.composed});return o.detail=i,t.dispatchEvent(o),o};let h=class extends o{constructor(){super(...arguments),this._addingRoute=!1,this._initialized=!1}setConfig(t){this._config=t,this.loadCardHelpers()}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}firstUpdated(){this.loadCardHelpers()}_computeLabel(t){switch(t.name){case"show_labels":return"Show Labels";case"hide_when_scrolling":return"Hide When Scrolling";case"position":return"Position";default:return t.label||t.name}}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.configValue||t.detail?.value;if(i){const a={...this._config};void 0===t.detail?.value||""===t.detail?.value?delete a[i]:a[i]=t.detail?.value??e.value,r(this,"config-changed",{config:a})}}_addRoute(t){if(!this._config)return;const e=[...this._config.routes||[]];"dashboard"===t?e.push({path:"/lovelace/0",icon:"mdi:view-dashboard",label:"New Dashboard",type:"dashboard"}):e.push({path:"",icon:"mdi:lightbulb",label:"New Entity",type:"entity",entity:""}),this._addingRoute=!1,r(this,"config-changed",{config:{...this._config,routes:e}})}_removeRoute(t){if(!this._config)return;const e=[...this._config.routes||[]];e.splice(t,1),r(this,"config-changed",{config:{...this._config,routes:e}})}_routeValueChanged(t,e,i){if(!this._config)return;const a=[...this._config.routes||[]];a[t]={...a[t],[e]:i},"type"===e&&("entity"===i?(a[t].entity="",a[t].path=""):(a[t].path="/lovelace/0",delete a[t].entity)),r(this,"config-changed",{config:{...this._config,routes:a}})}_moveRoute(t,e){if(!this._config)return;const i=[...this._config.routes||[]],a="up"===e?t-1:t+1;a<0||a>=i.length||([i[t],i[a]]=[i[a],i[t]],r(this,"config-changed",{config:{...this._config,routes:i}}))}render(){if(!this.hass||!this._config)return n``;return n`
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
          <div class="routes-header">
            <h3>Navigation Items</h3>
            ${this._addingRoute?n`
              <div class="add-buttons">
                <mwc-button 
                  @click=${()=>this._addRoute("dashboard")}
                  icon="mdi:view-dashboard"
                >
                  Dashboard
                </mwc-button>
                <mwc-button 
                  @click=${()=>this._addRoute("entity")}
                  icon="mdi:lightbulb"
                >
                  Entity
                </mwc-button>
                <ha-icon-button
                  @click=${()=>this._addingRoute=!1}
                  .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                ></ha-icon-button>
              </div>
            `:n`
              <ha-icon-button
                @click=${()=>this._addingRoute=!0}
                .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
              ></ha-icon-button>
            `}
          </div>
          
          ${this._config.routes?.map((t,e)=>n`
            <div class="route-item">
              <div class="route-header">
                <div class="route-type-icon">
                  <ha-icon 
                    icon=${"entity"===t.type?"mdi:lightbulb":"mdi:view-dashboard"}
                  ></ha-icon>
                </div>
                <div class="route-controls">
                  <ha-icon-button
                    .disabled=${0===e}
                    @click=${()=>this._moveRoute(e,"up")}
                    .path=${"M7,15L12,10L17,15H7Z"}
                  ></ha-icon-button>
                  <ha-icon-button
                    .disabled=${e===this._config.routes.length-1}
                    @click=${()=>this._moveRoute(e,"down")}
                    .path=${"M7,10L12,15L17,10H7Z"}
                  ></ha-icon-button>
                  <ha-icon-button
                    @click=${()=>this._removeRoute(e)}
                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  ></ha-icon-button>
                </div>
              </div>
              
              <div class="route-fields">
                <ha-select
                  label="Type"
                  .value=${t.type||"dashboard"}
                  @closed=${t=>t.stopPropagation()}
                  @selected=${t=>{this._routeValueChanged(e,"type",t.detail.value)}}
                >
                  <mwc-list-item value="dashboard">Dashboard</mwc-list-item>
                  <mwc-list-item value="entity">Entity</mwc-list-item>
                </ha-select>

                ${"entity"!==t.type?n`
                  <ha-textfield
                    label="Path"
                    .value=${t.path||""}
                    @input=${t=>{const i=t.target;this._routeValueChanged(e,"path",i.value)}}
                  ></ha-textfield>
                `:n`
                  <ha-entity-picker
                    .hass=${this.hass}
                    label="Entity"
                    .value=${t.entity||""}
                    allow-custom-entity
                    @value-changed=${t=>{t.stopPropagation(),this._routeValueChanged(e,"entity",t.detail.value)}}
                  ></ha-entity-picker>
                `}

                <ha-icon-picker
                  label="Icon"
                  .value=${t.icon||""}
                  @value-changed=${t=>{t.stopPropagation(),this._routeValueChanged(e,"icon",t.detail.value)}}
                ></ha-icon-picker>

                <ha-textfield
                  label="Label (optional)"
                  .value=${t.label||""}
                  @input=${t=>{const i=t.target;this._routeValueChanged(e,"label",i.value)}}
                ></ha-textfield>

                <ha-icon-picker
                  label="Active Icon (optional)"
                  .value=${t.active_icon||""}
                  @value-changed=${t=>{t.stopPropagation(),this._routeValueChanged(e,"active_icon",t.detail.value)}}
                ></ha-icon-picker>
              </div>
            </div>
          `)}
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

      .routes-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .routes-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .add-buttons {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .add-buttons mwc-button {
        --mdc-theme-primary: var(--primary-color);
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

      .route-type-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--primary-background-color);
        border-radius: 50%;
        color: var(--primary-text-color);
      }

      .route-type-icon ha-icon {
        --mdc-icon-size: 20px;
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

      ha-icon-button {
        --mdc-icon-button-size: 36px;
      }

      ha-textfield,
      ha-icon-picker,
      ha-entity-picker,
      ha-select {
        width: 100%;
      }

      ha-entity-picker {
        display: block;
      }
    `}};t([e({attribute:!1})],h.prototype,"hass",void 0),t([i()],h.prototype,"_config",void 0),t([i()],h.prototype,"_helpers",void 0),t([i()],h.prototype,"_addingRoute",void 0),h=t([a("custom-bottom-nav-editor")],h);export{h as CustomBottomNavEditor};
