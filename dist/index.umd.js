!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports,require("gdpr-guard"),require("react")):"function"==typeof define&&define.amd?define(["exports","gdpr-guard","react"],r):r((e=e||self).reactGdprGuard={},e.gdprGuard,e.react)}(this,function(e,r,t){function n(e,r){return(n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e})(e,r)}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var a=function(){function e(e){this._manager=e,this.state=this.generateRawManager()}var r,t,n=e.prototype;return n.triggerUpdate=function(){this.state=this.generateRawManager()},n.closeBanner=function(){this.manager.closeBanner(),this.triggerUpdate()},n.resetAndShowBanner=function(){this.manager.resetAndShowBanner(),this.triggerUpdate()},n.json=function(){return this.materializedState},n.toString=function(){return JSON.stringify(this.materializedState)},n.disable=function(e){return this.wrap("disable",e)},n.enable=function(e){return this.wrap("enable",e)},n.toggle=function(e){return this.wrap("toggle",e)},n.disableForStorage=function(e){return this.manager.disableForStorage(e),this},n.enableForStorage=function(e){return this.manager.enableForStorage(e),this},n.toggleForStorage=function(e){return this.manager.toggleForStorage(e),this},n.isEnabled=function(e){return this.manager.isEnabled(e)},n.hasGroup=function(e){return this.manager.hasGroup(e)},n.hasGuard=function(e){return this.manager.hasGuard(e)},n.getGroup=function(e){return this.manager.getGroup(e)},n.getGuard=function(e){return this.manager.getGuard(e)},n.generateRawManager=function(){return this.manager.raw()},n.hotswap=function(e){return this._manager=e,this.triggerUpdate(),this},n.wrap=function(e,r){for(var t=arguments.length,n=new Array(t>2?t-2:0),a=2;a<t;a++)n[a-2]=arguments[a];var o;if(void 0===r&&"function"==typeof this.manager[e])(o=this.manager)[e].apply(o,n),this.triggerUpdate();else if(this.manager.hasGuard(r)){var i=this.manager.getGuard(r);"function"==typeof(null==i?void 0:i[e])&&(null==i||i[e].apply(i,n),this.triggerUpdate())}return this},r=e,(t=[{key:"manager",get:function(){return this._manager}},{key:"materializedState",get:function(){return this.state}},{key:"bannerWasShown",get:function(){return this.manager.bannerWasShown}},{key:"events",get:function(){return this.manager.events}}])&&function(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(r.prototype,t),Object.defineProperty(r,"prototype",{writable:!1}),e}(),o=function(e){var r,t;function a(r,t){var n;return(n=e.call(this)||this).savior=r,n.managerWrapper=t,n}t=e,(r=a).prototype=Object.create(t.prototype),r.prototype.constructor=r,n(r,t);var o=a.prototype;return o.updateSharedManager=function(e){try{var r=this;return r.managerWrapper.manager===e?Promise.resolve():Promise.resolve(r.savior.updateSharedManager(e)).then(function(){r.managerWrapper.hotswap(e)})}catch(e){return Promise.reject(e)}},o.check=function(){return this.savior.check()},o.exists=function(e){return void 0===e&&(e=!0),this.savior.exists(e)},o.restore=function(e){return void 0===e&&(e=!0),this.savior.restore(e)},o.restoreOrCreate=function(e){return this.savior.restoreOrCreate(e)},o.store=function(e){return this.savior.store(e)},a}(r.GdprSaviorAdapter),i=function(e,r){return void 0===r&&(r=[]),t.useCallback(e,r)};e.createGdprGuardHooks=function(e,n){var u=r.GdprManager.create([]),s=new a(u),c=new o(e,s),f=function(){return s},g=function(){return f().manager},d=function(e,r){void 0===r&&(r=[]);var n=f(),a=i(e,r);return t.useMemo(a,[n.materializedState,a])};return{useSetupGdprEffect:function(e){void 0===e&&(e=function(e){});var r=f(),a=g();!function(e,r){void 0===r&&(r=[]);var n=t.useRef(!1);t.useEffect(function(){n.current?e():n.current=!0},[].concat(r,[e,n]))}(i(function(){!function(){try{var t=function(e,t){try{var a=Promise.resolve(c.restoreOrCreate(n)).then(function(e){r.hotswap(e)})}catch(e){return t(e)}return a&&a.then?a.then(void 0,t):a}(0,function(r){e(r)});t&&t.then&&t.then(function(){})}catch(e){Promise.reject(e)}}()},[r])),t.useEffect(function(){r.bannerWasShown&&r.closeBanner()},[a])},useAttachGdprListenersEffect:function(e){var r=g();t.useEffect(function(){e(r.events)},[e,r])},useGdprSavior:function(){return c},useGdprManager:f,useGdprComputed:d,useGdprGuardEnabledState:function(e,r){return void 0===r&&(r=!1),d(function(){var t,n;return(!r||s.bannerWasShown)&&null!=(t=null===(n=s.getGuard(e))||void 0===n?void 0:n.enabled)&&t},[e,s.bannerWasShown])},useGdprGuard:function(e){var r=f();return{guard:d(function(){var t;return null===(t=r.getGuard(e))||void 0===t?void 0:t.raw()},[e,r]),enableGuard:i(function(){r.enable(e)},[e,r]),disableGuard:i(function(){r.disable(e)},[e,r]),toggleGuard:i(function(){r.toggle(e)},[e,r])}},useGdpr:function(){var e=f(),r=d(function(){return e.materializedState},[e,e.materializedState]),t=i(function(){e.enable()},[e]),n=i(function(){e.disable()},[e]),a=i(function(){e.toggle()},[e]),o=i(function(r){e.enable(r)},[e]),u=i(function(r){e.disable(r)},[e]),s=i(function(r){e.toggle(r)},[e]),c=i(function(r,t){return void 0===t&&(t=!1),(!t||e.bannerWasShown)&&e.isEnabled(r)},[e]),g=i(function(r){e.enableForStorage(r)},[e]),l=i(function(r){e.disableForStorage(r)},[e]),h=i(function(r){e.toggleForStorage(r)},[e]);return{closeGdprBanner:i(function(){return e.closeBanner()},[e]),resetAndShowBanner:i(function(){return e.resetAndShowBanner()},[e]),bannerWasShown:d(function(){return e.bannerWasShown},[e]),manager:r,enableManager:t,disableManager:n,toggleManager:a,enableGuard:o,disableGuard:u,toggleGuard:s,guardIsEnabled:c,enableForStorage:g,disableForStorage:l,toggleForStorage:h}}}}});
//# sourceMappingURL=index.umd.js.map
