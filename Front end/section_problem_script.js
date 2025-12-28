window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("problems_set.json");
    const problems = await response.json();
    
    const currentPage = window.location.pathname.split("/").pop();
    
    const filteredProblems = problems.filter(p => p.section_html === currentPage);

    filteredProblems.forEach(problem => {
      const problemBox = document.getElementById(problem.id);
      if (!problemBox) return;

      // Problem tags
      const problemTagsDiv = document.createElement("div");
      problemTagsDiv.className = "problem-tags";
      problem.problemTags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        problemTagsDiv.appendChild(span);
      });

      // Method tags
      const methodTagsDiv = document.createElement("div");
      methodTagsDiv.className = "method-tags";
      problem.methodTags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        methodTagsDiv.appendChild(span);
      });

      // Insert right after the difficulty tag
      const difficultyDiv = problemBox.querySelector(".problem-tag");
      if (difficultyDiv) {
        difficultyDiv.insertAdjacentElement("afterend", problemTagsDiv);
        problemTagsDiv.insertAdjacentElement("afterend", methodTagsDiv);
      } else {
        problemBox.appendChild(problemTagsDiv);
        problemBox.appendChild(methodTagsDiv);
      }
    });
       // === SPOILER BUTTON FUNCTIONALITY ===
  const spoilerButton = document.getElementById("extra-button");
  let showing = false; // initial state = hidden

  spoilerButton.addEventListener("click", () => {
    const allMethodTags = document.querySelectorAll(".method-tags");
    showing = !showing; // toggle state

    allMethodTags.forEach(div => {
      div.style.display = showing ? "flex" : "none";
    });

    spoilerButton.textContent = showing
      ? "Hide techniques used"
      : "Show techniques used";
  });
  } catch (err) {
    console.error("Failed to load problems.json:", err);
  }
});

const sideNav = document.querySelector('.side-nav');
const mainBtn = document.querySelector('.main-nav-btn');

// Add "active" class on first hover
mainBtn.addEventListener('mouseenter', () => {
    sideNav.classList.add('active');
});

// Optional: remove "active" when leaving the button + submenu area
sideNav.addEventListener('mouseleave', () => {
    sideNav.classList.remove('active');
});
