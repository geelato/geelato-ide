<!--
-->
<template>
  <div class="gl-ide-plugin-x-designer-settings">
    <div class="gl-title">
      <a-icon type="setting"/>
      模板元素
    </div>
    <div>
      ss
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      边矩(px)
    </div>
    <div style="background-color: rgb(64, 64, 64);margin: 24px">
      <div
          style="align-items: center; display: grid; gap: 8px 4px; grid-template-columns: 44px 1fr; padding: 0px 8px 8px; grid-column: 1 / -1;">
        <div
            style="position: relative; display: grid; margin-top: 8px; margin-right: 8px; width: 224px; height: 120px; grid-template-columns: 36px 4px 36px 1fr 36px 4px 36px; grid-template-rows: 24px 4px 24px 1fr 24px 4px 24px; outline-style: none; cursor: default; user-select: none;">
          <div width="224" height="120"
               style="grid-area: 1 / 1 / -1 / -1; display: grid; grid-template-columns: 36px 1fr 36px; grid-template-rows: 24px minmax(16px, 1fr) 24px; justify-items: center; width: 224px; height: 120px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="224" height="120" style="grid-area: 1 / 1 / -1 / -1;">
              <g style="cursor: not-allowed;">
                <g style="opacity: 0.3;">
                  <path cursor="n-resize" mode="delta" fill="currentColor" d="
  m1,1
  h223
  l-36,24
  h-151
  l-36,-24z
" threshold="1" disabled="" data-automation-id="margin-top-button" aria-label="Margin top button" delay="0"
                        style="color: rgb(77, 77, 77); cursor: n-resize;"></path>
                </g>
              </g>
              <g>
                <g>
                  <path cursor="e-resize" mode="delta" fill="currentColor" d="
  m223,1
  v119
  l-36,-24
  v-71
  l36,-24z
" threshold="1" data-automation-id="margin-right-button" aria-label="Margin right button" delay="0"
                        style="color: rgb(85, 85, 85); cursor: e-resize;"></path>
                </g>
              </g>
              <g style="cursor: not-allowed;">
                <g style="opacity: 0.3;">
                  <path cursor="s-resize" mode="delta" fill="currentColor" d="
  m1,119
  h223
  l-36,-24
  h-151
  l-36,24z
" threshold="1" disabled="" data-automation-id="margin-bottom-button" aria-label="Margin bottom button" delay="0"
                        style="color: rgb(77, 77, 77); cursor: s-resize;"></path>
                </g>
              </g>
              <g>
                <g>
                  <path cursor="w-resize" mode="delta" fill="currentColor" d="
  m1,1
  v119
  l36,-24
  v-71
  l-36,-24z
" threshold="1" data-automation-id="margin-left-button" aria-label="Margin left button" delay="0"
                        style="color: rgb(85, 85, 85); cursor: w-resize;"></path>
                </g>
              </g>
              <clipPath id="margin-outer">
                <rect x="0" y="0" width="224" height="120" fill="transparent" rx="2" ry="2"
                      style="pointer-events: none;"></rect>
              </clipPath>
              <rect clip-path="url(#margin-outer)" x="0" y="0" width="224" height="120" fill="transparent" rx="2" ry="2"
                    style="pointer-events: none; stroke-width: 2px; stroke: rgb(51, 51, 51);"></rect>
              <clipPath id="margin-inner">
                <rect x="36" y="24" width="152" height="72" fill="transparent" rx="2" ry="2"
                      style="pointer-events: none;"></rect>
              </clipPath>
              <rect clip-path="url(#margin-inner)" x="36" y="24" width="152" height="72" fill="transparent" rx="2"
                    ry="2" style="pointer-events: none; stroke-width: 2px; stroke: rgb(51, 51, 51);"></rect>
            </svg>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="marginTop"
                 data-automation-id="margin-top-edit"
                 aria-label="Margin top edit"
                 style="grid-area: 1 / 2 / 2 / 3;">
              <gl-text v-model="style['margin-top']"></gl-text>
            </div>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="marginRight"
                 data-automation-id="margin-right-edit"
                 aria-label="Margin right edit"
                 style="grid-area: 2 / 3 / 3 / 4;">
              <gl-text v-model="style['margin-right']"></gl-text>
            </div>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="marginBottom"
                 data-automation-id="margin-bottom-edit"
                 aria-label="Margin bottom edit"
                 style="grid-area: 3 / 2 / 4 / 3;">
              <gl-text v-model="style['margin-bottom']"></gl-text>
            </div>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="marginLeft"
                 data-automation-id="margin-left-edit"
                 aria-label="Margin left edit"
                 style="grid-area: 2 / 1 / 3 / 2;">
              <gl-text v-model="style['margin-left']"></gl-text>
            </div>
          </div>
          <div width="144" height="64"
               style="grid-area: 3 / 3 / span 3 / span 3; display: grid; grid-template-columns: 36px 1fr 36px; grid-template-rows: 24px minmax(16px, 1fr) 24px; justify-items: center; width: 144px; height: 64px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="144" height="64" style="grid-area: 1 / 1 / -1 / -1;">
              <g style="cursor: not-allowed;">
                <g style="opacity: 0.3;">
                  <path cursor="s-resize" mode="delta" fill="currentColor" d="
  m1,1
  h143
  l-36,24
  h-71
  l-36,-24z
