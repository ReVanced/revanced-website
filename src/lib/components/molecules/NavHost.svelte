<script lang="ts">
	import Navigation from '../atoms/NavButton.svelte';
	import { page } from '$app/stores';
	import Button from '../atoms/Button.svelte';
  import MobileDropdown from './MobileDropdown.svelte';
  import { onMount } from 'svelte';
  import RouterEvents from '../../../data/RouterEvents';

	let menuOpen = false;

  onMount(() => {
    return RouterEvents.subscribe(event => {
      if (event.navigating) {
        menuOpen = false;
      }
    });
  });
</script>

<nav>
  <div class="navbar">
	  <div class="left-side">
		  <a href="/">
			  <span class="logo">
				  <img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			  </span>
		  </a>

		  <span class="desktop">
			  <Navigation href="/">Home</Navigation>
			  <Navigation href="/download">Download</Navigation>
        <div hidden>
          <!-- This is just temporary so the build doesn't fail -->
			    <Navigation is_selected={target => target.startsWith("/docs")} href="/docs">Docs</Navigation>
        </div>
			  <Navigation href="/patches">Patches</Navigation>
		  </span>
	  </div>

    <div class="right-side">
	    <span class="desktop">
		    <Navigation href="/contributors/">
			    <img src="/icons/contrib.svg" alt="Contributors"/>
		    </Navigation>
		    <Navigation href="/api-settings/">
			    <img src="/icons/settings.svg" alt="Settings"/>
		    </Navigation>
	    </span>

      <!-- Should probably be moved to its own component. -->
	    <button class="menu-btn mobile" class:open={menuOpen} on:click={() => {menuOpen = !menuOpen}}>
		    <span class="menu-btn__burger" />
	    </button>
    </div>
  </div>

  <div class="mobile">
    {#if menuOpen}
      <MobileDropdown>
        <div class="mobile-menu">
		      <Navigation href="/">Home</Navigation>
		      <Navigation href="/download">Download</Navigation>
		      <Navigation href="/patches">Patches</Navigation>
		      <Navigation href="/contributors">Contributors</Navigation>
		      <Navigation href="/api-settings">Settings</Navigation>
        </div>
      </MobileDropdown>
    {/if}
  </div>
</nav>

<style>
  nav {
    position: fixed;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .navbar {
	  padding: 0 1rem 0 2rem;

	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  min-height: 70px;
	  width: 100%;
	  z-index: 999;
	  background-color: var(--grey-six);
	  backdrop-filter: blur(15px);
	  -webkit-backdrop-filter: blur(15px);
  }

	.desktop {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

  .mobile-menu {
    display: block;
    width: 80vw;
    height: 100vh;
    white-space: pre;
    margin: 0 auto;
    padding: 1ch 0;
  }

	a {
		text-decoration: none;
	}

	.logo-image {
		height: 1.75rem;
		width: auto;
		cursor: pointer;
	}

	.logo {
		display: flex;
		align-items: center;
	}

	.left-side {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2.5rem;
	}


	img {
		height: 20px;
	}

	@media screen and (max-width: 600px) {
		.desktop {
			display: none;
		}
	}

	/* Hamburger mmm yum */
	@media screen and (min-width: 600px) {
		.mobile {
			display: none !important;
		}
	}
	.menu-btn {
		user-select: none;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 60px;
		cursor: pointer;
		transition: all 0.5s var(--bezier-one);

    /* We don't want it to look like a normal button. */
    background-color: transparent;
    border: none;
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    line-height: inherit;
    padding: 0;
	}
	.menu-btn__burger {
		width: 25px;
		height: 2px;
		border-radius: 50px;
		background: var(--grey-five);
		transition: all 0.5s var(--bezier-one);

    display: flex;
    flex-wrap: wrap;
	}
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
		width: 25px;
		height: 2px;
		border-radius: 50px;
		background: var(--grey-five);
		transition: all 0.5s var(--bezier-one);
	}
	.menu-btn__burger::before {
		transform: translateY(-8px);
	}
	.menu-btn__burger::after {
		transform: translateY(8px);
	}
	/* ANIMATION */
	.menu-btn.open .menu-btn__burger {
		transform: translateX(-20px);
		background: transparent;
		box-shadow: none;
	}
	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(15px, -15px);
	}
	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(15px, 15px);
	}
</style>
