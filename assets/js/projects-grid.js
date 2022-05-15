// simple ajax-like get request for repos on my account
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.github.com/users/lilykiwi/repos");
xhr.onload = function () {
  if (xhr.status === 200) {
    let response = JSON.parse(xhr.responseText);
    // display the repos using the function below
    displayData(response);
  } else {
    console.error("couldn't fetch repos! status error: " + xhr.status);
    document.getElementById("card-area").innerHTML = `
    <div class="w-100 p-5 text-center text-light">
    <h2>failed to load repos!</h2>
    <a href="https://github.com/lilykiwi/lilykiwi.github.io/issues">please open an issue</a>
  </div>`;
  }
};
xhr.send();

function displayData(response) {
  // clear existing target area
  document.getElementById("card-area").innerHTML = "";

  // state data for repos we know about
  const heldStates = [
    { name: "archive", image: true },
    { name: "countdown-applet", image: true },
    {
      name: "FaceFillers-Electron",
      image: true,
    },
    { name: "lily-dotfiles", image: true },
    {
      name: "recipe-book-core",
      image: true,
    },
    {
      name: "lilykiwi.github.io",
      image: true,
    },
    {
      name: "y1-410A2-UnityProject",
      image: true,
    },
    { name: "y1-csg-uni", image: false },
    { name: "y2-csg-uni", image: false },
  ];

  // iterate over each repo in the json response. see api.github.com docs.
  response.forEach((element) => {
    let repoLink = element.html_url;
    let name = element.name;
    let description = element.description;

    let license = "No License";
    if (element.license != null) {
      license = element.license.name;
    }

    // get rid of my tiny and near-pointless github description repo
    if (name === "lilykiwi" || name === "CI536-group-project") {
      return;
    }

    /* we actually have some repo images saved on the host! github have
     *  yet to implement a way to fetch the social slide for a repo, even
     *  though repos can have images. the API just doesn't support it, for
     *  some reason. instead, i'm hosting them here and matching them.
     */
    let imageSrc = `placeholder.png`;

    // TODO: Replace this with a match statement
    // Grabs the image for the repo (if we have it in /image/*)
    heldStates.some((e) => {
      if (e.name == name && e.image) {
        imageSrc = `${name}.png`;
      }
    });

    // Gets rid of the ugly "null" language item if there's no code yet
    if (element.language == null) {
      language = "";
    } else {
      language = element.language;
    }

    // get the amount of issues, and enable the badge if there's more than 0
    let issueBadge = false;
    let issueCount = element.open_issues_count;
    if (issueCount > 0) {
      issueBadge = true;
    }

    //todo: reimplement issue badge and language badge

    let card = document.createElement("a");
    card.className = "repoCard";
    card.href = repoLink;
    card.innerHTML = `<img src="assets/images/${imageSrc}">`

    // insert all found repos using this html prefab
    document.getElementById("card-area").appendChild(card);
  });
}
