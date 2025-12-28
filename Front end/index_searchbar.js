



//Open the search overlay screen
document.getElementById('searchBox').addEventListener('click', () => {
    document.getElementById('searchOverlay').style.display = 'block';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.getElementById('overlayInputOverlay').focus();
});
//Closing overlay reset everything to default
function resetOverlay() {
    // Restore all nodes below search button
    const buttonContainer = searchButton.parentElement; // div.search-buttons
    let sibling = buttonContainer.nextElementSibling;
    while (sibling) {
        sibling.style.removeProperty('display');
        sibling = sibling.nextElementSibling;
    }

    // Clear search tag container
    searchTagContainer.innerHTML = '';

    // Re-enable interactive elements
    overlayInput.disabled = false;
    advancedToggle.disabled = false;
    methodTags.style.pointerEvents = '';
    difficultyTags.style.pointerEvents = '';
    problemTags.style.pointerEvents = '';

    // Reset button text
    searchButton.textContent = "SEARCH";
    methodTags.classList.remove('show');
    advancedToggle.checked = false;
    // Reset toggle state
    searchToggled = false;
}
//Close the overlay search screen
document.getElementById('closeOverlay').addEventListener('click', () => {
    let resultsContainer = document.getElementById('searchResultsContainer');
    if(resultsContainer) {resultsContainer.innerHTML = ''}
    document.getElementById('searchOverlay').style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    resetOverlay()
});


const advancedToggle = document.getElementById('advancedToggle');
const methodTags = document.querySelector('.method-tags');
//Turn off and on option to show or hide mathod tags
advancedToggle.addEventListener('change', () => {
    if(advancedToggle.checked){
        methodTags.classList.add('show');
    } else {
        methodTags.classList.remove('show');
    }
});

//Make tags clickable and add to u know
const allTags = document.querySelectorAll(
  '.difficulty-tag, .problem-tag, .method-tag'
);

// Make each tag clickable
allTags.forEach(tag => {
  tag.style.cursor = 'pointer'; // optional: indicate clickable
  tag.addEventListener('click', () => {
    const tagText = tag.textContent.trim();
    renderTagByText(tagText);
  });
}); 



const overlayInput = document.getElementById("overlayInputOverlay");
const suggestionDropdown = document.getElementById("suggestionDropdown");

// Grab your tag groups
const tagGroups = [
    document.querySelectorAll('.difficulty-tags .difficulty-tag'),
    document.querySelectorAll('.problem-tags .problem-tag'),
    document.querySelectorAll('.method-tags .method-tag')
];

// Helper: get all tags for search based on toggle
function getTagsForSearch() {
    const difficultyTags = Array.from(tagGroups[0]).map(el => el.textContent.trim());
    const problemTags = Array.from(tagGroups[1]).map(el => el.textContent.trim());
    const methodTags = Array.from(tagGroups[2]).map(el => el.textContent.trim());

    return advancedToggle.checked 
        ? [...difficultyTags, ...problemTags, ...methodTags] 
        : [...difficultyTags, ...problemTags];
}

// Filter input and render suggestions
function updateSuggestions(inputText) {
    suggestionDropdown.innerHTML = ""; // clear previous suggestions
    const textLower = inputText.trim().toLowerCase();
    if (!textLower) return;

    const allTags = getTagsForSearch();

    // Only include tags that **start with the input** (case-insensitive)
    const filteredTags = allTags.filter(tag => tag.toLowerCase().startsWith(textLower));

    filteredTags.forEach(tagText => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.textContent = tagText;

        div.addEventListener("click", () => {
            renderTagByText(tagText);      // render the full tag block
            overlayInput.value = "";        // clear input
            suggestionDropdown.innerHTML = ""; // hide suggestions
        });

        suggestionDropdown.appendChild(div);
    });
}


// Event listener: input typing
overlayInput.addEventListener("input", e => updateSuggestions(e.target.value));

// Update suggestions if advancedToggle changes
advancedToggle.addEventListener("change", () => updateSuggestions(overlayInput.value));

// Optional: hide suggestions if input loses focus
overlayInput.addEventListener("blur", () => setTimeout(() => suggestionDropdown.innerHTML = "", 100));

