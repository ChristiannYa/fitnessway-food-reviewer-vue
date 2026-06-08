import * as UAParser from "ua-parser-js";

export function useDeviceInfo() {
	const parser = new UAParser.UAParser(navigator.userAgent);
	const result = parser.getResult();

	const deviceBrand = result.device.vendor ?? "Unknown Brand";
	const deviceModel = result.device.model ?? "Unknown Model";
	const browser = result.browser.name ?? "Unknown Browser";
	const os = result.os.name ?? "Unknown OS";

	const deviceType = result.device.type
		? result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1)
		: "Web";

	const deviceName = deviceBrand !== "Unknown Brand"
		? `${deviceBrand} ${deviceModel} (${deviceType})`
		: `${os} ${browser} (${deviceType})`;

	return {
		deviceName,
		deviceBrand,
		deviceModel,
		browser,
		os,
		deviceType
	};
};
