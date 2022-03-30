'use strict';

const $showsList = $('#shows-list');
const $episodesArea = $('#episodes-area');
const $searchForm = $('#search-form');
const $episodesList = $('#episodes-list');
const section = document.querySelector('section');

section.style.display = 'none';
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(showName) {
	// ADD: Remove placeholder & make request to TVMaze search shows API.`
	const ref = await axios.get(`https://api.tvmaze.com/search/shows?q=${showName}`);
	// console.log(ref.data);
	let show = [];
	for (let showArray of ref.data) {
		// console.log(showArray.show);
		show.push(showArray.show); // loop into map
	}
	// console.log(show);
	return show;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
	$showsList.empty();

	// console.log(shows);
	for (let show of shows) {
		let imageToPresent =
			'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300';

		if (show.image !== null) {
			imageToPresent = show.image.medium;
		}
		const $show = $(
			`<div data-show-id="${show.id}" class="show col-md-12 col-lg-6 mb-4">
       <div class="media">
         <img 
            src=${imageToPresent} 
            alt=${show.name}
            class="w-25 mr-3">
         <div class="media-body">
           <h5 class="text-primary">${show.name}</h5>
           <div><small>${show.summary}</small></div>
           <button class=" ${show.id} btn btn-outline-light btn-sm Show-getEpisodes">
             Episodes
           </button>
         </div>
       </div>  
     </div>
    `
		);

		$showsList.append($show);
	}
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
	const showName = $('#search-query').val();
	const shows = await getShowsByTerm(showName);

	// console.log(shows);
	$episodesArea.hide();
	populateShows(shows);

	const $btns = $('.Show-getEpisodes'); // I moved this up from the bottom of the program

	for (let show of shows) {
		let buttons = document.getElementsByClassName(show.id);
		// console.log(show);

		for (let button of buttons) {
			// console.log(button);
			button.addEventListener('click', async function(e) {
				$episodesList.empty();
				section.style.display = 'block';

				let arrayOfEpisodes = await getEpisodesOfShow(show.id);
				console.log(arrayOfEpisodes);
				populateEpisodes(arrayOfEpisodes);
			});
		}
	}

	// $btns.on('click', async function(evt) {
	// 	$episodesList.empty();
	// 	section.style.display = 'block'; // this is for turining off dispaly none

	// 	// console.log(ids);

	// 		for (let btn of btns) {
	// 			let btnId = btn.classList[0];
	// 			// console.log(btnId);
	// 			// console.log(div);
	// 			if (div.classList.contains(div.dataset.showId)) {
	// 				populateEpisodes(arrayOfEpisodes);
	// 			}
	// 		}
	// 		// console.log(div);
	// 		// console.log(div.dataset.showId);
	// 		// console.log(episodes);
	// 	}

	// let arrayOfEpisodes = await getEpisodesOfShow('this need to be the is of the show');
	// populateEpisodes(arrayOfEpisodes);
}

$searchForm.on('submit', async function(evt) {
	evt.preventDefault();
	await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
	const ref = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
	// console.log(ref);

	let episode = [];
	for (let episodeData of ref.data) {
		// console.log(episodeData);
		episode.push(episodeData);
	}
	// console.log(episode);
	return episode; // this returns an ARRAY of the episodes of ID
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
	// currently all episodes, i only need one tv show

	for (let episode of episodes) {
		// console.log(episode.name);
		const $episode = $(`<li> ${episode.name} (season ${episode.season}, number ${episode.number}) </li>`);
		// console.log($episode.innerText);
		$episodesList.append($episode); // this add the LI above to a UL
	}
}

// the problem is the add event listener to the buttons that then add episodes to the bottom of the page.
//  i need each button to pull different information and append it to the bottom of the page.