//Check when user enter a tag then press enter
overlayInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const inputText = overlayInput.value.trim().toLowerCase();
        if (!inputText) return;

        const visibleSuggestions = Array.from(suggestionDropdown.children)
            .map(div => div.textContent.trim());

        const matchedTag = visibleSuggestions.find(tag => tag.toLowerCase() === inputText);

        if (matchedTag) {
            renderTagByText(matchedTag);
            overlayInput.value = "";
            suggestionDropdown.innerHTML = "";
        }
        // else: do nothing
    }
});

//take input as a text, found the tag with corresponding text, and render it under the search bar, exact as how it look underneath
function renderTagByText(tagText) {
    // Do nothing if already exists
    if (Array.from(searchTagContainer.children).some(wrapper => {
        const span = wrapper.querySelector('span');
        return span && span.textContent.trim() === tagText.trim();
    })) return;

  const searchText = tagText.trim().toLowerCase();

  const tagGroups = [
    document.querySelectorAll('.difficulty-tags .difficulty-tag'),
    document.querySelectorAll('.problem-tags .problem-tag'),
    document.querySelectorAll('.method-tags .method-tag')
  ];

  let foundTag = null;

  for (const group of tagGroups) {
    for (const tag of group) {
      if (tag.textContent.trim().toLowerCase() === searchText) {
        foundTag = tag.cloneNode(true);
        break;
      }
    }
    if (foundTag) break;
  }

  const container = document.querySelector('.search_tag-container');

  if (foundTag) {

    // Wrapper to align tag and X button side by side
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.margin = '4px';

    // Style adjustments for cloned tag
    foundTag.style.cursor = 'default'; // not clickable now
    foundTag.style.userSelect = 'none';

    // Create transparent X button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.style.background = 'transparent';
    removeBtn.style.border = 'none';
    removeBtn.style.color = 'white';
    removeBtn.style.fontWeight = 'bold';
    removeBtn.style.fontSize = '0.9rem';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.height = foundTag.offsetHeight ? `${foundTag.offsetHeight}px` : '26px';
    removeBtn.style.aspectRatio = '1 / 1';
    removeBtn.style.display = 'flex';
    removeBtn.style.alignItems = 'center';
    removeBtn.style.justifyContent = 'center';
    removeBtn.style.borderRadius = '50%';
    removeBtn.style.opacity = '0.6';
    removeBtn.style.transition = 'all 0.2s ease';
    
    removeBtn.addEventListener('mouseenter', () => {
      removeBtn.style.opacity = '1';
      removeBtn.style.background = 'rgba(255,255,255,0.1)';
    });
    removeBtn.addEventListener('mouseleave', () => {
      removeBtn.style.opacity = '0.6';
      removeBtn.style.background = 'transparent';
    });

    // Remove on click
    removeBtn.addEventListener('click', () => {
      wrapper.remove();
    });

    // Assemble
    wrapper.appendChild(foundTag);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
  } 
  //no tag  founded, i don't think most tag do this so
  else {
    console.warn(`Tag "${tagText}" not found.`);
  }
}

//User enters all the tags and proceed to search
const searchButton = document.getElementById('searchButton');
const overlayContent = document.querySelector('.overlay-content');
const searchTagContainer = document.querySelector('.search_tag-container');
const difficultyTags = document.querySelector('.difficulty-tags');
const problemTags = document.querySelector('.problem-tags');

let searchToggled = false;  // tracks toggle state

