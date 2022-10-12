import { readable } from "svelte/store";

const fetchContributors = async () => {
    let cli,
        patcher,
        patches,
        integrations,
        manager;
        
    const response = await fetch('https://releases.rvcd.win/contributors');
    const json = await response.json();

    ({ 0: cli, 1: patcher, 2: patches, 3: integrations, 4: manager } = json.repositories);

    cli = cli.contributors
    patcher = patcher.contributors
    patches = patches.contributors
    integrations = integrations.contributors
    manager = manager.contributors

    return {cli, patcher, patches, integrations, manager};
     
};

const ContributorsStore = readable(fetchContributors());
export default ContributorsStore;