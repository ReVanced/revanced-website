import { readable } from "svelte/store";

const fetchContributors = async () => {
    const response = await fetch('https://releases.rvcd.win/contributors');
    const json = await response.json();
    return json;
};

const ContributorsStore = readable(fetchContributors());
export default ContributorsStore;