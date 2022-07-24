# react-gdpr-guard

<center><img src="https://github.com/Voltra/react-gdpr-guard/blob/master/react-gdpr-guard.png" alt="Logo" width="250"/></center>


> Official React binding for gdpr-guard

`react-gdpr-guard` acts like a meta-hook library: it exposes a single hook that you can use outside of your React app
to create hooks that you will later use in that react app.

//TODO: Example project

## Before using the library

You must know about the `gdpr-guard` library and how it works.

Here are a few links to get up to speed:
* [Github Repo](https://github.com/Voltra/gdpr-guard)
* [NPM Package](https://www.npmjs.com/package/gdpr-guard)
* [Docs](https://voltra.github.io//gdpr-guard/)

## Setup the library

In a separate file, let's say a `hooks/gdpr.js` for instance, you can create your hooks alongside your `GdprSavior` and manager factory:

```javascript
// src/hooks/gdpr.js

const managerFactory = () => {
	return GdprManagerBuilder.make()
		/* [...] */
		.build();
};
const savior = new MyGdprSavior();

export const {
	useSetupGdprEffect,
	useAttachGdprListenersEffect,
	useGdprManager,
	useGdprSavior,
	useGdpr,
	useGdprComputed,
	useGdprGuard,
	useGdprGuardEnabledState,
} = createGdprGuardHooks(savior, managerFactory);
```

Then, in your main component, you can attach the setup hook and the listeners hook:

```javascript
// src/App.jsx

import {
	useSetupGdprEffect,
	useAttachGdprListenersEffect,
	useGdpr,
} from "./hooks/gdpr.js";

import MyGdprBanner from "./components/MyGdprBanner";
import MyGdprSettingsOpener from "./components/MyGdprSettingsOpener";

export default function App() {
	const {
		bannerWasShown,
		closeGdprBanner,
		resetAndShowBanner,
	} = useGdpr();

	// Bootstrap the library
	useSetupGdprEffect();

	// Attach events
	useAttachGdprListenersEffect(eventHub => {
		eventHub.onEnable("_ga", () => {
			// Load all Analytics scripts here
		});

		eventHub.onDisable("myIntrusive3rdPartyStuff", () => {
			// Disable everything from the intrusive 3rd-party lib
		});
	});

	// The rest of your component logic
	return (
		<>
			<MyGdprSettingsOpener onClick={resetAndShowBanner}/>
			{!bannerWasShown && <MyGdprBanner onClose={closeGdprBanner} />}
			{/* The rest of your component's UI */}
		</>
	);
}
```

## UI/UX component recommendations

Default values must be chosen carefully and with the user's experience in mind.
For instance: if geolocation is optional, disable it by default.

After the user changes their settings, saving them using the Savior API is recommended.

### GDPR settings opener

A tiny button or link that, when clicked, calls the `resetAndShowBanner` so that the GDPR settings UI may be opened again.

### GDPR banner

A banner, a modal or whatever prevents users from using your website without first interacting with it.

It should display at the very least 4 buttons:
* "Accept all" which calls `enableManager` and then `closeBanner`
* "Deny all" which calls `disableManager` and then `closeBanner`
* "Accept current settings" which just calls `closeBanner`
* "Modify settings" which opens your GDPR settings UI

### GDPR settings

Generally a modal (but can be whatever) in which the user has access to the following:
* A switch/checkbox to toggle the whole manager using `toggleManager`
* A link/button to accept all and thus call `enableManager` and then `closeBanner`
* A link/button to deny all and thus call `disableManager` and then `closeBanner`
* A list/tree of groups and guards with ways to toggle them individually
* A button to cancel the modification of settings (which just closes the settings' UI and goes back to the banner)
* A button to save the modifications and thus call `closeBanner`

## The hooks

### createGdprGuardHooks(gdprSavior, gdprManagerFactory)

The meta-hook that creates hooks, based on your manager and savior, that you can use throughout your app.

### useSetupGdprEffect()

`useSetupGdprEffect` is a simple hook that just bootstrap the whole library's core logic.
As such, you must use it (preferably only in one place) within your app. To keep things simple
and organized, you might want to call it within your `App` component.

### useGdprComputed(factory, deps = [])

It behaves exactly like `useMemo` but recomputes its value upon changes within the GDPR manager.

### useGdprSavior()

Gives you direct access to the wrapper around the `GdprSavior` instance you provided. This may not be needed, but is
useful if you need to tap into the lifecycle of your GDPR manager.

### useGdprManager()

Gives you direct access to the wrapper around the `GdprManager` instance that is restored using the provided `GdprSavior`.
It allows you to query and mutate your manager's state directly even though there are different hooks for that exact purpose.

### useAttachGdprListenersEffect(callback)

It allows you to attach events listeners to your manager's `GdprManagerEventHub`.
This is where you'll listen for enable/disable events on particular guards.

### useGdprGuardEnabledState(guardName, useBannerStatus = false)

It allows you to query the enabled state of the guard that has the given `guardName`.
If `useBannerStatus`, and for the enable state to be true, the banner would have to have been shown to the user.

### useGdprGuard(guardName)

It allows you to control a single guard and access its data:

```javascript
const {
	guard, // instance of GdprGuardRaw
	enableGuard, // callback to enable that guard
	disableGuard, // callback to disable that guard
	toggleGuard, // callback to toggle that guard
} = useGdprGuard("My guard's name");
```

Note that this also applies to `GdprGroup`s since they are also `GdprGuard`s.

### useGdpr()

It allows you to do and access a lot of things at once, so let's detail those:

```javascript
const {
	bannerWasShown,
	manager,
	closeGdprBanner,
	resetAndShowBanner,
	enableManager,
	disableManager,
	toggleManager,
	enableGuard,
	disableGuard,
	toggleGuard,
	guardIsEnabled,
	enableForStorage,
	disableForStorage,
	toggleForStorage,
} = useGdpr();
```

#### bannerWasShown

Direct access to whether the GDPR banner has been shown or not (useful for conditional rendering of the banner itself).

#### manager

Direct access to the current state of the manager as a `GdprManagerRaw` instance.
Useful to manually query the state or help build the UI.

#### closeGdprBanner()

When called will close the GDPR banner and call the appropriate event listeners.

#### resetAndShowBanner()

When called will reset the shown status of the GDPR banner.

#### enableManager()

When called will enable every guard within the manager (except required ones).
Useful for the "Accept All" button of the GDPR banner.

#### disableManager()

When called will disable every guard within the manager (except required ones).
Useful for the "Reject All" button of the GDPR banner.

#### toggleManager()

Toggle the enabled/disabled state of the manager and sets every guard to that state.
Useful to have a global switch on the GDPR settings UI.

#### enableGuard(guardName)

Enable the guard that has the given name.
Also works for groups of guards.
Can be useful when building the GDPR settings UI.

#### disableGuard(guardName)

Disable the guard that has the given name.
Also works for groups of guards.
Can be useful when building the GDPR settings UI.

#### toggleGuard(guardName)

Toggle the guard that has the given name.
Also works for groups of guards.
Can be useful when building the GDPR settings UI.

#### guardIsEnabled(guardName, useBannerStatus = false)

Query the enabled state of the given guard. When using the banner status,
the guard can only be considered if the banner has already been shown.

#### enableForStorage(storage)

Enable guards that are stored in the given `GdprStorage`.
Can be useful when building the GDPR settings UI.

#### disableForStorage(storage)

Disable guards that are stored in the given `GdprStorage`.
Can be useful when building the GDPR settings UI.

#### toggleForStorage(storage)

Toggle guards that are stored in the given `GdprStorage`.
Can be useful when building the GDPR settings UI.

## CHANGELOG

### v1.0.2

Add manager hotswap on boot

### v1.0.1 ***(broken do not use)***

Fix library build

### v1.0.0 ***(broken do not use)***

Initial release
