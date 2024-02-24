document.addEventListener('DOMContentLoaded', () => {
let apiData = [];
let apiMetaData = {};
let apiUrl = `https://rickandmortyapi.com/api/character/?page=`;
fetchData(apiUrl);

function fetchData(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      apiData = data.results;
      apiMetaData = data.info;
      displayDataTable(apiData); 
      addSearchFunctionality(apiData);
      addSortingFunctionality(apiData);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function displayDataTable(characters) {
  const tableBody = document.getElementById('character-table-body');
  clearTableBody(tableBody);
  characters.forEach(character => {
    const row = createTableRow(character);
    tableBody.appendChild(row);
    const editButton = row.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
      populateEditForm(character);
    });
    const deleteButton = row.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      deleteCharacter(character.id);
    });
  });
}

function clearTableBody(tableBody) {
  tableBody.innerHTML = '';
}

function createTableRow(character) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${character.name}</td>
    <td><img src="${character.image}" alt="${character.name}" ></td>
    <td>
      <button class="edit-button" data-id="${character.id}">Edit</button>
      <button class="delete-button" data-id="${character.id}">Delete</button>
    </td>
  `;
  return row;
}

function populateEditForm(character) {
  document.getElementById('new-entry-name').value = character.name;
  document.getElementById('new-entry-image').value = character.image;
  document.getElementById('new-entry-form').setAttribute('data-id', character.id);
}

function clearForm() {
  document.getElementById('new-entry-name').value = '';
  document.getElementById('new-entry-image').value = '';
  document.getElementById('new-entry-form').removeAttribute('data-id');
}

document.getElementById('new-entry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('new-entry-name').value;
  const image = document.getElementById('new-entry-image').value;
  const id = document.getElementById('new-entry-form').getAttribute('data-id');
  if (!name || !image) {
    alert('Please provide both name and image URL.');
    return;
  }
  if (id) {
    editCharacter(id, name, image);
  } else {
    addNewCharacter(name, image);
  }
});

function editCharacter(id, name, image) {
  const index = apiData.findIndex(character => character.id === parseInt(id));
  if (index !== -1) {
    apiData[index].name = name;
    apiData[index].image = image;
    displayDataTable(apiData);
    clearForm();
  }
}

function addNewCharacter(name, image) {
  const newEntry = { name, image, id: apiData.length + 1 };
  apiData.push(newEntry);
  displayDataTable(apiData);
  clearForm();
}

function deleteCharacter(id) {
  apiData = apiData.filter(character => character.id !== id);
  displayDataTable(apiData);
}

const nextButton = document.getElementById('next-page');
const prevButton = document.getElementById('prev-page');

nextButton.addEventListener('click', () => {
  if (apiMetaData.next) {
    fetchData(apiMetaData.next);
  } else {
    nextButton.disabled = true;
  }
});
prevButton.addEventListener('click', () => {
  if (apiMetaData.prev) {
    fetchData(apiMetaData.prev);
  } else {
    prevButton.disabled = true;
  }
});

function addSearchFunctionality(data) {
  document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredCharacters = data.filter(character => character.name.toLowerCase().includes(searchTerm));
    displayDataTable(filteredCharacters);
  });
}

function addSortingFunctionality(data) {
  const tableHeaders = document.querySelectorAll('#character-table th');
  tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.dataset.column;
      const order = header.dataset.order;
      const sortedData = sortData(data, column, order);
      displayDataTable(sortedData);
      header.dataset.order = order === 'asc' ? 'desc' : 'asc';
    });
  });
}

function sortData(data, column, order) {
  return data.sort((a, b) => {
    return order === 'asc' ? (a[column] > b[column] ? 1 : -1) : (a[column] < b[column] ? 1 : -1);
  });
}
});