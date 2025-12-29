import type { Patch, CompatiblePackage } from './types';

export function getCompatiblePackagesAsArray(patch: Patch): CompatiblePackage[] | null {
	if (!patch.compatiblePackages) return null;
	return Object.entries(patch.compatiblePackages).map(([name, versions]) => ({
		name,
		versions
	}));
}

export function getPatchPackageNames(patch: Patch): string[] {
	if (!patch.compatiblePackages) return [];
	return Object.keys(patch.compatiblePackages);
}
