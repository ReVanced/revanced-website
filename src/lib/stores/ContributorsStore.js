import { readable } from "svelte/store";

const fetchContributors = async () => {
    const response = await fetch('https://releases.rvcd.win/contributors');
    const json = await response.json();

    let { 0: cli, 1: patcher, 2: patches, 3: integrations, 4: manager } = json.repositories;
    return {cli, patcher, patches, integrations, manager};
};

const ContributorsStore = readable(fetchContributors());
export default ContributorsStore;