searchButton.addEventListener('click', () => {
    
    
  if (!searchToggled) {
    if (!searchTagContainer.hasChildNodes()) {
    // Save original text and disable button
    const originalText = searchButton.textContent;
    searchButton.disabled = true;

    searchButton.style.opacity = "0.6";
    searchButton.style.cursor = "not-allowed";

    // Animated warning messages
    let dots = 0;
    searchButton.textContent = "Please enter problems' tags";

    const interval = setInterval(() => {
        dots = (dots + 1) % 4; // cycles 0→1→2→3→0
        searchButton.textContent = "Please enter problems' tags" + ".".repeat(dots);
    }, 500);

    // Revert after 2 seconds
    setTimeout(() => {
        clearInterval(interval);
        searchButton.textContent = originalText;
        searchButton.disabled = false;
        searchButton.style.opacity = "1";
        searchButton.style.cursor = "pointer";
    }, 2000);

    return; // stop further actions
    }
    // First click → visually hide but keep layout stable
const buttonContainer = searchButton.parentElement;
let sibling = buttonContainer.nextElementSibling;
while (sibling) {
  sibling.style.visibility = 'hidden';
  sibling.style.height = '0';
  sibling.style.overflow = 'hidden';
  sibling = sibling.nextElementSibling;
}



    // Disable all interactive elements above search button except document.getElementById('closeOverlay')
    overlayInput.disabled = true;
    advancedToggle.disabled = true;
    methodTags.style.pointerEvents = 'none';
    difficultyTags.style.pointerEvents = 'none';
    problemTags.style.pointerEvents = 'none';
    document.getElementById('closeOverlay').disabled = true;

    // Update button text
    searchButton.textContent = "Search for another tags?";

    searchToggled = true;


        // Load problems with corresponding tags
let resultsContainer = document.getElementById('searchResultsContainer');

  resultsContainer = document.createElement('div');
  resultsContainer.id = 'searchResultsContainer';
  resultsContainer.className = 'search-results';

  // Insert it just after the search button
  buttonContainer.insertAdjacentElement('afterend', resultsContainer);


// Clear previous content
resultsContainer.innerHTML = '';

 function generateProblemsFromTags(problems_Json) {
    const selectedTags = Array.from(searchTagContainer.children).map(
        wrapper => wrapper.firstChild.textContent.trim()
    );
    if(advancedToggle.checked){ //if user choose to include method tag
        const matchingProblems = problems_Json.filter(problem => {
            const allTags = [
                problem.difficulty,
                ...(problem.problemTags || []),
                ...(problem.methodTags || [])
            ];
            return selectedTags.every(tag => allTags.includes(tag));
        });
        // Group problems by section_display_name
    const sectionsMap = {};
    matchingProblems.forEach(problem => {
        if (!sectionsMap[problem.section_display_name]) sectionsMap[problem.section_display_name] = [];
        sectionsMap[problem.section_display_name].push(problem);
    });
    const numberof_Problems = document.createElement('div');
    const problemCount = matchingProblems.length;
    numberof_Problems.className = "container";
    numberof_Problems.innerHTML = `<h1>Number of problems with matching tags: ${problemCount}</h1>`;
    resultsContainer.appendChild(numberof_Problems);
    for (const sectionName in sectionsMap) {
        const problems = sectionsMap[sectionName];
        const sectionContainer = document.createElement('div');
        sectionContainer.className = 'title-container';
        const sectionTitle = document.createElement('h1');
        sectionTitle.textContent = problems[0].section_display_name;
        sectionContainer.appendChild(sectionTitle)
        problems.forEach(problem => {
            const box = document.createElement('div');
            box.className = 'problem-box';

            const problemName = document.createElement('div');
            problemName.className = 'problem-title';
            problemName.textContent = problem.problem_name;
            box.appendChild(problemName);

            const problemLink = document.createElement('div');
            problemLink.className = 'redirect-problem';
            problemLink.textContent = 'Click here to view the full problem';
// when clicked, open the target page
problemLink.addEventListener('click', () => {
    const url = `${problem.section_html}#${problem.id}`;
    const newTab = window.open(url, '_blank');


    if (newTab) {
        newTab.onload = () => {
            // wait a moment for dynamically loaded problems to render
            newTab.setTimeout(() => {
                const id = newTab.location.hash.substring(1);
                const target = newTab.document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1000); // adjust 1000ms if your rendering takes longer/shorter
        };
    }
});

            box.appendChild(problemLink);


            function getDifficultyClass(difficulty) {
                switch (difficulty.toLowerCase()) {
                    case 'very easy': return 'generate-difficulty-tag very_easy';
                    case 'easy': return 'generate-difficulty-tag easy';
                    case 'moderate': return 'generate-difficulty-tag moderate';
                    case 'hard': return 'generate-difficulty-tag hard';
                    case 'very hard': return 'generate-difficulty-tag very';
                    case 'extremely hard': return 'generate-difficulty-tag extreme';
                    case 'non-synthetic geometry': return 'generate-difficulty-tag misc';
                }
            }
            const problemDifficulty = document.createElement('div');
            problemDifficulty.className = getDifficultyClass(problem.difficulty);
            problemDifficulty.textContent = problem.difficulty;
            box.appendChild(problemDifficulty);

            const problemTagsDiv = document.createElement("div");
            problemTagsDiv.className = "generate-problem-tags";            
            problem.problemTags.forEach(tag => {
                const span = document.createElement("span");
                span.className = "tag";
                span.textContent = tag;
                problemTagsDiv.appendChild(span);
            });
            box.appendChild(problemTagsDiv);

            
            const methodTagsDiv = document.createElement("div");
            methodTagsDiv.className = "generate-method-tags";       
            methodTagsDiv.style.display = 'flex'     
            problem.methodTags.forEach(tag => {
                const span = document.createElement("span");
                span.className = "tag";
                span.textContent = tag;
                methodTagsDiv.appendChild(span);
            });
            box.appendChild(methodTagsDiv);

            //problem content
            const problemContent = document.createElement("div");
            problemContent.className = "problem-content"; 
            const problemImage = document.createElement("div");
            problemImage.className = 'problem-image';
            fetch(problem.section_html)
            .then(response => response.text())
            .then(html => {
                // Parse the fetched HTML into a DOM
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                // Find the div with the matching id
                const problemBox = doc.getElementById(problem.id);
                const contentDiv = problemBox.querySelector(".problem-content");
                const imgElement = problemBox.querySelector("img.problem-image");
                  const imgClone = imgElement.cloneNode(true);
                  problemImage.appendChild(imgClone);
                let contentText = contentDiv.textContent.trim();
                contentText = contentText.replace("Try It Yourself", "");
                problemContent.innerHTML = contentText;
                 if (window.MathJax) {
      MathJax.typesetPromise([problemContent]);
    }
          })
          box.appendChild(problemContent);
          box.appendChild(problemImage)
        sectionContainer.appendChild(box);

    });

    resultsContainer.appendChild(sectionContainer);
  } 

}
    else{
        const matchingProblems = problems_Json.filter(problem => {
            const allTags = [
                problem.difficulty,
                ...(problem.problemTags || []),
                ...(problem.methodTags || [])
            ];
            return selectedTags.every(tag => allTags.includes(tag));
        });
        // Group problems by section_display_name
    const sectionsMap = {};
    matchingProblems.forEach(problem => {
        if (!sectionsMap[problem.section_display_name]) sectionsMap[problem.section_display_name] = [];
        sectionsMap[problem.section_display_name].push(problem);
    });
        const numberof_Problems = document.createElement('div');
    const problemCount = matchingProblems.length;
    numberof_Problems.className = "container";
    numberof_Problems.innerHTML = `<h1>Number of problems with matching tags: ${problemCount}</h1>`;
    resultsContainer.appendChild(numberof_Problems);
    for (const sectionName in sectionsMap) {
        const problems = sectionsMap[sectionName];
        const sectionContainer = document.createElement('div');
        sectionContainer.className = 'title-container';
        const sectionTitle = document.createElement('h1');
        sectionTitle.textContent = problems[0].section_display_name;
        sectionContainer.appendChild(sectionTitle)
        problems.forEach(problem => {
            const box = document.createElement('div');
            box.className = 'problem-box';

            const problemName = document.createElement('div');
            problemName.className = 'problem-title';
            problemName.textContent = problem.problem_name;
            box.appendChild(problemName);

            const problemLink = document.createElement('div');
            problemLink.className = 'redirect-problem';
            problemLink.textContent = 'Click here to view the full problem';
// when clicked, open the target page
problemLink.addEventListener('click', () => {
    const url = `${problem.section_html}#${problem.id}`;
    const newTab = window.open(url, '_blank');

    if (newTab) {
        newTab.onload = () => {
            // wait a moment for dynamically loaded problems to render
            newTab.setTimeout(() => {
                const id = newTab.location.hash.substring(1);
                const target = newTab.document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1000); // adjust 1000ms if your rendering takes longer/shorter
        };
    }
});

            box.appendChild(problemLink);


            function getDifficultyClass(difficulty) {
                switch (difficulty.toLowerCase()) {
                    case 'very easy': return 'generate-difficulty-tag very_easy';
                    case 'easy': return 'generate-difficulty-tag easy';
                    case 'moderate': return 'generate-difficulty-tag moderate';
                    case 'hard': return 'generate-difficulty-tag hard';
                    case 'very hard': return 'generate-difficulty-tag very';
                    case 'extremely hard': return 'generate-difficulty-tag extreme';
                    case 'non-synthetic geometry': return 'generate-difficulty-tag misc';
                }
            }
            const problemDifficulty = document.createElement('div');
            problemDifficulty.className = getDifficultyClass(problem.difficulty);
            problemDifficulty.textContent = problem.difficulty;
            box.appendChild(problemDifficulty);

            const problemTagsDiv = document.createElement("div");
            problemTagsDiv.className = "generate-problem-tags";            
            problem.problemTags.forEach(tag => {
                const span = document.createElement("span");
                span.className = "tag";
                span.textContent = tag;
                problemTagsDiv.appendChild(span);
            });
            box.appendChild(problemTagsDiv);


            //problem content
            const problemContent = document.createElement("div");
            problemContent.className = "problem-content"; 
            const problemImage = document.createElement("div");
            problemImage.className = 'problem-image';
            fetch(problem.section_html)
            .then(response => response.text())
            .then(html => {
                // Parse the fetched HTML into a DOM
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                // Find the div with the matching id
                const problemBox = doc.getElementById(problem.id);
                const contentDiv = problemBox.querySelector(".problem-content");
                const imgElement = problemBox.querySelector("img.problem-image");
                  const imgClone = imgElement.cloneNode(true);
                  problemImage.appendChild(imgClone);
                let contentText = contentDiv.textContent.trim();
                contentText = contentText.replace("Try It Yourself", "");
                problemContent.innerHTML = contentText;
                 if (window.MathJax) {
      MathJax.typesetPromise([problemContent]);
    }
          })
          box.appendChild(problemContent);
          box.appendChild(problemImage)
        sectionContainer.appendChild(box);


    });

    resultsContainer.appendChild(sectionContainer)
  } 


        
    }


}
fetch('problems_set.json')
  .then(response => response.json())
  .then(problemsData => {
      // problemsData is now an array of all problem objects
      generateProblemsFromTags(problemsData);
  })



}
  else {  

    // Second click → restore everything

    const tagContainer = document.querySelector('.tag-container');
const searchButtons = document.querySelector('.search-buttons');
    let resultsContainer = document.getElementById('searchResultsContainer');

    if(resultsContainer) {resultsContainer.innerHTML = ''}
        const buttonContainer = searchButton.parentElement;
        let sibling = buttonContainer.nextElementSibling;

while (sibling) {
  sibling.style.visibility = '';
  sibling.style.height = '';
  sibling.style.overflow = '';
  sibling = sibling.nextElementSibling;
}
  let current = buttonContainer.nextElementSibling;
  while (current && current !== tagContainer) {
    const next = current.nextElementSibling;
    current.remove();
    current = next;
  }


    // Clear search tag container
    searchTagContainer.innerHTML = '';

    // Re-enable interactive elements
    overlayInput.disabled = false;
    advancedToggle.disabled = false;
    document.getElementById('closeOverlay').disabled = false;
    methodTags.style.pointerEvents = '';
    difficultyTags.style.pointerEvents = '';
    problemTags.style.pointerEvents = '';

    // Reset button text
    searchButton.textContent = "SEARCH";
    searchToggled = false;
  if (tagContainer) {
    const fixedGap = 12; // adjust visually if needed
    tagContainer.style.marginTop = fixedGap + 'px';
  }

  }

});







