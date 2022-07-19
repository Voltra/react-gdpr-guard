var e=require("gdpr-guard"),r=require("react");function n(e,r){return(n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e})(e,r)}var t=function(){function e(e){this._manager=e,this.state=this.generateRawManager()}var r,n,t=e.prototype;return t.triggerUpdate=function(){this.state=this.generateRawManager()},t.closeBanner=function(){this.manager.closeBanner(),this.triggerUpdate()},t.resetAndShowBanner=function(){this.manager.resetAndShowBanner(),this.triggerUpdate()},t.json=function(){return this.materializedState},t.toString=function(){return JSON.stringify(this.materializedState)},t.disable=function(e){return this.wrap("disable",e)},t.enable=function(e){return this.wrap("enable",e)},t.toggle=function(e){return this.wrap("toggle",e)},t.disableForStorage=function(e){return this.manager.disableForStorage(e),this},t.enableForStorage=function(e){return this.manager.enableForStorage(e),this},t.toggleForStorage=function(e){return this.manager.toggleForStorage(e),this},t.isEnabled=function(e){return this.manager.isEnabled(e)},t.hasGroup=function(e){return this.manager.hasGroup(e)},t.hasGuard=function(e){return this.manager.hasGuard(e)},t.getGroup=function(e){return this.manager.getGroup(e)},t.getGuard=function(e){return this.manager.getGuard(e)},t.generateRawManager=function(){return this.manager.raw()},t.hotswap=function(e){return this._manager=e,this.triggerUpdate(),this},t.wrap=function(e,r){for(var n=arguments.length,t=new Array(n>2?n-2:0),a=2;a<n;a++)t[a-2]=arguments[a];var o;if(void 0===r&&"function"==typeof this.manager[e])(o=this.manager)[e].apply(o,t),this.triggerUpdate();else if(this.manager.hasGuard(r)){var i=this.manager.getGuard(r);"function"==typeof(null==i?void 0:i[e])&&(null==i||i[e].apply(i,t),this.triggerUpdate())}return this},r=e,(n=[{key:"manager",get:function(){return this._manager}},{key:"materializedState",get:function(){return this.state}},{key:"bannerWasShown",get:function(){return this.manager.bannerWasShown}},{key:"events",get:function(){return this.manager.events}}])&&function(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}(r.prototype,n),Object.defineProperty(r,"prototype",{writable:!1}),e}(),a=function(e){var r,t;function a(r,n){var t;return(t=e.call(this)||this).savior=r,t.managerWrapper=n,t}t=e,(r=a).prototype=Object.create(t.prototype),r.prototype.constructor=r,n(r,t);var o=a.prototype;return o.updateSharedManager=function(e){try{var r=this;return r.managerWrapper.manager===e?Promise.resolve():Promise.resolve(r.savior.updateSharedManager(e)).then(function(){r.managerWrapper.hotswap(e)})}catch(e){return Promise.reject(e)}},o.check=function(){return this.savior.check()},o.exists=function(e){return void 0===e&&(e=!0),this.savior.exists(e)},o.restore=function(e){return void 0===e&&(e=!0),this.savior.restore(e)},o.restoreOrCreate=function(e){return this.savior.restoreOrCreate(e)},o.store=function(e){return this.savior.store(e)},a}(e.GdprSaviorAdapter),o=function(e,n){return void 0===n&&(n=[]),r.useCallback(e,n)};exports.createGdprGuardHooks=function(n,i){var u=e.GdprManager.create([]),s=new t(u),c=new a(n,s),g=function(e,n){void 0===n&&(n=[]);var t=o(e,n);return r.useMemo(t,[s.materializedState,t])},f=function(){return s};return{useSetupGdprEffect:function(){!function(e,n){void 0===n&&(n=[]);var t=r.useRef(!1);r.useEffect(function(){t.current&&e(),t.current=!0},[].concat(n,[e,t]))}(o(function(){try{return Promise.resolve(c.restoreOrCreate(i)).then(function(){})}catch(e){Promise.reject(e)}})),r.useEffect(function(){s.bannerWasShown&&s.closeBanner()},[s.manager])},useAttachGdprListenersEffect:function(e){var n=f();r.useEffect(function(){e(n.manager.events)},[e,n.manager])},useGdprSavior:function(){return c},useGdprManager:f,useGdprComputed:g,useGdprGuardEnabledState:function(e,r){return void 0===r&&(r=!1),g(function(){var n,t;return(!r||s.bannerWasShown)&&null!=(n=null===(t=s.getGuard(e))||void 0===t?void 0:t.enabled)&&n},[e,s.bannerWasShown])},useGdprGuard:function(e){return{guard:g(function(){var r;return null===(r=s.getGuard(e))||void 0===r?void 0:r.raw()},[e]),enableGuard:o(function(){s.enable(e)},[e]),disableGuard:o(function(){s.disable(e)},[e]),toggleGuard:o(function(){s.toggle(e)},[e])}},useGdpr:function(){var e=g(function(){return s.materializedState}),r=o(function(){s.enable()}),n=o(function(){s.disable()}),t=o(function(){s.toggle()}),a=o(function(e){s.enable(e)}),i=o(function(e){s.disable(e)}),u=o(function(e){s.toggle(e)}),c=o(function(e,r){return void 0===r&&(r=!1),(!r||s.bannerWasShown)&&s.isEnabled(e)}),f=o(function(e){s.enableForStorage(e)}),d=o(function(e){s.disableForStorage(e)}),l=o(function(e){s.toggleForStorage(e)});return{closeGdprBanner:o(function(){return s.closeBanner()}),resetAndShowBanner:o(function(){return s.resetAndShowBanner()}),bannerWasShown:g(function(){return s.bannerWasShown}),manager:e,enableManager:r,disableManager:n,toggleManager:t,enableGuard:a,disableGuard:i,toggleGuard:u,guardIsEnabled:c,enableForStorage:f,disableForStorage:d,toggleForStorage:l}}}};
//# sourceMappingURL=index.js.map
