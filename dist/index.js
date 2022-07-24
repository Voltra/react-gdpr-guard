var e=require("gdpr-guard"),r=require("react");function t(e,r){return(t=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e})(e,r)}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var n=function(){function e(e){this._manager=e,this.state=this.generateRawManager()}var r,t,n=e.prototype;return n.triggerUpdate=function(){this.state=this.generateRawManager()},n.closeBanner=function(){this.manager.closeBanner(),this.triggerUpdate()},n.resetAndShowBanner=function(){this.manager.resetAndShowBanner(),this.triggerUpdate()},n.json=function(){return this.materializedState},n.toString=function(){return JSON.stringify(this.materializedState)},n.disable=function(e){return this.wrap("disable",e)},n.enable=function(e){return this.wrap("enable",e)},n.toggle=function(e){return this.wrap("toggle",e)},n.disableForStorage=function(e){return this.manager.disableForStorage(e),this},n.enableForStorage=function(e){return this.manager.enableForStorage(e),this},n.toggleForStorage=function(e){return this.manager.toggleForStorage(e),this},n.isEnabled=function(e){return this.manager.isEnabled(e)},n.hasGroup=function(e){return this.manager.hasGroup(e)},n.hasGuard=function(e){return this.manager.hasGuard(e)},n.getGroup=function(e){return this.manager.getGroup(e)},n.getGuard=function(e){return this.manager.getGuard(e)},n.generateRawManager=function(){return this.manager.raw()},n.hotswap=function(e){return this._manager=e,this.triggerUpdate(),this},n.wrap=function(e,r){for(var t=arguments.length,n=new Array(t>2?t-2:0),a=2;a<t;a++)n[a-2]=arguments[a];var o;if(void 0===r&&"function"==typeof this.manager[e])(o=this.manager)[e].apply(o,n),this.triggerUpdate();else if(this.manager.hasGuard(r)){var i=this.manager.getGuard(r);"function"==typeof(null==i?void 0:i[e])&&(null==i||i[e].apply(i,n),this.triggerUpdate())}return this},r=e,(t=[{key:"manager",get:function(){return this._manager}},{key:"materializedState",get:function(){return this.state}},{key:"bannerWasShown",get:function(){return this.manager.bannerWasShown}},{key:"events",get:function(){return this.manager.events}}])&&function(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(r.prototype,t),Object.defineProperty(r,"prototype",{writable:!1}),e}(),a=function(e){var r,n;function a(r,t){var n;return(n=e.call(this)||this).savior=r,n.managerWrapper=t,n}n=e,(r=a).prototype=Object.create(n.prototype),r.prototype.constructor=r,t(r,n);var o=a.prototype;return o.updateSharedManager=function(e){try{var r=this;return r.managerWrapper.manager===e?Promise.resolve():Promise.resolve(r.savior.updateSharedManager(e)).then(function(){r.managerWrapper.hotswap(e)})}catch(e){return Promise.reject(e)}},o.check=function(){return this.savior.check()},o.exists=function(e){return void 0===e&&(e=!0),this.savior.exists(e)},o.restore=function(e){return void 0===e&&(e=!0),this.savior.restore(e)},o.restoreOrCreate=function(e){return this.savior.restoreOrCreate(e)},o.store=function(e){return this.savior.store(e)},a}(e.GdprSaviorAdapter),o=function(e,t){return void 0===t&&(t=[]),r.useCallback(e,t)};exports.createGdprGuardHooks=function(t,i){var u=e.GdprManager.create([]),s=new n(u),c=new a(t,s),g=function(){return s},f=function(e,t){void 0===t&&(t=[]);var n=o(e,t);return r.useMemo(n,[s.materializedState,n])};return{useSetupGdprEffect:function(e){void 0===e&&(e=function(e){});var t,n=(t=g(),r.useMemo(function(){return t.manager},[t]));!function(e,t){void 0===t&&(t=[]);var n=r.useRef(!1);r.useEffect(function(){n.current&&e(),n.current=!0},[].concat(t,[e,n]))}(o(function(){!function(){try{var r=function(e,r){try{var t=Promise.resolve(c.restoreOrCreate(i)).then(function(e){s.hotswap(e)})}catch(e){return r(e)}return t&&t.then?t.then(void 0,r):t}(0,function(r){e(r)});r&&r.then&&r.then(function(){})}catch(e){Promise.reject(e)}}()})),r.useEffect(function(){s.bannerWasShown&&s.closeBanner()},[n])},useAttachGdprListenersEffect:function(e){var t=g();r.useEffect(function(){e(t.manager.events)},[e,t.manager])},useGdprSavior:function(){return c},useGdprManager:g,useGdprComputed:f,useGdprGuardEnabledState:function(e,r){return void 0===r&&(r=!1),f(function(){var t,n;return(!r||s.bannerWasShown)&&null!=(t=null===(n=s.getGuard(e))||void 0===n?void 0:n.enabled)&&t},[e,s.bannerWasShown])},useGdprGuard:function(e){return{guard:f(function(){var r;return null===(r=s.getGuard(e))||void 0===r?void 0:r.raw()},[e]),enableGuard:o(function(){s.enable(e)},[e]),disableGuard:o(function(){s.disable(e)},[e]),toggleGuard:o(function(){s.toggle(e)},[e])}},useGdpr:function(){var e=f(function(){return s.materializedState}),r=o(function(){s.enable()}),t=o(function(){s.disable()}),n=o(function(){s.toggle()}),a=o(function(e){s.enable(e)}),i=o(function(e){s.disable(e)}),u=o(function(e){s.toggle(e)}),c=o(function(e,r){return void 0===r&&(r=!1),(!r||s.bannerWasShown)&&s.isEnabled(e)}),g=o(function(e){s.enableForStorage(e)}),d=o(function(e){s.disableForStorage(e)}),l=o(function(e){s.toggleForStorage(e)});return{closeGdprBanner:o(function(){return s.closeBanner()}),resetAndShowBanner:o(function(){return s.resetAndShowBanner()}),bannerWasShown:f(function(){return s.bannerWasShown}),manager:e,enableManager:r,disableManager:t,toggleManager:n,enableGuard:a,disableGuard:i,toggleGuard:u,guardIsEnabled:c,enableForStorage:g,disableForStorage:d,toggleForStorage:l}}}};
//# sourceMappingURL=index.js.map
