export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	if (!("serviceWorker" in navigator)) {
		console.warn("Service workers are not supported in this browser");
		return null;
	}

	try {
		// Wait for the service worker to be ready (VitePWA registers it automatically)
		const registration = await navigator.serviceWorker.ready;
		return registration;
	} catch (error) {
		console.error("Service Worker not ready:", error);
		return null;
	}
}

/**
 * Unregister all service workers
 */
export async function unregisterServiceWorker(): Promise<boolean> {
	if (!("serviceWorker" in navigator)) {
		return false;
	}

	try {
		const registration = await navigator.serviceWorker.getRegistration();
		if (registration) {
			const unregistered = await registration.unregister();
			return unregistered;
		}
		return false;
	} catch (error) {
		console.error("Service Worker unregistration failed:", error);
		return false;
	}
}

/**
 * Check if a service worker is registered
 */
export async function isServiceWorkerRegistered(): Promise<boolean> {
	if (!("serviceWorker" in navigator)) {
		return false;
	}

	const registration = await navigator.serviceWorker.getRegistration();
	return !!registration;
}

/**
 * Get the current service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
	if (!("serviceWorker" in navigator)) {
		return null;
	}

	try {
		const registration = await navigator.serviceWorker.getRegistration();
		return registration || null;
	} catch (error) {
		console.error("Failed to get service worker registration:", error);
		return null;
	}
}
