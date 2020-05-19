const form = document.querySelector('#form-search');
let fieldSearch = document.querySelector('#f-name');
let buttonSearch = document.querySelector('.btn');
let displayUsers = document.querySelector('#users');
let displayStats = document.querySelector('#statistics');
let searchField = null;
let text = null;

window.addEventListener('load', () => {

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  // Listeners
  fieldSearch.addEventListener('keyup', (event) => {
    searchField = event.target.value;
    if (searchField === null || searchField === '') {
      return;
    }
    featchResults(searchField);
  });

  buttonSearch.addEventListener('click', () => {
    if (searchField === null || searchField === '') {
      return;
    }
    featchResults(searchField);
  });

});

// Renders on my  - aqui é só passar o json
function render(users) {
  renderUsers(users);
};

function renderUsers(usersFetchs) {
  let peopleHTML = "<div>";
  peopleHTML += `<h5>${usersFetchs.length} usuário(s) encontrado(s)</h5>`;

  usersFetchs.forEach(person => {

    const { name, age, picture } = person;

    const personHTML = `
    <div id="results-box">
      <img src="${picture}" alt="name" />
      <span>${name}, ${age} anos</span>
    </div>
    `;

    peopleHTML += personHTML;
  });
  peopleHTML += "</div>";
  displayUsers.innerHTML = peopleHTML;

  renderStats(usersFetchs);
};

function renderStats(usersFetchs) {


  const totalMale = usersFetchs.filter(user => user.gender === "male").length;
  const totalFem = usersFetchs.filter(user => user.gender === "female").length;
  const totalAges = usersFetchs.reduce((acc, curr) => { return acc += curr.age; }, 0);
  let medianAge = (totalAges / usersFetchs.length);

  if (isNaN(medianAge)) {
    medianAge = 0;
  }

  let statsHTML = "<div id='stats-result'>";

  statsHTML += "<h5>Estatísticas:</h5>";

  const statHTML = `
    <span>Sexo masculino: <strong>${totalMale}</strong></span>
    <span>Sexo feminino: <strong>${totalFem}</strong></span>
    <span>Soma das idades: <strong>${totalAges}</strong></span>
    <span>Média das idades: <strong>${medianAge.toFixed(2).replace('.', ',')}</strong></span>
  `;
  statsHTML += statHTML;
  statsHTML += "</div>";
  displayStats.innerHTML = statsHTML;
};



function removeAcento(text) {
  text.toLowerCase();
  text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
  text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
  text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
  text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
  text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
  text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
  return text;
}

async function featchResults(searchField) {
  const data = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const users = await data.json();

  usersData = users.results.map(result => {
    const { gender, name, dob, picture } = result;


    // FIXED feito com remover acento no nameSearch e tambem no input no que entra lá no campo.
    return {
      name: name.first + ' ' + name.last,
      nameSearch: removeAcento(name.first.toLowerCase()) + ' ' + removeAcento(name.last.toLowerCase()),
      gender,
      age: dob.age,
      picture: picture.thumbnail
    };
  });

  searchField = removeAcento(searchField.toLowerCase());

  const usersFinal = usersData.filter(res => res.nameSearch.match(searchField));

  render(usersFinal);
}
