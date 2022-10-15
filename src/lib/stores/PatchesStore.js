import { readable } from "svelte/store";

const fetchPatches = async () => {
    const response = await fetch('https://releases.rvcd.win/patches');
    const json = await response.json();
    console.log(typeof json)
    return json;
};

const PatchesStore = readable(fetchPatches());
export default PatchesStore;