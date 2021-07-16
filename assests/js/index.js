window.onload = () => {
	const form = document.querySelector(".form");
	const urlInput = document.querySelector("#urlInput");

	const downloadingPage = document.querySelector(".download-window");
	const closeBtn = downloadingPage.querySelector(".closeBtn");
	const loading = document.querySelector(".loading");

	const host = window.location.origin;

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		loading.classList.add("active");
		fetch(`${origin}/getVideo?url=${urlInput.value}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				const thumbnail = document.querySelector(
					".videoInfo .thumbnail img"
				);
				const title = document.querySelector(".videoInfo .data h3");
				const desc = document.querySelector(".videoInfo .data p");
				const videoURL = document.getElementById("videoUrl");

				const downloadOptions = document.querySelector(
					".download-video .downloading-options"
				);
				try {
					let html = "";
					for (let i = 0; i < data.formats.length; i++) {
						if (
							data.formats[i].audioCodec == null ||
							data.formats[i].qualityLabel == null
						) {
							continue;
						}
						html += `
						<option value="${data.formats[i].itag}|${data.formats[i].container}">
							${data.formats[i].container} - ${data.formats[i].qualityLabel}
						</option>
					`;
						thumbnail.src =
							data.videoDetails.thumbnails[
								data.videoDetails.thumbnails.length - 1
							].url; // get HD thumbnail img
						title.innerText = data.videoDetails.title;
						desc.innerText = data.videoDetails.description;

						videoURL.value = urlInput.value;
						downloadOptions.innerHTML = html;
						loading.classList.remove("active");

						downloadingPage.classList.add("active");
					}
				} catch (err) {
					console.log(err);
				}
			})
			.catch((err) => alert("something went wrong!"));
	});

	closeBtn.addEventListener("click", (e) => {
		downloadingPage.classList.remove("active");
	});

	document.querySelector(".download-btn").addEventListener("click", () => {
		const videoURL = document.getElementById("videoUrl");
		const downloadOptions = document
			.querySelector(".download-video .downloading-options")
			.value.split("|");
		let itag = downloadOptions[0];
		let format = downloadOptions[1];

		window.open(
			host +
				"/downloadVideo?videoURL=" +
				videoURL.value +
				"&itag=" +
				itag +
				"&format=" +
				format
		);
	});
};
