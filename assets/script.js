var button = document.getElementById("btn");
const teamData = [];
let activeTeam;

var displayExcuse = function (team) {
  var excuseEl = document.querySelector("#excuse");
  excuseEl.textContent = "";
  excuseEl.textContent = generateExcuse(team);
};

function generateExcuse(players) {
  //accepts array of player names as argument
  var randomPlayer = players[Math.floor(Math.random() * players.length)];
  //list of excuses in an array
  const excuses = [
    `We played nano blade into 6 man!`,
    `${randomPlayer} charged them off the map!`,
    "We wanted to practice different comps!",
    "We weren't on main roles!",
    `${randomPlayer} was offroling!`,
    `The sun was in ${randomPlayer}'s eyes!`,
    `${randomPlayer} was fasting so he played poorly!`,
    `It was an external scrim and they lied about their SR!`,
    `${randomPlayer} wasn't there so we weren't at full strength.`,
    `We were just trolling.`,
    `They turned their cheats on.`
  ];
  var random = Math.floor(Math.random() * excuses.length);
  return excuses[random];
}

async function getTeams() {
  const event = await fetch("https://data.slmn.gg/thing/subdomain-bpl").then((res) => res.json());
  const teams = await Promise.all(
    event.teams.map(async (teamID) => {
      return await fetch(`https://data.slmn.gg/thing/${teamID}`).then((res) => res.json());
    })
  );
  return teams;
}

async function fillTeamData() {
    const teams = await getTeams();
    const playerList = await fetch("https://data.slmn.gg/thing/special:players").then((res) => res.json());
    const themes = [];
    teams.forEach(team => {
        if (!team.theme) return;
        themes.push(team.theme[0])
    });
    const teamThemes = await fetch(`https://data.slmn.gg/things/${themes.join(",")}`).then((res) => res.json());
    teams.forEach((team, teami) => {
        var teamObj = {
            name: team.name,
            players: [],
        }
        for (i = 0; i < team.players.length; i++) {
            let map = playerList.players.find(player => player.id === team.players[i])
            teamObj.players.push(map.name);
        }
        if (team.theme) {
            teamObj.theme = teamThemes.find(t => t.id === team.theme[0]);
        }
        teamData.push(teamObj);
    });
    console.log(teamData);
}

async function pageLoad() {
    const teamSelectEl = document.getElementById("my-team");
    teamData.forEach((team, i) => {
        if (!team) return;
        let color, logo, name;
        if (!team.name) return;
        name = team.name;
        if (team.theme?.color_logo_background) {
            color = team.theme.color_logo_background;
        }
        if (team.theme?.default_logo[0].thumbnails?.small?.url) {
            logo = team.theme.default_logo[0].thumbnails.small.url
        }
        let teamOptionEl = document.createElement("option");
        teamOptionEl.setAttribute("value", i + 1);
        teamOptionEl.innerText = name;
        if (color) teamOptionEl.setAttribute("style", `background-color:${color}`);
        if (logo) teamOptionEl.insertAdjacentHTML("afterbegin", `<img src="${logo}"></img>`)
        teamSelectEl.appendChild(teamOptionEl);
    })


  //code to make the dropdown selects function and look nice
  var x, i, j, l, ll, selElement, a, b, c;
  /* Look for any elements with the class "custom-select": */
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    selElement = x[i].getElementsByTagName("select")[0];
    ll = selElement.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElement.options[selElement.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
        create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElement.options[j].innerHTML;
      c.style.backgroundColor = selElement.options[j].style.backgroundColor;
      c.setAttribute("data-value", j);
      c.addEventListener("click", function(e) {
          activeTeam = teamData[this.dataset.value - 1];
          console.log(activeTeam)
        /* When an item is clicked, update the original select box,
            and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            h.style.backgroundColor = this.style.backgroundColor;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  
  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  document.addEventListener("click", closeAllSelect);
  button.addEventListener("click", () => displayExcuse(activeTeam.players));
}
async function main() {
    await fillTeamData();
    await pageLoad()
}
main();