" threshold="1" disabled="" data-automation-id="padding-top-button" aria-label="Padding top button" delay="0"
                        style="color: rgb(77, 77, 77); cursor: s-resize;"></path>
                </g>
              </g>
              <g>
                <g>
                  <path cursor="w-resize" mode="delta" fill="currentColor" d="
  m143,1
  v63
  l-36,-24
  v-15
  l36,-24z
" threshold="1" data-automation-id="padding-right-button" aria-label="Padding right button" delay="0"
                        style="color: rgb(85, 85, 85); cursor: w-resize;"></path>
                </g>
              </g>
              <g style="cursor: not-allowed;">
                <g style="opacity: 0.3;">
                  <path cursor="n-resize" mode="delta" fill="currentColor" d="
  m1,63
  h143
  l-36,-24
  h-71
  l-36,24z
" threshold="1" disabled="" data-automation-id="padding-bottom-button" aria-label="Padding bottom button" delay="0"
                        style="color: rgb(77, 77, 77); cursor: n-resize;"></path>
                </g>
              </g>
              <g>
                <g>
                  <path cursor="e-resize" mode="delta" fill="currentColor" d="
  m1,1
  v63
  l36,-24
  v-15
  l-36,-24z
" threshold="1" data-automation-id="padding-left-button" aria-label="Padding left button" delay="0"
                        style="color: rgb(85, 85, 85); cursor: e-resize;"></path>
                </g>
              </g>
              <clipPath id="padding-outer">
                <rect x="0" y="0" width="144" height="64" fill="transparent" rx="2" ry="2"
                      style="pointer-events: none;"></rect>
              </clipPath>
              <rect clip-path="url(#padding-outer)" x="0" y="0" width="144" height="64" fill="transparent" rx="2" ry="2"
                    style="pointer-events: none; stroke-width: 2px; stroke: rgb(51, 51, 51);"></rect>
              <clipPath id="padding-inner">
                <rect x="36" y="24" width="72" height="16" fill="transparent" rx="2" ry="2"
                      style="pointer-events: none;"></rect>
              </clipPath>
              <rect clip-path="url(#padding-inner)" x="36" y="24" width="72" height="16" fill="transparent" rx="2"
                    ry="2" style="pointer-events: none; stroke-width: 2px; stroke: rgb(51, 51, 51);"></rect>
            </svg>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="paddingTop"
                 data-automation-id="padding-top-edit"
                 aria-label="Padding top edit"
                 style="grid-area: 1 / 2 / 2 / 3;">
              <gl-text v-model="style['padding-top']"></gl-text>
            </div>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="paddingRight"
                 data-automation-id="padding-right-edit"
                 aria-label="Padding right edit"
                 style="grid-area: 2 / 3 / 3 / 4;">
              <gl-text v-model="style['padding-right']"></gl-text>
            </div>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="paddingBottom"
                 data-automation-id="padding-bottom-edit"
                 aria-label="Padding bottom edit"
                 style="grid-area: 3 / 2 / 4 / 3;">
              <gl-text v-model="style['padding-bottom']"></gl-text>
            </div>
            <div class="mp-size" threshold="1" delay="300" mode="delta" name="paddingLeft"
                 data-automation-id="padding-left-edit"
                 aria-label="Padding left edit"
                 style="grid-area: 2 / 1 / 3 / 2;">
              <gl-text v-model="style['padding-left']"></gl-text>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
               style="grid-area: 3 / 3 / span 3 / span 3; pointer-events: none;">
            <text x="6" y="4" fill="#a6a6a6" font-style="italic" font-weight="bold" font-size="8"
                  dominant-baseline="hanging">内边距
            </text>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
               style="grid-area: 1 / 1 / -1 / -1; pointer-events: none;">
            <text x="6" y="4" fill="#a6a6a6" font-style="italic" font-weight="bold" font-size="8"
                  dominant-baseline="hanging">外边距
            </text>
          </svg>
        </div>
      </div>
      <div style="height: 1px; width: 100%; border-bottom: 1px solid rgb(33, 33, 33);"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GlIdePluginLayoutSegmentSettings",
    props: {
      ideStore: {
        type: Object
      },
      config: {
        type: Object
      }
    },
    data() {
      return {
        // padding: {left: 0, right: 0, top: 0, bottom: 0},
        // margin: {left: 0, right: 0, top: 0, bottom: 0},
        style: this.config.style
      };
    },
    watch: {},
    updated() {
      console.log('GlIdePluginLayoutSegmentSettings > updated config..........', this.config)
    },
    mounted() {
      console.log('GlIdePluginLayoutSegmentSettings > mounted config..........', this.config)
    },
    methods: {}
  }
</script>

<style>

  .mp-size {
    cursor: default;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
    line-height: 10px;
    letter-spacing: -0.2px;
    display: flex;
    color: rgb(139, 190, 250);
    background: rgba(76, 152, 241, 0.15);
    padding: 2px;
    margin-left: -2px;
    border-radius: 2px;
    max-width: 100%;
    box-sizing: content-box;
    place-self: center;
    position: relative;
    opacity: 1;
    align-items: center;
    justify-content: center;
  }

  .mp-size .gl-text {
    min-width: 1em;
    min-height: 1em;
    text-align: center;
  }

</style>
