let apiData = [];
let apiMetaData = {};
let apiUrl = `https://rickandmortyapi.com/api/character/?page=`; // API endpoint
// Step 1: Fetch data from the API
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
      displayDataTable(apiData); // Call function to display data in table
      addSearchFunctionality(apiData);
      addSortingFunctionality(apiData);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Function to display data in the table
function displayDataTable(characters) {
  const tableBody = document.getElementById('character-table-body');
  tableBody.innerHTML = ''; // Clear table body before displaying new data
  characters.forEach(character => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${character.name}</td>
      <td><img src="${character.image}" alt="${character.name}" ></td>
      <td>
        <button class="edit-button" data-id="${character.id}">Edit</button>
        <button class="delete-button" data-id="${character.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
    // Add event listener to edit button
    const editButton = row.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
      populateEditForm(character);
    });
    // Add event listener to delete button
    const deleteButton = row.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      deleteCharacter(character.id);
    });
  });
}

// Function to populate edit form with character data
function populateEditForm(character) {
  document.getElementById('new-entry-name').value = character.name;
  document.getElementById('new-entry-image').value = character.image;
  document.getElementById('new-entry-form').setAttribute('data-id', character.id); // Set data-id attribute for identification during submission
}

// Function to clear form fields
function clearForm() {
  document.getElementById('new-entry-name').value = '';
  document.getElementById('new-entry-image').value = '';
  document.getElementById('new-entry-form').removeAttribute('data-id'); // Remove data-id attribute
}

// Event listener for new entry form submission (both new entry and edit)
document.getElementById('new-entry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('new-entry-name').value;
  const image = document.getElementById('new-entry-image').value;
  const id = document.getElementById('new-entry-form').getAttribute('data-id'); // Get data-id attribute
  // Validate input
  if (!name || !image) {
    alert('Please provide both name and image URL.');
    return;
  }
  if (id) {
    // If data-id attribute exists, it's an edit operation
    editCharacter(id, name, image);
  } else {
    // Otherwise, it's a new entry
    addNewCharacter(name, image);
  }
});

// Function to edit character
function editCharacter(id, name, image) {
  const index = apiData.findIndex(character => character.id === parseInt(id)); // Find index of character in apiData array
  if (index !== -1) {
    apiData[index].name = name;
    apiData[index].image = image;
    displayDataTable(apiData); // Re-render table
    clearForm(); // Clear form after editing
  }
}

// Function to add new character
function addNewCharacter(name, image) {
  const newEntry = { name, image, id: apiData.length + 1 }; // Assuming each entry has an ID
  apiData.push(newEntry);
  displayDataTable(apiData);
  clearForm(); // Clear form after adding new character
}

// Function to delete character
function deleteCharacter(id) {
  apiData = apiData.filter(character => character.id !== id); // Remove character from apiData array
  displayDataTable(apiData); // Re-render table
}

// Function to update pagination buttons
const nextButton = document.getElementById('next-page');
const prevButton = document.getElementById('prev-page');

nextButton.addEventListener('click', () => {
  if (apiMetaData.next) {
    fetchData(apiMetaData.next); // Fetch data for the next page
  } else {
    nextButton.disabled = true; // Disable next button if there's no next page   
  }
});
prevButton.addEventListener('click', () => {

  if (apiMetaData.prev) {
    fetchData(apiMetaData.prev); // Fetch data for the previous page
  }
  else {
    prevButton.disabled = true; // Disable previous button if there's no previous page
  }
});

// Function to handle search
function addSearchFunctionality(data) {
  document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredCharacters = data.filter(character => character.name.toLowerCase().includes(searchTerm));
    displayDataTable(filteredCharacters);
  });
}

// Function to handle sorting
function addSortingFunctionality(data) {
  const tableHeaders = document.querySelectorAll('#character-table th');
  tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.dataset.column;
      const order = header.dataset.order;
      const sortedData = sortData(data, column, order);
      displayDataTable(sortedData);
      header.dataset.order = order === 'asc' ? 'desc' : 'asc'; // Toggle sorting order
    });
  });
}

// Function to sort data
function sortData(data, column, order) {
  return data.sort((a, b) => {
    if (order === 'asc') {
      return a[column] > b[column] ? 1 : -1;
    } else {
      return a[column] < b[column] ? 1 : -1;
    }
  });
}
